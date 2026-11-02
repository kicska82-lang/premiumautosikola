"use client";

import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import { type GpsPoint, type SavedDrive, useDriveTracker } from "./useDriveTracker";
import RouteMap from "./RouteMap";
import MobileDriveLog from "./MobileDriveLog";
import { createClient } from "@/lib/supabase/client";
import { defaultExamRoutes, type ExamRoute } from "@/lib/exam-routes";
import {
  ArrowLeft,
  BookOpenCheck,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  ExternalLink,
  Gauge,
  GraduationCap,
  Home,
  Info,
  ImageOff,
  MapPin,
  MapPinned,
  Navigation,
  Pencil,
  Play,
  Plus,
  Save,
  ShieldCheck,
  Star,
  StopCircle,
  Trash2,
  Trophy,
  X,
} from "./icons";

type Tab = "home" | "calendar" | "log" | "practice" | "routes" | "profile";
const lessonTypes = [
  { name: "Alapoktatás", minimum: 9 },
  { name: "Országúti vezetés", minimum: 4 },
  { name: "Városi vezetés", minimum: 14 },
  { name: "Éjszakai vezetés", minimum: 2 },
] as const;
type LessonType = (typeof lessonTypes)[number]["name"];
const examRoutes = defaultExamRoutes;

const lessons = [
  { day: "08", month: "OKT", time: "14:00–15:40", title: "Városi vezetés", instructor: "Kicska Gábor", place: "Széchenyi utca 18." },
  { day: "11", month: "OKT", time: "09:00–10:40", title: "Forgalmi gyakorlás", instructor: "Kicska Gábor", place: "Prémium Autósiskola" },
  { day: "15", month: "OKT", time: "16:00–17:40", title: "Vizsgaútvonal", instructor: "Kicska Gábor", place: "Rutinpálya" },
];

export default function MobileAppPrototype() {
  const [tab, setTab] = useState<Tab>("home");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/mobilapp-sw.js").catch(() => undefined);
      return;
    }

    void navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .catch(() => undefined);
  }, []);

  return (
    <main className="min-h-screen bg-[#e8edf5] text-[#111a2e] sm:px-6 sm:py-10">
      <div className="mx-auto flex max-w-6xl items-start justify-center gap-10">
        <section className="hidden max-w-md pt-16 lg:block">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#b88619]">Első működő prototípus</p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] text-[#0d1730]">A jogosítványod<br /><span className="text-[#c8921c]">a zsebedben.</span></h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">Kattints végig a mobilalkalmazás fő részein. Ez még mintaadatokkal működik, de már megmutatja a végleges alkalmazás irányát és használatát.</p>
          <div className="mt-9 space-y-4">
            {["Időpontfoglalás oktatóhoz", "Digitális vezetési karton", "Interaktív forgalmi helyzetek", "Személyes fejlődési statisztika"].map((item) => (
              <div key={item} className="flex items-center gap-3 font-bold text-slate-700"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#0d1730] text-[#eebd42]"><Check className="h-4 w-4" /></span>{item}</div>
            ))}
          </div>
        </section>

        <section className="relative min-h-screen w-full overflow-hidden bg-[#eaf0f9] shadow-2xl sm:min-h-[820px] sm:max-w-[430px] sm:rounded-[42px] sm:border-[8px] sm:border-[#111827]">
          <div className="flex min-h-screen flex-col sm:min-h-[804px]">
            <AppHeader tab={tab} onBack={() => setTab("home")} onProfile={() => setTab("profile")} />
            <div className="flex-1 overflow-y-auto px-5 pb-28 pt-5">
              {tab === "home" && <HomeScreen onNavigate={setTab} onBooking={() => setBookingOpen(true)} />}
              {tab === "calendar" && <CalendarScreen onBooking={() => setBookingOpen(true)} />}
              {tab === "log" && <MobileDriveLog />}
              {tab === "practice" && <PracticeScreen />}
              {tab === "routes" && <RoutesScreen />}
              {tab === "profile" && <ProfileScreen />}
            </div>
            <BottomNav active={tab} onChange={setTab} />
          </div>

          {bookingOpen && (
            <div className="absolute inset-0 z-50 flex items-end bg-[#071022]/60 p-4 backdrop-blur-sm">
              <div className="w-full rounded-[30px] bg-white p-6 shadow-2xl">
                {!booked ? <><div className="mx-auto h-1.5 w-12 rounded-full bg-slate-200" /><p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#ba8618]">Új időpont</p><h2 className="mt-2 text-2xl font-black">Október 9., péntek</h2><div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="font-black">14:00–15:40</p><p className="mt-1 text-sm text-slate-500">Kicska Gábor · Opel Astra</p></div><button onClick={() => setBooked(true)} className="mt-5 w-full rounded-2xl bg-[#eab533] px-5 py-4 font-black text-[#101827] shadow-lg shadow-amber-300/30">Időpont lefoglalása</button><button onClick={() => setBookingOpen(false)} className="mt-2 w-full rounded-2xl px-5 py-3 font-bold text-slate-500">Mégsem</button></> : <div className="py-7 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-8 w-8" /></span><h2 className="mt-5 text-2xl font-black">Sikeres foglalás!</h2><p className="mt-2 text-sm leading-6 text-slate-500">Az időpont bekerült a naptáradba. Az oktatód is értesítést kap róla.</p><button onClick={() => { setBookingOpen(false); setBooked(false); setTab("calendar"); }} className="mt-6 w-full rounded-2xl bg-[#0e1932] px-5 py-4 font-black text-white">Megnézem a naptárban</button></div>}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AppHeader({ tab, onBack, onProfile }: { tab: Tab; onBack: () => void; onProfile: () => void }) {
  const titles: Record<Tab, string> = { home: "", calendar: "Időpontjaim", log: "Vezetési karton", practice: "Gyakorlás", routes: "Vizsgaútvonalak", profile: "Profilom" };
  return <header className="sticky top-0 z-20 flex min-h-20 items-center justify-between border-b border-white/10 bg-[#0a1329]/98 px-5 text-white shadow-lg shadow-slate-900/10 backdrop-blur-xl">{tab === "home" ? <img src="/logo.svg" alt="Prémium Autósiskola" width={164} height={48} className="h-12 w-auto" /> : <button onClick={onBack} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white" aria-label="Vissza"><ArrowLeft className="h-5 w-5" /></button>}<p className="absolute left-1/2 -translate-x-1/2 font-black text-white">{titles[tab]}</p><button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-amber-300" aria-label="Profil" onClick={onProfile}><CircleUserRound className="h-5 w-5" /></button></header>;
}

function HomeScreen({ onNavigate, onBooking }: { onNavigate: (tab: Tab) => void; onBooking: () => void }) {
  return <div><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-500">Jó reggelt,</p><h2 className="mt-1 text-3xl font-black">Gábor! <span aria-hidden>👋</span></h2></div><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-800">B kategória</span></div>
    <div className="relative mt-6 overflow-hidden rounded-[28px] bg-[#101b35] p-5 text-white shadow-xl shadow-slate-300"><div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#e7b232]/20 blur-2xl" /><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Következő vezetés</p><p className="mt-3 text-2xl font-black">Holnap, 14:00</p><p className="mt-1 text-sm text-slate-300">Városi vezetés · 2 tanóra</p><div className="mt-5 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-amber-300" /> Széchenyi utca 18.</div></div>
    <div className="mt-5 grid grid-cols-3 gap-3"><Stat icon={Clock3} value="18" label="vezetett óra" /><Stat icon={Gauge} value="326" label="kilométer" /><Stat icon={Star} value="4,7" label="átlag" /></div>
    <div className="mt-7 flex items-center justify-between"><h3 className="text-lg font-black">Gyors műveletek</h3><span className="text-xs font-bold text-slate-400">Minden egy helyen</span></div>
    <div className="mt-3 grid grid-cols-2 gap-3"><QuickAction icon={CalendarDays} title="Időpontfoglalás" text="Szabad időpontok" onClick={onBooking} /><QuickAction icon={BookOpenCheck} title="Vezetési karton" text="Fejlődésem" onClick={() => onNavigate("log")} /><QuickAction icon={CarFront} title="Forgalmi helyzetek" text="Interaktív gyakorlás" onClick={() => onNavigate("practice")} /><QuickAction icon={MapPinned} title="Vizsgaútvonalak" text="Nyíregyháza térképen" onClick={() => onNavigate("routes")} /></div>
    <div className="mt-7 rounded-[26px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eab533] text-[#111a2e]"><Trophy className="h-5 w-5" /></span><div><p className="font-black">Heti célod: 75%</p><p className="text-xs text-slate-500">Már csak egy gyakorlás hiányzik</p></div></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100"><div className="h-full w-3/4 rounded-full bg-[#d99c16]" /></div></div>
  </div>;
}

function CalendarScreen({ onBooking }: { onBooking: () => void }) {
  return <div><div className="rounded-[26px] bg-[#101b35] p-5 text-white"><p className="text-sm text-slate-300">Októberi egyenleg</p><div className="mt-2 flex items-end justify-between"><p className="text-3xl font-black">6 tanóra</p><CalendarDays className="h-8 w-8 text-amber-300" /></div></div><div className="mt-6 flex items-center justify-between"><h2 className="text-xl font-black">Következő időpontok</h2><button onClick={onBooking} className="rounded-xl bg-[#eab533] px-3 py-2 text-xs font-black">+ Új foglalás</button></div><div className="mt-4 space-y-3">{lessons.map((lesson, index) => <div key={lesson.day} className="flex gap-4 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"><div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${index === 0 ? "bg-[#101b35] text-white" : "bg-slate-100"}`}><div className="text-center"><p className="text-xl font-black leading-none">{lesson.day}</p><p className={`mt-1 text-[10px] font-black ${index === 0 ? "text-amber-300" : "text-slate-500"}`}>{lesson.month}</p></div></div><div className="min-w-0 flex-1"><p className="font-black">{lesson.title}</p><p className="mt-1 text-sm text-slate-500">{lesson.time} · {lesson.instructor}</p><p className="mt-2 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3.5 w-3.5" />{lesson.place}</p></div></div>)}</div></div>;
}

type LessonPhase = "setup" | "tracking" | "finish" | "saved";

function LogScreen() {
  const [view, setView] = useState<"student" | "instructor">("instructor");
  const [phase, setPhase] = useState<LessonPhase>("setup");
  const [startKm, setStartKm] = useState("128450");
  const [endKm, setEndKm] = useState("128482");
  const [lessonType, setLessonType] = useState<LessonType>("Városi vezetés");
  const [lessonHours, setLessonHours] = useState("2");
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null);
  const tracker = useDriveTracker();
  const distance = Math.max(0, Number(endKm || startKm) - Number(startKm));

  return <div>
    <div className="grid grid-cols-2 rounded-2xl bg-slate-200 p-1 text-xs font-black">
      <button onClick={() => setView("instructor")} className={`rounded-xl px-3 py-2.5 transition ${view === "instructor" ? "bg-[#101b35] text-white shadow" : "text-slate-500"}`}>Oktatói nézet</button>
      <button onClick={() => setView("student")} className={`rounded-xl px-3 py-2.5 transition ${view === "student" ? "bg-[#101b35] text-white shadow" : "text-slate-500"}`}>Tanulói nézet</button>
    </div>

    {view === "instructor" ? <InstructorLog
      phase={phase}
      startKm={startKm}
      endKm={endKm}
      distance={distance}
      lessonType={lessonType}
      lessonHours={lessonHours}
      onStartKm={setStartKm}
      onEndKm={setEndKm}
      onLessonType={setLessonType}
      onLessonHours={setLessonHours}
      onPhase={setPhase}
      onStudentView={() => { setView("student"); setSelectedDriveId(tracker.savedDrives[0]?.id ?? null); }}
      tracker={tracker}
    /> : <StudentLog drives={tracker.savedDrives} selectedDriveId={selectedDriveId} onSelect={setSelectedDriveId} />}
  </div>;
}

function InstructorLog({ phase, startKm, endKm, distance, lessonType, lessonHours, onStartKm, onEndKm, onLessonType, onLessonHours, onPhase, onStudentView, tracker }: {
  phase: LessonPhase;
  startKm: string;
  endKm: string;
  distance: number;
  lessonType: LessonType;
  lessonHours: string;
  onStartKm: (value: string) => void;
  onEndKm: (value: string) => void;
  onLessonType: (value: LessonType) => void;
  onLessonHours: (value: string) => void;
  onPhase: (phase: LessonPhase) => void;
  onStudentView: () => void;
  tracker: ReturnType<typeof useDriveTracker>;
}) {
  const [notes, setNotes] = useState("Szép fejlődés az önálló sávválasztásban. Következő alkalommal a körforgalmakat gyakoroljuk.");
  const formattedTime = `${String(Math.floor(tracker.elapsedSeconds / 60)).padStart(2, "0")}:${String(tracker.elapsedSeconds % 60).padStart(2, "0")}`;
  const parsedLessonHours = Number(lessonHours);
  const canSave = startKm !== "" && endKm !== "" && Number(endKm) >= Number(startKm) && Number.isInteger(parsedLessonHours) && parsedLessonHours >= 1 && parsedLessonHours <= 8;
  const canStart = startKm !== "" && Number.isFinite(Number(startKm)) && Number.isInteger(parsedLessonHours) && parsedLessonHours >= 1 && parsedLessonHours <= 8;
  if (phase === "tracking") return <div className="mt-4">
    <div className="overflow-hidden rounded-[28px] bg-[#101b35] text-white shadow-xl">
      <div className="relative h-64"><LiveRouteMap points={tracker.points} simulated={tracker.demoMode} /><div className={`absolute left-4 top-4 flex items-center gap-2 rounded-full px-3 py-2 text-[11px] font-black shadow-lg ${tracker.demoMode ? "bg-amber-400 text-slate-950" : "bg-red-600 text-white"}`}><span className="h-2 w-2 animate-pulse rounded-full bg-white" /> {tracker.demoMode ? "SZIMULÁLT ÚTVONAL" : "ÚTVONALRÖGZÍTÉS"}</div></div>
      <div className="grid grid-cols-3 divide-x divide-white/10 p-5 text-center"><div><p className="text-2xl font-black">{formattedTime}</p><p className="mt-1 text-[10px] text-slate-400">eltelt idő</p></div><div><p className="text-2xl font-black">{tracker.distanceKm.toFixed(1)}</p><p className="mt-1 text-[10px] text-slate-400">GPS km</p></div><div><p className="text-2xl font-black">{tracker.points.length}</p><p className="mt-1 text-[10px] text-slate-400">GPS pont</p></div></div>
    </div>
    <div className="mt-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-white"><Check className="h-5 w-5" /></span><div><p className="font-black text-emerald-950">Helyi próbarögzítés</p><p className="text-xs text-emerald-700">A GPS-nyomvonal ideiglenesen ezen a készüléken tárolódik.</p></div></div></div>
    <p className="mt-4 text-center text-xs leading-5 text-slate-500">Vezetés közben ne kezeld a telefont. Az útvonal rögzítése automatikusan működik.</p>
    <button onClick={() => { tracker.stop(); onPhase("finish"); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-4 font-black text-white shadow-lg shadow-red-200"><StopCircle className="h-5 w-5" /> Vezetési óra befejezése</button>
  </div>;

  if (phase === "finish") return <div className="mt-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Óra lezárása</p><h2 className="mt-2 text-2xl font-black">Utolsó adatok</h2>
    <div className="mt-5 rounded-[26px] bg-white p-5 shadow-sm"><div className="grid grid-cols-2 gap-3"><DataField label="Kezdő km" value={startKm} readOnly /><DataField label="Záró km" value={endKm} onChange={onEndKm} /></div><div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-100 p-4"><span className="text-sm font-bold text-slate-500">Óra szerinti táv</span><strong className="text-xl">{distance} km</strong></div><div className="mt-2 flex items-center justify-between rounded-2xl bg-amber-50 p-4"><span className="text-sm font-bold text-amber-800">GPS alapján</span><strong className="text-xl text-amber-900">{tracker.distanceKm.toFixed(1)} km</strong></div></div>
    <label className="mt-4 block rounded-[24px] bg-white p-5 text-sm font-black shadow-sm">Oktatói megjegyzés<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium leading-5 outline-none focus:border-amber-400" /></label>
    {endKm !== "" && startKm !== "" && Number(endKm) < Number(startKm) && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">A záró kilométeróra-állás nem lehet kisebb a kezdő értéknél.</p>}
    <button disabled={!canSave} onClick={() => { tracker.save({ startKm: Number(startKm), endKm: Number(endKm), lessonType, lessonHours: Number(lessonHours), studentName: "Nagy Anna", notes }); onPhase("saved"); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#101b35] px-4 py-4 font-black text-white disabled:cursor-not-allowed disabled:opacity-40"><Save className="h-5 w-5 text-amber-300" /> Óra lezárása és mentése</button>
    <button onClick={() => onPhase("tracking")} className="mt-2 w-full px-4 py-3 text-sm font-bold text-slate-500">Vissza a rögzítéshez</button>
  </div>;

  if (phase === "saved") return <div className="mt-8 text-center"><span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-10 w-10" /></span><h2 className="mt-5 text-2xl font-black">A vezetési óra elmentve</h2><p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">Az útvonal és minden óraadat biztonságosan elmentve ezen a készüléken.</p><div className="mt-6 grid grid-cols-3 gap-2"><Stat icon={Clock3} value={formattedTime} label="időtartam" /><Stat icon={Gauge} value={`${tracker.distanceKm.toFixed(1)} km`} label="GPS-táv" /><Stat icon={MapPin} value={`${tracker.points.length}`} label="GPS-pont" /></div><button onClick={onStudentView} className="mt-5 w-full rounded-2xl bg-[#eab533] px-4 py-4 font-black text-[#101827]">Tanulói nézet megnyitása</button><button onClick={() => { tracker.reset(); onPhase("setup"); }} className="mt-2 w-full px-4 py-3 text-sm font-bold text-slate-500">Új óra indítása</button></div>;

  return <div className="mt-4"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Digitális vezetési karton</p><h2 className="mt-2 text-2xl font-black">Új vezetési óra</h2></div><span className="rounded-full bg-amber-100 px-3 py-1.5 text-[10px] font-black text-amber-800">PROTOTÍPUS</span></div>
    <div className="mt-5 rounded-[26px] bg-white p-5 shadow-sm"><label className="block text-xs font-black text-slate-500">Tanuló</label><button className="mt-2 flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left"><span className="grid h-11 w-11 place-items-center rounded-full bg-[#101b35] font-black text-amber-300">NA</span><span className="flex-1"><strong className="block">Nagy Anna</strong><small className="text-slate-400">B kategória · 18/29 kötelező óra</small></span><ChevronRight className="h-5 w-5 text-slate-300" /></button>
      <label className="mt-4 block text-xs font-black text-slate-500">Óra típusa<select value={lessonType} onChange={(event) => onLessonType(event.target.value as LessonType)} className="mt-2 w-full appearance-none rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold outline-none focus:border-amber-400">{lessonTypes.map((item) => <option key={item.name} value={item.name}>{item.name} · minimum {item.minimum} óra</option>)}</select></label>
      <label className="mt-4 block text-xs font-black text-slate-500">Elszámolt tanórák száma<input type="number" min="1" max="8" step="1" value={lessonHours} onChange={(event) => onLessonHours(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold outline-none focus:border-amber-400" /></label>
      <label className="mt-4 block text-xs font-black text-slate-500">Oktatóautó<select className="mt-2 w-full appearance-none rounded-2xl border border-slate-200 bg-white p-3.5 text-sm font-bold outline-none focus:border-amber-400"><option>Opel Astra · ABC-123</option></select></label>
      <div className="mt-4"><DataField label="Kezdő kilométeróra-állás" value={startKm} onChange={onStartKm} /></div>
    </div>
    <div className={`mt-4 flex gap-3 rounded-[22px] border p-4 ${tracker.error ? "border-red-200 bg-red-50 text-red-900" : "border-blue-200 bg-blue-50 text-blue-950"}`}><MapPin className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-xs leading-5">{tracker.error ?? <><strong>A helymeghatározás az indításkor kér engedélyt.</strong> Az útvonal csak a vezetési óra alatt lesz rögzítve.</>}</p></div>
    <button disabled={tracker.permission === "requesting" || !canStart} onClick={async () => { if (await tracker.start()) onPhase("tracking"); }} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#eab533] px-4 py-4 font-black text-[#101827] shadow-lg shadow-amber-200 disabled:cursor-not-allowed disabled:opacity-40"><Play className="h-5 w-5 fill-current" /> {tracker.permission === "requesting" ? "GPS keresése…" : "Vezetési óra indítása"}</button>
    {(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_MOBILE_DEMO === "true") && <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3"><p className="text-xs leading-5 text-amber-950">GPS nélkül is tesztelhető: szimulált útvonalat rögzít Nyíregyháza környékén.</p><button onClick={() => { tracker.startDemo(); onPhase("tracking"); }} className="mt-2 w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-sm font-black text-amber-900 transition hover:bg-amber-100">Szimulált útvonal indítása</button></div>}
  </div>;
}

function StudentLog({ drives, selectedDriveId, onSelect }: { drives: SavedDrive[]; selectedDriveId: string | null; onSelect: (id: string | null) => void }) {
  const totalHours = drives.reduce((total, drive) => total + drive.lessonHours, 0);
  const totalKm = drives.reduce((total, drive) => total + drive.distanceKm, 0);
  const requirements = lessonTypes.map((item) => ({
    name: item.name,
    required: item.minimum,
    done: drives.filter((drive) => drive.lessonType === item.name).reduce((total, drive) => total + drive.lessonHours, 0),
  }));
  const selectedDrive = drives.find((drive) => drive.id === selectedDriveId);
  const examReady = requirements.every((item) => item.done >= item.required) && totalKm >= 580;
  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} perc`;
  const formatDate = (date: string) => new Intl.DateTimeFormat("hu-HU", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));

  if (selectedDrive) return <div className="mt-4"><button onClick={() => onSelect(null)} className="mb-4 flex items-center gap-2 text-sm font-black text-slate-500"><ArrowLeft className="h-4 w-4" /> Vissza az órákhoz</button><div className="overflow-hidden rounded-[28px] bg-white shadow-sm"><div className="relative h-64"><RecordedRouteMap points={selectedDrive.points} simulated={selectedDrive.simulated} /><span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-black shadow">{formatDate(selectedDrive.startedAt)}</span></div><div className="p-5"><p className="text-xs font-black uppercase tracking-wider text-amber-700">{selectedDrive.lessonType}</p><h2 className="mt-1 text-xl font-black">Vezetési óra részletei</h2>{selectedDrive.simulated && <p className="mt-2 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">Ez teszteléshez rögzített, szimulált útvonal; nem valódi GPS-adat.</p>}<div className="mt-5 grid grid-cols-2 gap-2"><MiniData value={formatDuration(selectedDrive.durationSeconds)} label="időtartam" /><MiniData value={`${selectedDrive.lessonHours}`} label="elszámolt tanórák" /><MiniData value={`${selectedDrive.distanceKm} km`} label="km óra szerint" /><MiniData value={`${selectedDrive.gpsDistanceKm.toFixed(1)} km`} label={selectedDrive.simulated ? "szimulált táv" : "GPS-táv"} /></div><div className="mt-4 grid grid-cols-2 gap-2"><MiniData value={selectedDrive.startKm.toLocaleString("hu-HU")} label="kezdő km" /><MiniData value={selectedDrive.endKm.toLocaleString("hu-HU")} label="záró km" /></div>{selectedDrive.notes && <div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Oktatói megjegyzés</p><p className="mt-2 text-sm leading-6 text-slate-600">{selectedDrive.notes}</p></div>}<p className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500"><ShieldCheck className="h-4 w-4" /> Helyi prototípusadat · éles tanulói hozzáférés még nincs bekötve</p></div></div></div>;

  return <div className="mt-4"><div className="rounded-[28px] bg-gradient-to-br from-[#111c36] to-[#233251] p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">B kategória · vizsgafeltételek</p><div className="mt-4 flex items-end gap-2"><p className="text-5xl font-black">{totalHours}</p><p className="pb-1 text-sm text-slate-300">/ 29 kötelező óra</p></div><div className="mt-5 h-2.5 rounded-full bg-white/10"><div className="h-full rounded-full bg-[#eab533]" style={{ width: `${Math.min(100, totalHours / 29 * 100)}%` }} /></div><div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-300">Megtett távolság</span><strong className="text-amber-300">{totalKm} / 580 km</strong></div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, totalKm / 580 * 100)}%` }} /></div><p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-[11px] leading-5 text-slate-200">{examReady ? "A megadott óraszám- és kilométerfeltételek teljesültek." : "A gyakorlati vizsgához minden kötelező óratípust és legalább 580 km-t teljesíteni kell."}</p></div>
    <h2 className="mt-6 text-lg font-black">Kötelező óratípusok</h2><div className="mt-3 space-y-3 rounded-[24px] bg-white p-5 shadow-sm">{requirements.map((item) => <div key={item.name}><div className="flex items-center justify-between text-sm"><span className="font-bold">{item.name}</span><span className={`font-black ${item.done >= item.required ? "text-emerald-600" : "text-amber-700"}`}>{item.done} / {item.required} óra</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${item.done >= item.required ? "bg-emerald-500" : "bg-[#eab533]"}`} style={{ width: `${Math.min(100, item.done / item.required * 100)}%` }} /></div></div>)}</div>
    <div className="mt-6 flex items-center justify-between"><h2 className="text-lg font-black">Vezetési óráim</h2><span className="text-xs font-bold text-slate-400">{drives.length} alkalom</span></div>{drives.length ? <div className="mt-3 space-y-3">{drives.map((drive) => <button key={drive.id} onClick={() => onSelect(drive.id)} className="w-full overflow-hidden rounded-[24px] border border-slate-200 bg-white text-left shadow-sm"><div className="h-32"><RecordedRouteMap points={drive.points} simulated={drive.simulated} /></div><div className="p-4"><div className="flex items-center justify-between"><strong>{drive.lessonType}</strong><ChevronRight className="h-5 w-5 text-slate-300" /></div><p className="mt-1 text-xs text-slate-400">{formatDate(drive.startedAt)} · {drive.lessonHours} tanóra · {drive.distanceKm} km</p>{drive.simulated && <p className="mt-2 text-[10px] font-bold text-amber-700">Szimulált GPS-adat</p>}<p className="mt-3 text-[10px] font-black uppercase tracking-wider text-amber-700">ÚTVONAL ÉS RÉSZLETEK</p></div></button>)}</div> : <p className="mt-3 rounded-[22px] border border-dashed border-slate-300 bg-white p-5 text-sm leading-6 text-slate-500">Még nincs vezetési óra rögzítve ezen a készüléken. Az oktató által rögzített órák itt jelennek meg.</p>}
    <div className="mt-5 flex gap-3 rounded-[22px] border border-blue-200 bg-blue-50 p-4 text-blue-950"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-xs leading-5"><strong>Prototípus mód.</strong> Az adatok most csak ezen az eszközön tárolódnak. Közös adatbázis, belépés és tanuló–oktató adatmegosztás még nincs bekötve.</p></div>
  </div>;
}

function RecordedRouteMap({ points, simulated = false }: { points: GpsPoint[]; simulated?: boolean }) {
  if (!points.length) return <div className="grid h-full place-items-center bg-[#e8edf5] px-6 text-center text-xs font-bold text-slate-500">Ehhez az órához nem rögzült GPS-útvonal.</div>;
  return <LiveRouteMap points={points} simulated={simulated} />;
}

function LiveRouteMap({ points, simulated = false }: { points: GpsPoint[]; simulated?: boolean }) {
  if (points.length === 0) return <div className="grid h-full place-items-center bg-[#dce5dc] px-8 text-center text-sm font-bold text-slate-600">GPS-jel keresése… Tartsd a telefont olyan helyen, ahonnan jól látja az eget.</div>;
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes), maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes), maxLng = Math.max(...longitudes);
  const latRange = Math.max(maxLat - minLat, 0.0003), lngRange = Math.max(maxLng - minLng, 0.0003);
  const projected = points.map((point) => ({
    x: 24 + ((point.longitude - minLng) / lngRange) * 352,
    y: 226 - ((point.latitude - minLat) / latRange) * 202,
  }));
  const path = projected.map((point, index) => `${index ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const first = projected[0], last = projected.at(-1)!;
  return <div className="relative h-full w-full bg-[#dce5dc]"><svg viewBox="0 0 400 250" className="h-full w-full" aria-label={simulated ? "Szimulált útvonal" : "Élő GPS-útvonal"}><path d={path} fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" opacity=".8"/><path d={path} fill="none" stroke="#e7aa21" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/><circle cx={first.x} cy={first.y} r="7" fill="#101b35" stroke="#fff" strokeWidth="3"/><circle cx={last.x} cy={last.y} r="8" fill="#dc2626" stroke="#fff" strokeWidth="3"/></svg><div className="absolute bottom-3 right-3 rounded-xl bg-white/90 px-3 py-1.5 text-[9px] font-black text-slate-600 shadow">{simulated ? "SZIMULÁLT GPS" : `ÉLŐ GPS · ${points.at(-1)!.accuracy.toFixed(0)} m`}</div></div>;
}

function DataField({ label, value, onChange, readOnly = false }: { label: string; value: string; onChange?: (value: string) => void; readOnly?: boolean }) {
  return <label className="block text-xs font-black text-slate-500">{label}<div className="relative mt-2"><input inputMode="numeric" value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value.replace(/\D/g, ""))} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3.5 pr-10 text-sm font-black outline-none focus:border-amber-400 read-only:bg-slate-100" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">km</span></div></label>;
}

function MiniData({ value, label }: { value: string; label: string }) { return <div className="rounded-2xl bg-slate-100 p-3 text-center"><p className="font-black">{value}</p><p className="mt-1 text-[9px] font-bold text-slate-400">{label}</p></div>; }

function PracticeScreen() {
  return <div className="-mx-5 -mt-5 bg-[#0b1426] pb-6">
    <div className="flex items-center justify-between border-b border-white/10 bg-[#101c31] px-4 py-3 text-white"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-amber-300">Prémium Forgalmi Labor</p><p className="mt-1 text-[10px] text-slate-400">A weboldallal közös, mindig azonos gyűjtemény</p></div><a href="/forgalmi-helyzetek" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-amber-300" aria-label="Forgalmi Labor megnyitása teljes oldalon"><ExternalLink className="h-4 w-4" /></a></div>
    <iframe src="/forgalmi-labor/index.html?v=20261023-12" title="Prémium Autósiskola – Forgalmi Labor" className="block h-[1520px] w-full border-0 bg-[#0b1426]" allowFullScreen />
    <p className="px-4 pt-3 text-center text-[10px] leading-4 text-slate-500">Az ábrák AI-támogatással készültek, szemléltető célt szolgálnak és szakmai ellenőrzés alatt állnak.</p>
  </div>;
}

function streetViewUrl(coord: [number, number]) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${coord[0]}%2C${coord[1]}&fov=85`;
}

function googleRouteUrl(route: ExamRoute) {
  const origin = route.path[0].join("%2C");
  const destination = route.path[route.path.length - 1].join("%2C");
  const waypoints = route.path.slice(1, -1).map((point) => point.join("%2C")).join("%7C");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving&waypoints=${waypoints}`;
}

function RoutesScreen() {
  const [selected, setSelected] = useState(0);
  const [lesson, setLesson] = useState<number | null>(null);
  const [routes, setRoutes] = useState<ExamRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeMessage, setRouteMessage] = useState("");
  useEffect(() => {
    let active = true;
    const supabase = createClient();
    void supabase.from("exam_routes").select("id,name,streets,color,path,stops,is_published,sort_order").eq("is_published", true).order("sort_order")
      .then(({ data, error }) => {
        if (!active) return;
        if (error) { setRoutes([]); setRouteMessage("A központi útvonalak még nem érhetők el; az adminisztrátor adatbázis-beállítása szükséges."); }
        else {
          const published = (data ?? []) as ExamRoute[];
          setRoutes(published);
          setSelected(0);
          if (!published.length) setRouteMessage("Még nincs ellenőrzött, közzétett vizsgaútvonal.");
        }
        setLoading(false);
      });
    return () => { active = false; };
  }, []);
  const route = routes[selected];
  if (!route) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">{loading ? "Ellenőrzött vizsgaútvonalak betöltése…" : routeMessage || "Nincs megjeleníthető vizsgaútvonal."}</div>;
  return <div>
    <div className="rounded-[28px] bg-gradient-to-br from-[#101b35] to-[#23375c] p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Nyíregyháza</p><h2 className="mt-2 text-2xl font-black">Gyakorold a fontos csomópontokat!</h2></div><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10"><MapPinned className="h-6 w-6 text-amber-300" /></span></div>
      <p className="mt-3 text-sm leading-6 text-slate-300">Hivatalosan közzétett útvonalak alapján, oktatói magyarázatokkal.</p>
    </div>
    <div className="mt-5 flex gap-2 overflow-x-auto pb-2">{routes.map((item, index) => <button key={item.id} onClick={() => { setSelected(index); setLesson(null); }} className={`shrink-0 rounded-2xl border px-4 py-3 text-left ${selected === index ? "border-[#172442] bg-[#172442] text-white" : "border-slate-200 bg-white"}`}><span className={`block text-[10px] font-black uppercase tracking-wider ${selected === index ? "text-amber-300" : "text-slate-400"}`}>{item.id}</span><span className="mt-1 block text-sm font-black">{item.name}</span></button>)}</div>
    <div className="mt-3 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-64 overflow-hidden bg-[#e4eaf2]"><RouteMap key={route.id} path={route.path} points={route.stops} color={route.color} /><span className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black shadow">Nagyítható térkép</span></div>
      <div className="p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-black text-[#b47e10]">{route.id}</p><h3 className="mt-1 text-xl font-black">{route.name}</h3></div><a href={googleRouteUrl(route)} target="_blank" rel="noreferrer" className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700" aria-label="Útvonal megnyitása a Google Térképen"><ExternalLink className="h-5 w-5" /></a></div><p className="mt-3 text-xs leading-5 text-slate-500">{route.streets}</p><a href={googleRouteUrl(route)} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#edf2f9] px-3 py-2.5 text-xs font-black text-[#14213f]"><Navigation className="h-4 w-4" /> Útvonal megtekintése</a></div>
    </div>
    {routeMessage && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">{routeMessage}</p>}
    <div className="mt-7 flex items-center justify-between gap-3"><div><h3 className="text-xl font-black">Főbb csomópontok</h3><p className="mt-1 text-xs text-slate-500">Az ellenőrzött, központi útvonal csomópontjai.</p></div></div>
    <div className="mt-4 space-y-3">{route.stops.map((stop, index) => <button onClick={() => setLesson(index)} key={stop.name} className="w-full rounded-[22px] border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-[0.98]"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#dfe8f6] text-sm font-black text-[#152344]">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex items-center justify-between"><p className="font-black">{stop.name}</p><ExternalLink className="h-4 w-4 text-amber-600" /></div><p className="mt-1.5 text-xs leading-5 text-slate-500">{stop.note}</p><p className="mt-2 text-[10px] font-black uppercase tracking-wider text-[#a9730b]">Utcakép és magyarázat</p></div></div></button>)}</div>
    <div className="mt-5 flex gap-3 rounded-[22px] border border-blue-200 bg-blue-50 p-4 text-blue-950"><Info className="mt-0.5 h-5 w-5 shrink-0" /><p className="text-xs leading-5"><strong>Gyakorlási segédlet.</strong> A vizsgán a tényleges útvonal és megközelítési irány az aktuális forgalmi helyzettől eltérhet.</p></div>
    {lesson !== null && <JunctionEditor key={`${selected}-${lesson}`} routeId={route.id} name={route.stops[lesson].name} initialNote={route.stops[lesson].note} coord={route.stops[lesson].coord} onClose={() => setLesson(null)} />}
  </div>;
}

function RoutePointsEditor({ route, onClose, onSave }: { route: (typeof examRoutes)[number]; onClose: () => void; onSave: (stops: (typeof examRoutes)[number]["stops"]) => void }) {
  const [stops, setStops] = useState(() => route.stops.map((stop) => ({ ...stop, coord: [...stop.coord] as [number, number] })));
  const updateStop = (index: number, patch: Partial<(typeof stops)[number]>) => setStops((current) => current.map((stop, stopIndex) => stopIndex === index ? { ...stop, ...patch } : stop));
  const updateCoord = (index: number, coordIndex: 0 | 1, value: string) => {
    const number = Number(value.replace(",", "."));
    setStops((current) => current.map((stop, stopIndex) => stopIndex === index ? { ...stop, coord: stop.coord.map((coord, itemIndex) => itemIndex === coordIndex ? number : coord) as [number, number] } : stop));
  };
  const addStop = () => setStops((current) => [...current, { name: "Új csomópont", coord: [47.955, 21.718] as [number, number], note: "" }]);
  const validStops = stops.filter((stop) => stop.name.trim() && Number.isFinite(stop.coord[0]) && Number.isFinite(stop.coord[1]));

  return <div className="absolute inset-0 z-50 flex items-end bg-[#071022]/70 p-4 backdrop-blur-sm">
    <div className="max-h-[94%] w-full overflow-y-auto rounded-[30px] bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">{route.id}</p><h3 className="mt-1 text-xl font-black">Utcaképpontok szerkesztése</h3></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100" aria-label="Bezárás"><X className="h-5 w-5" /></button></div>
      <div className="p-4"><div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs leading-5 text-blue-950"><strong>Így működik:</strong> a Google Térképen állj arra a helyre, ahonnan az Utcaképet szeretnéd mutatni, majd másold ide a szélességi és hosszúsági koordinátát. Minden útvonal külön pontlistát kap.</div>
        <div className="mt-4 space-y-4">{stops.map((stop, index) => <div key={`${index}-${stop.name}`} className="rounded-[22px] border border-slate-200 bg-[#f8fafc] p-4"><div className="flex items-center justify-between"><p className="font-black">{index + 1}. pont</p><button onClick={() => setStops((current) => current.filter((_, stopIndex) => stopIndex !== index))} className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600" aria-label={`${index + 1}. pont törlése`}><Trash2 className="h-4 w-4" /></button></div>
          <label className="mt-3 block text-xs font-bold text-slate-600">Pont neve<input value={stop.name} onChange={(event) => updateStop(index, { name: event.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400" /></label>
          <div className="mt-3 grid grid-cols-2 gap-2"><label className="text-xs font-bold text-slate-600">Szélesség<input inputMode="decimal" value={Number.isFinite(stop.coord[0]) ? stop.coord[0] : ""} onChange={(event) => updateCoord(index, 0, event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400" /></label><label className="text-xs font-bold text-slate-600">Hosszúság<input inputMode="decimal" value={Number.isFinite(stop.coord[1]) ? stop.coord[1] : ""} onChange={(event) => updateCoord(index, 1, event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-400" /></label></div>
          <label className="mt-3 block text-xs font-bold text-slate-600">Oktatói magyarázat<textarea rows={3} value={stop.note} onChange={(event) => updateStop(index, { note: event.target.value })} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm leading-5 outline-none focus:border-amber-400" /></label>
          <a href={streetViewUrl(stop.coord)} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-black text-[#14213f] shadow-sm"><ExternalLink className="h-4 w-4" /> Pont ellenőrzése Google Utcaképen</a>
        </div>)}</div>
        <button onClick={addStop} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-4 py-3 text-sm font-black text-slate-600"><Plus className="h-4 w-4" /> Új pont hozzáadása</button>
        <button onClick={() => onSave(validStops)} disabled={validStops.length === 0} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#101b35] px-4 py-3.5 font-black text-white disabled:opacity-40"><Save className="h-4 w-4" /> Pontok mentése</button>
      </div>
    </div>
  </div>;
}

function JunctionEditor({ routeId, name, initialNote, coord, onClose }: { routeId: string; name: string; initialNote: string; coord: [number, number]; onClose: () => void }) {
  const storageKey = `premium-junction-note:${routeId}:${name}`;
  const [note, setNote] = useState(() => typeof window === "undefined" ? initialNote : window.localStorage.getItem(storageKey) ?? initialNote);
  const [saved, setSaved] = useState(false);
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const saveNote = () => {
    window.localStorage.setItem(storageKey, note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };
  return <div className="absolute inset-0 z-50 flex items-end bg-[#071022]/70 p-4 backdrop-blur-sm">
    <div className="w-full max-h-[92%] overflow-y-auto rounded-[30px] bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">Utcakép és magyarázat</p><h3 className="mt-1 text-xl font-black">{name}</h3></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100" aria-label="Bezárás"><X className="h-5 w-5" /></button></div>
      <div className="mx-4 mt-4 h-64 overflow-hidden rounded-[22px] bg-slate-100">{embedKey ? <iframe title={`${name} utcakép`} className="h-full w-full border-0" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" src={`https://www.google.com/maps/embed/v1/streetview?key=${embedKey}&location=${coord[0]},${coord[1]}&fov=85&pitch=0`} /> : <div className="flex h-full flex-col items-center justify-center px-6 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-400 shadow-sm"><ImageOff className="h-6 w-6" /></span><p className="mt-4 font-black">A beágyazott utcakép előkészítve</p><p className="mt-2 text-xs leading-5 text-slate-500">A Google Maps Embed API-kulcs csatlakoztatása után itt közvetlenül a 360°-os utcakép jelenik meg.</p><a href={streetViewUrl(coord)} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 rounded-xl bg-[#eab533] px-4 py-2.5 text-xs font-black text-[#101827]"><ExternalLink className="h-4 w-4" /> Utcanézet megnyitása</a></div>}</div>
      <div className="p-5"><label htmlFor="junction-note" className="text-sm font-black">Saját oktatói magyarázat</label><p className="mt-1 text-xs text-slate-400">Ezt a szöveget később a tanulók fogják látni ennél a csomópontnál.</p><textarea id="junction-note" value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} rows={5} className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-[#f7f9fc] p-4 text-sm leading-6 outline-none focus:border-amber-400" placeholder="Írd le, mire figyeljen a tanuló…" /><button onClick={saveNote} className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-black text-white ${saved ? "bg-emerald-600" : "bg-[#101b35]"}`}><Save className="h-4 w-4" />{saved ? "Magyarázat elmentve" : "Magyarázat mentése"}</button></div>
    </div>
  </div>;
}

function ProfileScreen() { return <div className="text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-[#101b35] text-3xl font-black text-amber-300">KG</div><h2 className="mt-4 text-2xl font-black">Kicska Gábor</h2><p className="mt-1 text-sm text-slate-500">B kategóriás tanuló</p><div className="mt-7 grid grid-cols-2 gap-3"><Stat icon={GraduationCap} value="60%" label="képzés" /><Stat icon={Trophy} value="8" label="jelvény" /></div><div className="mt-6 space-y-3 text-left">{["Személyes adataim", "Dokumentumaim", "Értesítések", "Segítség és visszajelzés"].map((item) => <button key={item} className="flex w-full items-center justify-between rounded-2xl bg-white p-4 font-bold shadow-sm">{item}<ChevronRight className="h-5 w-5 text-slate-300" /></button>)}</div></div>; }

function Stat({ icon: Icon, value, label }: { icon: typeof Clock3; value: string; label: string }) { return <div className="rounded-2xl bg-white p-3 text-center shadow-sm"><Icon className="mx-auto h-5 w-5 text-[#c28b18]" /><p className="mt-2 text-lg font-black">{value}</p><p className="text-[10px] font-bold text-slate-400">{label}</p></div>; }
function QuickAction({ icon: Icon, title, text, onClick }: { icon: typeof Clock3; title: string; text: string; onClick: () => void }) { return <button onClick={onClick} className="rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition active:scale-95"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#101b35] text-amber-300"><Icon className="h-5 w-5" /></span><span className="mt-4 block text-sm font-black">{title}</span><span className="mt-1 block text-[11px] text-slate-400">{text}</span></button>; }

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items = [{ id: "home" as const, icon: Home, label: "Kezdőlap" }, { id: "calendar" as const, icon: CalendarDays, label: "Időpontok" }, { id: "routes" as const, icon: MapPinned, label: "Útvonalak" }, { id: "practice" as const, icon: Play, label: "Gyakorlás" }, { id: "log" as const, icon: BookOpenCheck, label: "Karton" }];
  return <nav className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-[#cbd6e8] bg-[#f5f8fd]/95 px-2 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">{items.map(({ id, icon: Icon, label }) => <button key={id} onClick={() => onChange(id)} className={`flex flex-col items-center gap-1 text-[9px] font-bold ${active === id ? "text-[#9f6e08]" : "text-slate-400"}`}><span className={`grid h-9 w-10 place-items-center rounded-xl ${active === id ? "bg-[#dce6f5] text-[#13213f]" : ""}`}><Icon className="h-5 w-5" /></span>{label}</button>)}</nav>;
}
