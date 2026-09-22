import ContentManager from "../ContentManager";
import { requireAdmin } from "@/lib/auth";
import { getAdminRecords } from "@/lib/content";
import type { Car } from "@/types/content";

export default async function Page() {
  await requireAdmin();
  const records = await getAdminRecords<Car>("cars");
  return <ContentManager table="cars" title="Autók" records={records} fields={[
    { name: "name", label: "Autó típusa" }, { name: "instructor", label: "Oktató neve" }, { name: "transmission", label: "Váltó" }, { name: "climate", label: "Klíma" }, { name: "image", label: "Borítókép", type: "image" }, { name: "gallery_images", label: "Galéria képei (JSON, legfeljebb 5)", type: "json", required: false },
  ]} />;
}
