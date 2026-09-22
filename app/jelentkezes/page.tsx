import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getPublicContent } from "@/lib/content";
import ApplicationForm from "./ApplicationForm";

export default async function ApplicationPage({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const [content, { course }] = await Promise.all([getPublicContent(), searchParams]);
  return <><Header /><main className="min-h-screen bg-[#15203a] pb-24 pt-32 text-white"><div className="mx-auto max-w-5xl px-6"><p className="text-xl font-semibold uppercase tracking-[0.25em] text-amber-400">Online jelentkezés</p><h1 className="mt-4 text-4xl font-black md:text-5xl">Indulj el a jogosítvány felé</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Töltsd ki az űrlapot néhány perc alatt. A kiválasztott képzés díját a jelentkezéseddel együtt rögzítjük.</p><div className="mt-12"><ApplicationForm courses={content.courses.map(({ id, title, price }) => ({ id, title, price }))} initialCourseId={course} /></div></div></main><Footer settings={content.settings} /></>;
}
