import ContentManager from "../ContentManager";
import { requireAdmin } from "@/lib/auth";
import { getAdminRecords } from "@/lib/content";
import type { Course } from "@/types/content";

export default async function Page() {
  await requireAdmin();
  const records = await getAdminRecords<Course>("courses");
  return <ContentManager table="courses" title="Képzések" records={records} fields={[
    { name: "title", label: "Megnevezés" }, { name: "price", label: "Teljes képzési díj (a díjtételekből számolva)" }, { name: "minimum_age", label: "Minimum életkor", required: false }, { name: "exam_fee", label: "Vizsgadíj", required: false }, { name: "price_details", label: "Árlista tételei (JSON)", type: "json", required: false }, { name: "icon", label: "Ikon (emoji)" }, { name: "features", label: "Előnyök (soronként)", type: "textarea" },
  ]} />;
}
