import { CalendarDays, Clock3 } from "lucide-react";
import type { Instructor, WeeklyAvailability } from "@/types/content";

const weekDays = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

function slotsForDay(slots: WeeklyAvailability[] | undefined, day: string) {
  return (slots ?? [])
    .filter((slot) => slot.day === day)
    .sort((first, second) => first.from.localeCompare(second.from));
}

export default function InstructorCalendar({ instructors }: { instructors: Instructor[] }) {
  return (
    <section aria-labelledby="oktatok-naptara" className="mt-8 overflow-hidden rounded-2xl border border-amber-400/25 bg-[#1d2a49] shadow-xl shadow-black/20">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-gradient-to-r from-amber-400/10 to-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-[#050816]"><CalendarDays className="h-5 w-5" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300">Heti elérhetőségek</p><h2 id="oktatok-naptara" className="mt-0.5 text-xl font-black text-white">Oktatóink naptára</h2></div></div>
        <p className="max-w-md text-sm leading-6 text-slate-300">Az idősávok tájékoztató jellegűek. A végleges vezetési időpontot az oktatóval egyeztetjük.</p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px] p-3 sm:p-4">
          <div className="grid grid-cols-[170px_repeat(7,minmax(90px,1fr))] overflow-hidden rounded-xl border border-white/10">
            <div className="border-b border-r border-white/10 bg-black/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">Oktató</div>
            {weekDays.map((day) => <div key={day} className="border-b border-r border-white/10 bg-black/20 px-3 py-3 text-center text-xs font-bold uppercase tracking-wider text-amber-300 last:border-r-0">{day}</div>)}
            {instructors.map((instructor) => <InstructorRow key={instructor.id} instructor={instructor} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstructorRow({ instructor }: { instructor: Instructor }) {
  return <>
    <div className="border-b border-r border-white/10 bg-white/[0.025] px-4 py-3 last:border-b-0"><p className="text-sm font-bold text-white">{instructor.name}</p><p className="mt-0.5 text-xs text-amber-300">{instructor.category}</p></div>
    {weekDays.map((day) => {
      const slots = slotsForDay(instructor.availability, day);
      return <div key={day} className="flex min-h-[64px] flex-col justify-center border-b border-r border-white/10 px-2 py-2 text-center last:border-r-0">
        {slots.length > 0 ? <div className="space-y-1.5">{slots.map((slot, index) => <span key={`${slot.from}-${slot.to}-${index}`} className="inline-flex items-center justify-center gap-1 rounded-lg border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-xs font-bold text-amber-100"><Clock3 className="h-3 w-3 text-amber-300" />{slot.from}–{slot.to}</span>)}</div> : <span className="text-xs text-slate-500">–</span>}
      </div>;
    })}
  </>;
}
