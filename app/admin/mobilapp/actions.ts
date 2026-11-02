"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  role: z.enum(["instructor", "student"]),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9._-]{2,30}$/, "A felhasználónév 3–31 kisbetűs karakterből, számból, pontból, kötőjelből vagy aláhúzásból állhat."),
  displayName: z.string().trim().min(2).max(120),
  contractId: z.string().uuid().optional(),
  instructorId: z.string().uuid().optional(),
  isTestAccount: z.boolean().default(false),
  premiumActive: z.boolean().default(false),
});

function temporaryPassword() {
  return `${randomBytes(9).toString("base64url")}A1!`;
}

export async function createMobileAccount(raw: z.input<typeof schema>) {
  await requireAdmin();
  const input = schema.parse(raw);
  if (input.role === "student" && (!input.instructorId || (input.isTestAccount ? input.contractId : !input.contractId))) {
    throw new Error("Tanulói fiókhoz oktatót és — tesztfiók kivételével — képzési szerződést kell választani.");
  }
  if (input.role === "instructor" && (input.contractId || input.instructorId || input.isTestAccount)) {
    throw new Error("Az oktatói fiókhoz nem kell tanulói szerződést, oktatót vagy tesztfiók-jelölést megadni.");
  }

  const admin = createAdminClient();
  const username = input.username;
  const { data: existing } = await admin.from("mobile_profiles").select("user_id").eq("username", username).maybeSingle();
  if (existing) throw new Error("Ez a felhasználónév már foglalt.");

  let displayName = input.displayName;
  let studentCategory: string | null = null;
  if (input.role === "student") {
    const { data: instructor, error: instructorError } = await admin.from("mobile_profiles")
      .select("user_id").eq("user_id", input.instructorId!).eq("role", "instructor").eq("is_active", true).single();
    if (instructorError || !instructor) throw new Error("A kiválasztott oktatói mobilfiók nem aktív vagy nem található.");
    if (input.isTestAccount) {
      if (!input.premiumActive) throw new Error("A tesztfiókhoz kapcsold be a próba prémium-hozzáférést.");
      studentCategory = "B";
    } else {
      const { data: contract, error } = await admin.from("training_contracts")
        .select("id, student_name, course_category, status")
        .eq("id", input.contractId!).single();
      if (error || !contract) throw new Error("A kiválasztott képzési szerződés nem található.");
      if (contract.status !== "active") throw new Error("Csak aktív képzési szerződéshez hozható létre tanulói fiók.");
      displayName = contract.student_name;
      studentCategory = contract.course_category;
    }
  }

  const password = temporaryPassword();
  const authEmail = `${username}@login.premiumautosiskola.hu`;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: authEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: displayName, username },
  });
  if (createError) throw new Error(`A fiók létrehozása nem sikerült: ${createError.message}`);
  const userId = created.user.id;

  try {
    const { error: profileError } = await admin.from("mobile_profiles").insert({
      user_id: userId,
      username,
      role: input.role,
      display_name: displayName,
      student_contract_id: input.role === "student" && !input.isTestAccount ? input.contractId : null,
      student_category: studentCategory,
      is_test_account: input.role === "student" && input.isTestAccount,
      premium_active: input.role === "student" && (input.isTestAccount || input.premiumActive),
    });
    if (profileError) throw new Error(`A mobilprofil mentése nem sikerült: ${profileError.message}`);

    if (input.role === "student") {
      const { error: assignmentError } = await admin.from("mobile_instructor_students").insert({
        instructor_user_id: input.instructorId,
        student_user_id: userId,
      });
      if (assignmentError) throw new Error(`Az oktató hozzárendelése nem sikerült: ${assignmentError.message}`);
    }
  } catch (error) {
    await admin.auth.admin.deleteUser(userId);
    throw error;
  }

  revalidatePath("/admin/mobilapp");
  return { username, password, role: input.role, isTestAccount: input.isTestAccount };
}

export async function setMobilePremiumActive(userId: string, active: boolean) {
  await requireAdmin();
  const id = z.string().uuid().parse(userId);
  const admin = createAdminClient();
  const { error } = await admin.from("mobile_profiles").update({ premium_active: active }).eq("user_id", id).eq("role", "student");
  if (error) throw new Error(`A prémium-hozzáférés módosítása nem sikerült: ${error.message}`);
  revalidatePath("/admin/mobilapp");
  return { active };
}

export async function provisionMissingInstructorAccounts() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: websiteInstructors, error: sourceError }, { data: profiles, error: profileError }] = await Promise.all([
    admin.from("instructors").select("id, name").eq("status", "published").order("sort_order"),
    admin.from("mobile_profiles").select("user_id, username, role, display_name, source_instructor_key").eq("role", "instructor"),
  ]);
  if (sourceError || profileError) throw new Error(`Az oktatói lista nem tölthető be: ${sourceError?.message ?? profileError?.message}`);

  const known = profiles ?? [];
  const credentials: { name: string; username: string; password: string }[] = [];
  const skipped: string[] = [];
  const failures: string[] = [];
  const slug = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "").slice(0, 18) || "oktato";

  for (const instructor of websiteInstructors ?? []) {
    const sourceKey = String(instructor.id);
    if (known.some((profile) => profile.source_instructor_key === sourceKey)) { skipped.push(instructor.name); continue; }
    const sameName = known.find((profile) => profile.display_name.trim().toLocaleLowerCase("hu-HU") === instructor.name.trim().toLocaleLowerCase("hu-HU"));
    if (sameName) {
      const { error: authUpdateError } = await admin.auth.admin.updateUserById(sameName.user_id, {
        email: `${sameName.username}@login.premiumautosiskola.hu`, email_confirm: true,
      });
      if (authUpdateError) { failures.push(`${instructor.name}: a belépési név átállítása nem sikerült: ${authUpdateError.message}`); continue; }
      const { error } = await admin.from("mobile_profiles").update({ source_instructor_key: sourceKey }).eq("user_id", sameName.user_id);
      if (error) failures.push(`${instructor.name}: ${error.message}`);
      else skipped.push(instructor.name);
      continue;
    }

    const suffix = sourceKey.replace(/[^a-z0-9]/gi, "").slice(-5).toLowerCase().padStart(5, "0");
    const username = `oktato.${slug(instructor.name)}.${suffix}`.slice(0, 31);
    const password = temporaryPassword();
    const { data: created, error: authError } = await admin.auth.admin.createUser({
      email: `${username}@login.premiumautosiskola.hu`, password, email_confirm: true,
      user_metadata: { full_name: instructor.name, username },
    });
    if (authError) { failures.push(`${instructor.name}: ${authError.message}`); continue; }

    const { error: insertError } = await admin.from("mobile_profiles").insert({
      user_id: created.user.id, username, role: "instructor", display_name: instructor.name,
      is_active: true, premium_active: false, is_test_account: false, source_instructor_key: sourceKey,
    });
    if (insertError) {
      await admin.auth.admin.deleteUser(created.user.id);
      failures.push(`${instructor.name}: ${insertError.message}`);
      continue;
    }
    known.push({ user_id: created.user.id, username, role: "instructor", display_name: instructor.name, source_instructor_key: sourceKey });
    credentials.push({ name: instructor.name, username, password });
  }

  revalidatePath("/admin/mobilapp");
  return { credentials, skipped, failures };
}
