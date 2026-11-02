"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

const contractSchema = z.object({
  contractNumber: z.string().trim().min(1, "A szerződésszám kötelező.").max(80),
  signedAt: z.iso.date(),
  name: z.string().trim().min(2, "A tanuló neve kötelező.").max(150),
  birthName: z.string().trim().min(2).max(150),
  birthPlace: z.string().trim().min(1).max(120),
  birthDate: z.iso.date(),
  motherName: z.string().trim().min(2).max(150),
  address: z.string().trim().min(5).max(300),
  phone: z.string().trim().min(5).max(50),
  email: z.string().trim().email("Hibás e-mail-cím.").or(z.literal("")),
  category: z.enum(["B", "AM", "A1", "A2", "A"]),
  guardianName: z.string().trim().max(150),
  guardianAddress: z.string().trim().max(300),
  theoryFee: z.string().trim().min(1).max(50),
  practiceHourlyFee: z.string().trim().min(1).max(50),
  extraHourlyFee: z.string().trim().min(1).max(50),
  theoryExamFee: z.string().trim().min(1).max(50),
  practicalExamFee: z.string().trim().min(1).max(50),
  practiceLocation: z.string().trim().min(5).max(1000),
});

export type ContractInput = z.infer<typeof contractSchema>;

async function nextContractNumber(supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"], signedAt: string) {
  const year = Number(signedAt.slice(0, 4));
  const { data, error } = await supabase
    .from("training_contracts")
    .select("contract_number")
    .eq("contract_year", year)
    .order("contract_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`A következő szerződésszám nem állapítható meg: ${error.message}`);
  const match = data?.contract_number?.match(/-(\d+)$/);
  const nextValue = (match ? Number(match[1]) : 0) + 1;
  return `PA-${year}-${String(nextValue).padStart(4, "0")}`;
}

export async function saveTrainingContract(id: string | null, raw: ContractInput) {
  const data = contractSchema.parse(raw);
  const { supabase, user } = await requireAdmin();
  const payload = {
    signed_at: data.signedAt,
    student_name: data.name,
    student_birth_name: data.birthName,
    student_birth_place: data.birthPlace,
    student_birth_date: data.birthDate,
    student_mother_name: data.motherName,
    student_address: data.address,
    student_phone: data.phone,
    student_email: data.email,
    course_category: data.category,
    guardian_name: data.guardianName,
    guardian_address: data.guardianAddress,
    theory_fee: data.theoryFee,
    practice_hourly_fee: data.practiceHourlyFee,
    extra_hourly_fee: data.extraHourlyFee,
    theory_exam_fee: data.theoryExamFee,
    practical_exam_fee: data.practicalExamFee,
    practice_location: data.practiceLocation,
    document_snapshot: data,
    privacy_notice_version: "2026-10-12",
  };

  let saved: { id: string; contract_number: string } | null = null;
  if (id) {
    const { data: updated, error } = await supabase.from("training_contracts")
      .update({ ...payload, contract_number: data.contractNumber })
      .eq("id", z.string().uuid().parse(id)).select("id, contract_number").single();
    if (error) throw new Error(`A mentés nem sikerült: ${error.message}`);
    saved = updated;
  } else {
    for (let attempt = 0; attempt < 5 && !saved; attempt += 1) {
      const contractNumber = await nextContractNumber(supabase, data.signedAt);
      const { data: inserted, error } = await supabase.from("training_contracts")
        .insert({ ...payload, contract_number: contractNumber, created_by: user.id })
        .select("id, contract_number").single();
      if (!error) saved = inserted;
      else if (error.code !== "23505") throw new Error(`A mentés nem sikerült: ${error.message}`);
    }
    if (!saved) throw new Error("A szerződésszám kiosztása többszöri próbálkozásra sem sikerült.");
  }
  if (!id) {
    const { error: snapshotError } = await supabase
      .from("training_contracts")
      .update({ document_snapshot: { ...data, contractNumber: saved.contract_number } })
      .eq("id", saved.id);
    if (snapshotError) throw new Error(`A dokumentumpillanatkép mentése nem sikerült: ${snapshotError.message}`);
  }
  revalidatePath("/admin/szerzodesek");
  return { id: saved.id, contractNumber: saved.contract_number, message: id ? "A szerződés módosításai elmentve." : `A szerződés ${saved.contract_number} számon bekerült a nyilvántartásba.` };
}
