import SingletonForm from "../SingletonForm";
import { requireAdmin } from "@/lib/auth";
import { getAdminSingleton } from "@/lib/content";
import type { HeroContent } from "@/types/content";

export default async function Page() {
  await requireAdmin();
  const hero = await getAdminSingleton<HeroContent>("hero");
  return <div><h1 className="mb-8 text-4xl font-bold">Hero</h1><SingletonForm kind="hero" values={hero} /></div>;
}
