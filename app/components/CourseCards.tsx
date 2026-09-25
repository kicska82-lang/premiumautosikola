"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Clock3, FileText, GraduationCap } from "lucide-react";
import { useRef } from "react";
import { calculateTrainingCost, displayedDetailValue, formatForints } from "@/lib/course-price";
import type { Course } from "@/types/content";
import { courseSlug } from "@/lib/course-details";

export default function CourseCards({ courses }: { courses: Course[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * Math.min(920, railRef.current.clientWidth * 0.9), behavior: "smooth" });
  if (courses.length === 0) {
    return <p className="rounded-2xl border border-amber-400/30 bg-white/5 p-8 text-center text-slate-300">A képzések feltöltés alatt állnak.</p>;
  }

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-end gap-3">
        <p className="mr-auto text-sm text-slate-400">Húzd oldalra, vagy lapozz a kategóriák között.</p>
        <button type="button" onClick={() => move(-1)} aria-label="Előző képzések" className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-amber-400 hover:text-amber-300"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" onClick={() => move(1)} aria-label="Következő képzések" className="grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-amber-400 hover:text-amber-300"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div ref={railRef} className="-mx-6 flex snap-x snap-mandatory gap-7 overflow-x-auto px-6 pb-5 [scrollbar-color:#fbbf24_#1d2a49] [scrollbar-width:thin]">
      {courses.map((course, index) => {
        const trainingCost = formatForints(calculateTrainingCost(course.price_details, course.price));

        return (
          <article key={course.id} className="group relative flex min-h-full w-[min(86vw,360px)] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1d2a49]/90 p-7 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-2 hover:border-amber-400/70 hover:shadow-amber-500/10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent opacity-70" />
            {index === 0 && <span className="absolute right-0 top-5 rounded-l-full bg-amber-400 px-4 py-1 text-xs font-black uppercase tracking-wide text-black">Legnépszerűbb</span>}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/10 text-3xl shadow-inner shadow-amber-400/10" aria-hidden>{course.icon}</div>
                <h2 className="mt-5 text-2xl font-black text-white">{course.title}</h2>
              </div>
              <GraduationCap className="h-7 w-7 text-amber-400" />
            </div>
            {course.minimum_age && <p className="mt-4 flex items-center gap-2 text-sm text-slate-300"><Clock3 className="h-4 w-4 text-amber-400" />Minimum életkor: <strong className="text-white">{course.minimum_age}</strong></p>}
            <div className="my-6 rounded-2xl border border-white/8 bg-black/25 p-4">
              {(course.price_details ?? []).length > 0 ? <dl className="divide-y divide-white/10">{course.price_details?.map((detail) => <div key={detail.label} className="flex items-baseline justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"><dt className="text-slate-300">{detail.label}</dt><dd className="text-right font-bold text-white">{displayedDetailValue(detail)}</dd></div>)}</dl> : <p className="text-sm text-slate-400">A részletes díjtételek hamarosan elérhetők.</p>}
            </div>
            <div className="flex items-end justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Képzési díj</p><p className="mt-1 text-3xl font-black text-amber-400">{trainingCost}</p></div>{course.exam_fee && <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right"><p className="text-[10px] uppercase tracking-wide text-slate-400">Vizsgadíj</p><p className="mt-1 text-sm font-bold text-white">{course.exam_fee}</p></div>}</div>
            <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-slate-300">{course.features.slice(0, 3).map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />{feature}</li>)}</ul>
            <Link href={`/kepzesek/${courseSlug(course)}`} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-5 py-3 font-extrabold text-black transition hover:from-amber-200 hover:to-amber-400"><FileText className="h-4 w-4" />Részletek és jelentkezés<ArrowRight className="h-4 w-4" /></Link>
          </article>
        );
      })}
      </div>
    </div>
  );
}
