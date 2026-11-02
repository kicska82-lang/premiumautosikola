import { requireAdmin } from "@/lib/auth";
import ExamRouteManager from "./ExamRouteManager";
import { defaultExamRoutes } from "@/lib/exam-routes";

export const dynamic = "force-dynamic";

export default async function ExamRoutesAdminPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("exam_routes")
    .select("id,name,streets,color,path,stops,is_published,sort_order")
    .order("sort_order", { ascending: true });

  return <div className="mx-auto max-w-7xl">
    <div className="mb-6">
      <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Mobilalkalmazás · központi adatok</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900">Vizsgaútvonalak</h1>
      <p className="mt-2 max-w-3xl text-slate-600">Illeszd be a tényleges utcákon felvett koordinátapontokat sorrendben. A mentett, de nem közzétett útvonalat csak az admin látja; a tanulói alkalmazás kizárólag a jóváhagyott változatot tölti be.</p>
    </div>
    {error ? <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
      <h2 className="font-black">A közös útvonal-adatbázis még nincs bekapcsolva</h2>
      <p className="mt-2 text-sm">Telepíteni kell a <code>202611030001_exam_routes.sql</code> adatbázis-migrációt. A régi, pontatlan útvonalakat szándékosan nem mutatjuk alapértelmezésként a tanulóknak.</p>
    </div> : <ExamRouteManager initialRoutes={(data?.length ? data : defaultExamRoutes) as never} />}
  </div>;
}
