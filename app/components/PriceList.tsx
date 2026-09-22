import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import CourseCards from "./CourseCards";
import type { Course } from "@/types/content";

export default function PriceList({ courses }: { courses: Course[] }) {
  return <main className="relative isolate min-h-screen overflow-hidden bg-[#15203a] pb-28 pt-36 text-white">
    <Image src="/images/hero-bg.png" alt="" fill sizes="100vw" className="-z-30 object-cover object-center opacity-20" />
    <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.16),transparent_34%),linear-gradient(to_bottom,rgba(21,32,58,0.72),#15203a_32rem)]" />

    <section className="mx-auto max-w-7xl px-6">
      <div className="mx-auto mb-14 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-300"><ShieldCheck className="h-4 w-4" />Képzéseink</div>
        <h1 className="mt-6 text-4xl font-black uppercase italic tracking-tight sm:text-5xl">Találd meg a <span className="text-amber-400">neked való</span> képzést</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">Átlátható díjak, pontos képzési tételek és szakértő támogatás az első lépéstől a sikeres vizsgáig.</p>
        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3"><div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200"><span className="block text-xl font-black text-amber-400">12</span>Képzési forma</div><div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200"><span className="block text-xl font-black text-amber-400">100%</span>Átlátható díjak</div><div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-200"><span className="block text-xl font-black text-amber-400">15+</span>Év tapasztalat</div></div>
      </div>

      <CourseCards courses={courses} />
    </section>
  </main>;
}
