"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateTrainingCost, formatForints } from "@/lib/course-price";

const schema = z.object({
  course_id: z.string().uuid(), first_name: z.string().min(1), last_name: z.string().min(1), middle_name: z.string().optional(),
  birth_last_name: z.string().optional(), birth_first_name: z.string().optional(), birth_middle_name: z.string().optional(),
  birth_place: z.string().min(1), birth_date: z.string().min(1), citizenship: z.string().min(1),
  mother_last_name: z.string().min(1), mother_first_name: z.string().min(1), mother_middle_name: z.string().optional(),
  applicant_age: z.enum(["adult", "minor"]), guardian_name: z.string().optional(), guardian_phone: z.string().optional(), guardian_email: z.string().optional(),
  phone: z.string().min(6), email: z.string().email(), postal_code: z.string().min(4), city: z.string().min(1), street_address: z.string().min(1), mailing_address: z.string().optional(),
  identity_number: z.string().min(1), identity_expiry: z.string().min(1), tax_id: z.string().min(1), education: z.string().min(1), applicant_type: z.enum(["beginner", "transfer"]),
  licence_status: z.enum(["none", "has"]), licence_number: z.string().optional(), medical_fitness: z.enum(["none", "has"]), privacy_consent: z.literal("on"), honeypot: z.string().optional(),
});

export async function submitApplication(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = schema.parse(raw);
  if (data.honeypot) return { ok: true };
  if (data.applicant_age === "minor" && (!data.guardian_name || !data.guardian_phone || !data.guardian_email)) throw new Error("Kiskorú jelentkezőnél a gondviselő adatai kötelezők.");
  if (data.licence_status === "has" && !data.licence_number) throw new Error("Add meg a jogosítvány számát.");

  const supabase = await createClient();
  const { data: course, error: courseError } = await supabase.from("courses").select("id,title,price,price_details").eq("id", data.course_id).eq("status", "published").maybeSingle();
  if (courseError || !course) throw new Error("A kiválasztott képzés már nem elérhető.");

  const applicationId = crypto.randomUUID();
  const medicalDocument = formData.get("medical_document");
  let medicalDocumentPath: string | null = null;

  if (medicalDocument instanceof File && medicalDocument.size > 0) {
    const allowedTypes = new Map([
      ["application/pdf", "pdf"], ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"],
    ]);
    const extension = allowedTypes.get(medicalDocument.type);

    if (!extension) throw new Error("Az orvosi alkalmassági igazolás csak PDF, JPG, PNG vagy WEBP formátumban tölthető fel.");
    if (medicalDocument.size > 8 * 1024 * 1024) throw new Error("Az orvosi alkalmassági igazolás legfeljebb 8 MB lehet.");

    medicalDocumentPath = `applications/${applicationId}/medical-eligibility.${extension}`;
    const adminSupabase = createAdminClient();
    const { error: uploadError } = await adminSupabase.storage
      .from("application-documents")
      .upload(medicalDocumentPath, medicalDocument, { contentType: medicalDocument.type, upsert: false });

    if (uploadError) throw new Error("A dokumentum feltöltése nem sikerült. Kérjük, próbáld újra később.");
  }

  const applicationData = Object.fromEntries(Object.entries(data).filter(([key]) => !["course_id", "privacy_consent", "honeypot"].includes(key)));
  const { error } = await supabase.from("applications").insert({
    id: applicationId, course_id: data.course_id, course_title: course.title, committed_price: formatForints(calculateTrainingCost(course.price_details, course.price)), application_data: { ...applicationData, preferred_driving_times: formData.getAll("preferred_driving_times") }, medical_document_path: medicalDocumentPath, privacy_consent: true, privacy_consent_at: new Date().toISOString(),
  });
  if (error) {
    if (medicalDocumentPath) await createAdminClient().storage.from("application-documents").remove([medicalDocumentPath]);
    throw new Error("A jelentkezés mentése nem sikerült. Kérjük, próbáld újra később.");
  }
  return { ok: true };
}
