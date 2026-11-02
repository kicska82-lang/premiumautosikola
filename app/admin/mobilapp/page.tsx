import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import MobileAccountForm from "./MobileAccountForm";
import PremiumAccessToggle from "./PremiumAccessToggle";
import ProvisionInstructors from "./ProvisionInstructors";

export const dynamic = "force-dynamic";

export default async function MobileAccountsPage() {
  await requireAdmin();
  let contracts: { id: string; student_name: string; student_email: string; course_category: string; contract_number: string }[] = [];
  let profiles: { user_id: string; username: string; role: string; display_name: string; is_active: boolean; premium_active: boolean }[] = [];
  let websiteInstructorCount = 0;
  let setupError: string | null = null;
  try {
    const admin = createAdminClient();
    const [contractResult, profileResult, instructorResult] = await Promise.all([
      admin.from("training_contracts").select("id, contract_number, student_name, student_email, course_category, status").eq("status", "active").order("signed_at", { ascending: false }),
      admin.from("mobile_profiles").select("user_id, username, role, display_name, is_active, premium_active").order("display_name"),
      admin.from("instructors").select("id").eq("status", "published"),
    ]);
    setupError = contractResult.error?.message ?? profileResult.error?.message ?? instructorResult.error?.message ?? null;
    contracts = contractResult.data ?? [];
    profiles = profileResult.data ?? [];
    websiteInstructorCount = instructorResult.data?.length ?? 0;
  } catch (error) {
    setupError = error instanceof Error ? error.message : "Az adatbázis-kapcsolat nincs beállítva.";
  }
  const instructors = (profiles ?? []).filter((profile) => profile.role === "instructor" && profile.is_active);

  return <div className="mx-auto max-w-6xl space-y-6">
    <header><p className="text-sm font-bold uppercase tracking-wider text-amber-700">Prémium oktatói–tanulói portál</p><h1 className="mt-1 text-3xl font-bold">Mobilalkalmazás-fiókok</h1><p className="mt-2 max-w-3xl text-slate-600">Először hozz létre oktatói fiókot, utána rendelj hozzá teszt- vagy szerződéses tanulót. A felhasználónév és az egyszer használatos jelszó itt készül.</p></header>
    {setupError ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">Az adatbázis még nincs előkészítve vagy nem érhető el: {setupError}. Telepítsd a projekt README-jében jelölt migrációt, és állítsd be a szerveroldali `SUPABASE_SERVICE_ROLE_KEY` kulcsot.</div> : <><ProvisionInstructors count={websiteInstructorCount} /><MobileAccountForm contracts={contracts} instructors={instructors} /></>}
    <section className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold">Aktív mobilfiókok ({(profiles ?? []).filter((profile) => profile.is_active).length})</h2><div className="mt-4 divide-y">{(profiles ?? []).filter((profile) => profile.is_active).map((profile) => <div key={profile.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><span className="font-semibold">{profile.display_name}</span><span className="ml-2 font-mono text-xs text-slate-500">@{profile.username}</span><span className="ml-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{profile.role === "instructor" ? "Oktató" : "Tanuló"}</span></div>{profile.role === "student" && <PremiumAccessToggle userId={profile.user_id} active={profile.premium_active} />}</div>)}{!profiles?.length && <p className="text-sm text-slate-500">Még nincs mobilalkalmazás-fiók.</p>}</div></section>
    <p className="text-xs text-slate-500">A térképes alaptérkép OpenStreetMap-csempéket tölt be, a vezetési útvonal pedig csak a rögzítés idején gyűjtött GPS-pontokból rajzolódik ki. Térképcsempéhez internetkapcsolat kell.</p>
  </div>;
}
