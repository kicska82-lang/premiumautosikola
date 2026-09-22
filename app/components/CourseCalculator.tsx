"use client";

import Link from "next/link";
import { ArrowRight, Calculator, Check, CircleHelp, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { calculateTrainingCost, formatForints } from "@/lib/course-price";
import type { Course } from "@/types/content";

const expectedLessonOptions = [
  { value: 30, label: "30 óra", description: "Minimum" },
  { value: 50, label: "50 óra", description: "Átlagos" },
  { value: 70, label: "70 óra", description: "Biztos" },
];

function amount(value: string | null | undefined) {
  const values = (value ?? "").match(/\d[\d\s]*/g) ?? [];
  return Number(values.at(-1)?.replace(/\s/g, "")) || 0;
}

function extraLessonRate(course: Course) {
  return amount(course.price_details?.find((detail) => /pótóra/i.test(detail.label))?.value);
}

function requiredLessonCount(course: Course) {
  return (course.price_details ?? [])
    .filter((detail) => /járműkezelési|forgalmi/i.test(detail.label))
    .reduce((total, detail) => total + (Number(detail.value.match(/\d+/)?.[0]) || 0), 0);
}

export default function CourseCalculator({ courses }: { courses: Course[] }) {
  const availableCourses = courses.filter((course) => course.price_details?.length || course.price);
  const [selectedId, setSelectedId] = useState(availableCourses[0]?.id ?? "");
  const [expectedLessons, setExpectedLessons] = useState(30);
  const course = availableCourses.find((item) => item.id === selectedId) ?? availableCourses[0];

  const training = course ? calculateTrainingCost(course.price_details, course.price) : 0;
  const exam = course ? amount(course.exam_fee) : 0;
  const hourlyRate = course ? extraLessonRate(course) : 0;
  const requiredLessons = course ? requiredLessonCount(course) : 0;
  const extraLessons = Math.max(0, expectedLessons - requiredLessons);
  const extras = hourlyRate * extraLessons;
  const estimate = course ? { training, exam, hourlyRate, extras, requiredLessons, total: training + exam + extras } : null;

  if (!course || !estimate) return null;

  return (
    <section aria-labelledby="kalkulator-cim" className="mb-14 overflow-hidden rounded-3xl border border-amber-400/35 bg-gradient-to-br from-[#27395f] via-[#1d2a49] to-[#15203a] p-5 shadow-2xl shadow-black/30 md:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-6 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 text-amber-300"><Calculator className="h-5 w-5" /></span>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Költségkalkulátor</p>
        <h2 id="kalkulator-cim" className="text-2xl font-black text-white md:text-3xl">Számold ki a várható képzési költséget</h2>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-300">Válassz kategóriát és add meg, számoljunk-e várható pótórákkal. A kalkulátor mindig az adminban megadott aktuális díjakkal számol.</p>
      </div>

      <div className="mt-7 grid gap-7 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-7">
          <fieldset>
            <legend className="mb-3 text-sm font-bold text-white">1. Melyik képzés érdekel?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {availableCourses.map((item) => {
                const active = item.id === course.id;
                return <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); setExpectedLessons(30); }} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${active ? "border-amber-400 bg-amber-400/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/50"}`}><span className="font-bold">{item.icon} {item.title}</span>{active && <Check className="h-4 w-4 shrink-0 text-amber-400" />}</button>;
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-sm font-bold text-white">2. Várható óraszám <span className="group relative"><CircleHelp className="h-4 w-4 text-slate-400" /><span className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden w-56 -translate-x-1/2 rounded-lg bg-black p-2 text-xs font-normal text-slate-200 shadow-xl group-hover:block">A választott óraszám csak becslés. A képzés kötelező óraszámán felüli részt pótóraként számoljuk.</span></span></legend>
            <div className="grid grid-cols-3 gap-2">
              {expectedLessonOptions.map((option) => <button key={option.value} type="button" onClick={() => setExpectedLessons(option.value)} className={`rounded-xl border px-3 py-3 text-center transition ${expectedLessons === option.value ? "border-amber-400 bg-amber-400/15 text-amber-300" : "border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/50"}`}><span className="block text-lg font-black">{option.label}</span><span className="mt-1 block text-[11px] text-slate-400">{option.description}</span></button>)}
            </div>
          </fieldset>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-5 text-slate-300"><strong className="text-white">Fontos:</strong> a becslés a képzési díjat, a vizsgadíjat és az általad választott pótórákat tartalmazza. Az orvosi alkalmassági vizsgálat, elsősegélynyújtás és egyéb, külső szolgáltatónál fizetendő díjak nem részei az összegnek.</div>
        </div>

        <aside className="flex flex-col rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-400/15 to-amber-400/5 p-6">
          <p className="text-center text-sm text-slate-300">A <strong className="text-white">{course.title}</strong> várható költsége</p>
          <p className="my-5 text-center text-4xl font-black tracking-tight text-amber-400 md:text-5xl">{formatForints(estimate.total)}</p>
          <dl className="space-y-3 border-y border-white/10 py-4 text-sm"><div className="flex justify-between gap-3"><dt className="text-slate-300">Képzési díj ({estimate.requiredLessons} óra)</dt><dd className="font-bold text-white">{formatForints(estimate.training)}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-300">Vizsgadíj</dt><dd className="font-bold text-white">{formatForints(estimate.exam)}</dd></div>{extraLessons > 0 && <div className="flex justify-between gap-3"><dt className="flex items-center gap-1 text-slate-300"><Plus className="h-3.5 w-3.5" />{extraLessons} pótóra</dt><dd className="font-bold text-white">{formatForints(estimate.extras)}</dd></div>}{extraLessons === 0 && <div className="flex justify-between gap-3"><dt className="flex items-center gap-1 text-slate-300"><Minus className="h-3.5 w-3.5" />További pótóra</dt><dd className="font-bold text-white">Nincs</dd></div>}</dl>
          <Link href={`/jelentkezes?course=${encodeURIComponent(course.id)}`} className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-5 py-3 text-sm font-extrabold text-black transition hover:from-amber-200 hover:to-amber-400">Erre a képzésre jelentkezem <ArrowRight className="h-4 w-4" /></Link>
        </aside>
      </div>
    </section>
  );
}
