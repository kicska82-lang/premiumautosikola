import ContentManager from "../ContentManager";
import { requireAdmin } from "@/lib/auth";
import { getAdminRecords } from "@/lib/content";
import type { Instructor } from "@/types/content";

export default async function Page() {
  await requireAdmin();
  const records = await getAdminRecords<Instructor>("instructors");
  return <ContentManager table="instructors" title="Oktatók" records={records} fields={[
    { name: "name", label: "Név" }, { name: "category", label: "Kategória" }, { name: "experience", label: "Tapasztalat" },
    { name: "description", label: "Bemutatkozás", type: "textarea" }, { name: "image", label: "Kép", type: "image" },
    { name: "availability", label: "Oktatási naptár", type: "availability", required: false },
  ]} />;
}
