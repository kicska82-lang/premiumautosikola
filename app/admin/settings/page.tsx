import SingletonForm from "../SingletonForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminSingleton } from "@/lib/content";
import type { SiteSettings } from "@/types/content";

export default async function Page() {
  await requireAdmin();
  const settings = await getAdminSingleton<SiteSettings>("site_settings");
  return <div><h1 className="mb-8 text-4xl font-bold">Oldalbeállítások</h1><SingletonForm kind="settings" values={settings} /></div>;
}
