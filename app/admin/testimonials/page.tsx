import ContentManager from "../ContentManager";
import { requireAdmin } from "@/lib/auth";
import { getAdminRecords } from "@/lib/content";
import type { Testimonial } from "@/types/content";

export default async function Page() {
  await requireAdmin();
  const records = await getAdminRecords<Testimonial>("testimonials");
  return <ContentManager table="testimonials" title="Vélemények" records={records} fields={[
    { name: "name", label: "Név" }, { name: "text", label: "Vélemény", type: "textarea" }, { name: "rating", label: "Értékelés (1–5)", type: "number" }, { name: "source", label: "Forrás" },
  ]} />;
}
