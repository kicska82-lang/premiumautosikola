"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Lightbulb,
  LockKeyhole,
  Play,
  RotateCcw,
  Route,
  Sparkles,
} from "lucide-react";

type VehicleId = "A" | "B" | "C";
type VehicleColor = "blue" | "gold" | "red" | "green";
type SignType = "stop" | "yield" | "priority";
type SceneState = "idle" | "correct" | "crash";

type Vehicle = {
  id: VehicleId;
  color: VehicleColor;
  path: string;
  crashPath: string;
  heading: number;
};

type Situation = {
  number: number;
  topic: string;
  title: string;
  question: string;
  hint: string;
  choices: string[];
  correct: string;
  explanation: string;
  vehicles: Vehicle[];
  signs: { type: SignType; x: number; y: number; rotation?: number }[];
  crashPoint: [number, number];
};

const situations: Situation[] = [
  {
    number: 1,
    topic: "Jobbkéz-szabály",
    title: "Egyenrangú kereszteződés",
    question: "Milyen sorrendben haladhatnak tovább?",
    hint: "Nincs elsőbbséget szabályozó tábla. A jobbról érkező jármű helyzetét kell figyelembe venni.",
    choices: ["A – B", "B – A"],
    correct: "B – A",
    explanation: "Az A jármű jobb oldaláról érkezik B, ezért A elsőbbséget ad. Először B, majd A halad át.",
    vehicles: [
      { id: "A", color: "blue", path: "M705 226 L55 226", crashPath: "M705 226 L430 226", heading: 180 },
      { id: "B", color: "red", path: "M430 510 L430 50", crashPath: "M430 510 L430 226", heading: -90 },
    ],
    signs: [],
    crashPoint: [430, 226],
  },
  {
    number: 2,
    topic: "Jobbkéz-szabály",
    title: "Két jármű, eltérő irányból",
    question: "Milyen sorrendben haladhatnak tovább?",
    hint: "A kereszteződés egyenrangú. A jármű jobb oldaláról érkezik B.",
    choices: ["A – B", "B – A"],
    correct: "B – A",
    explanation: "A jobbra tekintve B járművet látja, ezért elsőbbséget kell adnia neki. Először B, utána A halad át.",
    vehicles: [
      { id: "A", color: "blue", path: "M705 226 L55 226", crashPath: "M705 226 L330 226", heading: 180 },
      { id: "B", color: "gold", path: "M330 50 L330 510", crashPath: "M330 50 L330 226", heading: 90 },
    ],
    signs: [],
    crashPoint: [330, 226],
  },
  {
    number: 3,
    topic: "Jobbkéz-szabály",
    title: "Három jármű egyenrangú kereszteződésben",
    question: "Melyik a helyes áthaladási sorrend?",
    hint: "Mindhárom jármű egyenesen halad. Vizsgáld meg külön-külön, kinek érkezik jármű a jobb oldaláról!",
    choices: ["A – B – C", "B – A – C", "C – B – A"],
    correct: "A – B – C",
    explanation: "A jobb oldaláról nem érkezik jármű, ezért ő indulhat elsőként. Ezután B, végül C haladhat át.",
    vehicles: [
      { id: "A", color: "blue", path: "M430 510 L430 50", crashPath: "M430 510 L430 326", heading: -90 },
      { id: "B", color: "green", path: "M55 326 L705 326", crashPath: "M55 326 L430 326", heading: 0 },
      { id: "C", color: "gold", path: "M330 50 L330 510", crashPath: "M330 50 L330 326", heading: 90 },
    ],
    signs: [],
    crashPoint: [430, 326],
  },
];

const colors: Record<VehicleColor, { body: string; glass: string }> = {
  blue: { body: "#1677ff", glass: "#b9e2ff" },
  gold: { body: "#e9ad22", glass: "#fff0a8" },
  red: { body: "#ef4444", glass: "#ffd0d0" },
  green: { body: "#22a96b", glass: "#bdf7d7" },
};

function RoadSign({ type, x, y, rotation = 0 }: Situation["signs"][number]) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation})`} filter="url(#sign-shadow)">
      <path d="M0 0V58" stroke="#d7dde6" strokeWidth="7" />
      {type === "stop" && <><path d="M-24-47 -10-61 10-61 24-47 24-27 10-13 -10-13 -24-27Z" fill="#c9232b" stroke="white" strokeWidth="4" /><text x="0" y="-33" textAnchor="middle" fill="white" fontSize="11" fontWeight="900">STOP</text></>}
      {type === "yield" && <path d="M0-10 -27-57 27-57Z" fill="white" stroke="#d9262f" strokeWidth="6" />}
      {type === "priority" && <path d="M0-63 25-38 0-13 -25-38Z" fill="#f5c542" stroke="white" strokeWidth="7" />}
    </g>
  );
}

function TopDownCar({ vehicle, state, order, slow }: { vehicle: Vehicle; state: SceneState; order: number; slow: boolean }) {
  const duration = slow ? 5.6 : 3.4;
  const activePath = state === "crash" ? vehicle.crashPath : vehicle.path;
  const delay = state === "correct" ? order * duration * 0.62 : 0;
  const palette = colors[vehicle.color];

  return (
    <g className="premium-vehicle" filter="url(#car-shadow)">
      <g transform="rotate(-90) translate(-27 -48)">
        <rect x="1" y="5" width="52" height="86" rx="17" fill={palette.body} stroke="white" strokeOpacity=".7" strokeWidth="2" />
        <rect x="8" y="20" width="38" height="30" rx="9" fill={palette.glass} opacity=".94" />
        <path d="M9 54h36l-5 21H14Z" fill="#10213a" opacity=".78" />
        <rect x="-3" y="18" width="5" height="18" rx="2" fill="#101827" /><rect x="52" y="18" width="5" height="18" rx="2" fill="#101827" />
        <rect x="-3" y="59" width="5" height="18" rx="2" fill="#101827" /><rect x="52" y="59" width="5" height="18" rx="2" fill="#101827" />
        <path d="M14 13h26" stroke="#f6d35b" strokeWidth="4" strokeLinecap="round" />
        <path d="M16 68h22" stroke="#f6d35b" strokeWidth="3" strokeLinecap="round" opacity=".9" />
      </g>
      <g transform={`rotate(${-vehicle.heading})`}>
        <circle cx="0" cy="0" r="17" fill="#071a38" stroke="#f6c743" strokeWidth="4" />
        <text x="0" y="6" textAnchor="middle" fill="#fff3b0" fontSize="18" fontWeight="900">{vehicle.id}</text>
      </g>
      {state !== "idle" && <animateMotion path={activePath} dur={`${duration}s`} begin={`${delay}s`} fill="freeze" rotate="auto" calcMode="spline" keyTimes="0;1" keySplines=".35 0 .2 1" />}
      {state === "idle" && <animateMotion path={vehicle.path} dur="2.6s" begin="0s" fill="freeze" rotate="auto" keyPoints="0;0.035;0" keyTimes="0;.5;1" calcMode="linear" repeatCount="indefinite" />}
    </g>
  );
}

function TrafficScene({ situation, state, slow, runKey }: { situation: Situation; state: SceneState; slow: boolean; runKey: number }) {
  const order = situation.correct.split(" – ") as VehicleId[];
  return (
    <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#071a38] shadow-2xl">
      <svg key={`${situation.number}-${state}-${runKey}-${slow}`} viewBox="0 0 760 560" role="img" aria-label={`${situation.title} felülnézeti animáció`} className="block h-auto w-full">
        <defs>
          <linearGradient id="road" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#45515c" /><stop offset="1" stopColor="#2d3741" /></linearGradient>
          <pattern id="grass" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#487c45" /><circle cx="5" cy="6" r="1.5" fill="#5e9454" /><circle cx="18" cy="16" r="1" fill="#32663c" /></pattern>
          <filter id="car-shadow"><feDropShadow dx="0" dy="9" stdDeviation="7" floodOpacity=".5" /></filter>
          <filter id="sign-shadow"><feDropShadow dx="2" dy="5" stdDeviation="3" floodOpacity=".5" /></filter>
        </defs>
        <rect width="760" height="560" fill="url(#grass)" />
        <path d="M278 0H482V110Q482 174 546 174H760V378H546Q482 378 482 442V560H278V442Q278 378 214 378H0V174H214Q278 174 278 110Z" fill="url(#road)" />
        <g fill="none" strokeLinecap="round">
          <g stroke="#aeb4b8" strokeWidth="13">
            <path d="M0 174H214Q278 174 278 110V0" /><path d="M482 0V110Q482 174 546 174H760" />
            <path d="M760 378H546Q482 378 482 442V560" /><path d="M278 560V442Q278 378 214 378H0" />
          </g>
          <g stroke="#f4f4ef" strokeWidth="3" opacity=".78">
            <path d="M0 174H214Q278 174 278 110V0" /><path d="M482 0V110Q482 174 546 174H760" />
            <path d="M760 378H546Q482 378 482 442V560" /><path d="M278 560V442Q278 378 214 378H0" />
          </g>
        </g>
        <g stroke="#f7fafc" strokeWidth="4" strokeDasharray="24 18" opacity=".86"><path d="M0 276H216" /><path d="M544 276H760" /><path d="M380 0V112" /><path d="M380 440V560" /></g>
        <g stroke="#f5cf54" strokeWidth="3" strokeDasharray="11 10" fill="none" opacity=".95">
          {situation.vehicles.map((vehicle) => <path key={vehicle.id} d={vehicle.path} className="premium-route-line" markerEnd="url(#route-arrow)" />)}
        </g>
        <defs><marker id="route-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" fill="#f5cf54" /></marker></defs>
        {situation.signs.map((sign, index) => <RoadSign key={`${sign.type}-${index}`} {...sign} />)}
        {situation.vehicles.map((vehicle) => <TopDownCar key={vehicle.id} vehicle={vehicle} state={state} order={Math.max(0, order.indexOf(vehicle.id))} slow={slow} />)}
        {state === "crash" && <g transform={`translate(${situation.crashPoint[0]} ${situation.crashPoint[1]})`}><g className="premium-impact"><path d="M0-60 14-24 50-45 32-10 70 0 32 13 52 48 14 27 0 68 -14 27 -50 48 -32 13 -70 0 -32-10 -50-45 -14-24Z" fill="#ffd84d" stroke="#ef4d32" strokeWidth="7" /><text x="0" y="8" textAnchor="middle" fontSize="28" fontWeight="900" fill="#7f1d1d">!</text></g></g>}
      </svg>
      <div className="pointer-events-none absolute left-4 top-4 rounded-full border border-amber-300/30 bg-[#07152d]/90 px-4 py-2 text-[11px] font-black uppercase tracking-[.16em] text-amber-300 backdrop-blur">{String(situation.number).padStart(3, "0")} · {situation.topic}</div>
      {state !== "idle" && <div className={`absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-black backdrop-blur ${state === "correct" ? "border-emerald-300/50 bg-emerald-950/90 text-emerald-100" : "border-rose-300/50 bg-rose-950/90 text-rose-100"}`}>{state === "correct" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}{state === "correct" ? `Szabályos sorrend: ${situation.correct}` : "A hibás döntés következménye: ütközésveszély."}</div>}
    </div>
  );
}

export default function TrafficSituationDemo() {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [slow, setSlow] = useState(false);
  const completed = useMemo(() => new Set([1, 2, 3]), []);
  const situation = situations[selected];
  const state: SceneState = answer ? (answer === situation.correct ? "correct" : "crash") : "idle";

  const selectSituation = (index: number) => { setSelected(index); setAnswer(null); setRunKey((value) => value + 1); };
  const replay = () => setRunKey((value) => value + 1);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1c3c] shadow-2xl shadow-slate-950/40">
      <div className="border-b border-white/10 bg-[#07152d] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-amber-300"><Sparkles className="h-4 w-4" />164 forgalmi helyzet</p><h2 className="mt-2 text-2xl font-black text-white">Prémium Forgalmi Labor</h2></div><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-xs font-bold text-slate-300"><Gauge className="h-4 w-4 text-amber-300" />3 működő minta · 161 előkészített hely</div></div>
        <div className="mt-4 grid grid-cols-12 gap-1 sm:grid-cols-[repeat(20,minmax(0,1fr))] lg:grid-cols-[repeat(28,minmax(0,1fr))]">
          {Array.from({ length: 164 }, (_, index) => { const number = index + 1; const enabled = completed.has(number); return <button key={number} type="button" disabled={!enabled} onClick={() => selectSituation(index)} aria-label={enabled ? `${number}. forgalmi helyzet` : `${number}. helyzet előkészítés alatt`} className={`aspect-square rounded-md text-[10px] font-black transition ${selected === index ? "bg-amber-300 text-[#07152d] ring-2 ring-white" : enabled ? "border border-amber-300/40 bg-amber-300/10 text-amber-200 hover:bg-amber-300/25" : "border border-white/[.05] bg-white/[.025] text-slate-600"}`}>{enabled ? number : number % 10 === 0 ? number : <LockKeyhole className="mx-auto h-2.5 w-2.5" />}</button>; })}
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)]">
        <div className="border-b border-white/10 p-3 sm:p-5 lg:border-b-0 lg:border-r"><TrafficScene situation={situation} state={state} slow={slow} runKey={runKey} /></div>
        <div className="p-5 sm:p-6">
          <p className="text-[11px] font-black uppercase tracking-[.2em] text-amber-300">{situation.topic}</p><h3 className="mt-2 text-2xl font-black leading-tight text-white">{situation.title}</h3><p className="mt-4 text-base font-bold text-slate-100">{situation.question}</p>
          <div className="mt-5 flex gap-3 rounded-2xl border border-blue-300/20 bg-blue-300/[.06] p-4 text-sm leading-6 text-slate-300"><Route className="mt-0.5 h-5 w-5 shrink-0 text-blue-300" /><p>{situation.hint}</p></div>
          <div className="mt-6 space-y-3">{situation.choices.map((choice) => { const selectedChoice = choice === answer; const correctChoice = choice === situation.correct; return <button key={choice} type="button" disabled={Boolean(answer)} onClick={() => { setAnswer(choice); setRunKey((value) => value + 1); }} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${!answer ? "border-white/10 bg-white/[.04] hover:border-amber-300 hover:bg-amber-300/10" : correctChoice ? "border-emerald-400/60 bg-emerald-400/10" : selectedChoice ? "border-rose-400/60 bg-rose-400/10" : "border-white/[.06] bg-white/[.02] opacity-45"}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07152d] font-black text-amber-300">{String.fromCharCode(65 + situation.choices.indexOf(choice))}</span><span className="flex-1 font-black text-white">{choice}</span>{answer && correctChoice && <CheckCircle2 className="h-5 w-5 text-emerald-300" />}{answer && selectedChoice && !correctChoice && <AlertTriangle className="h-5 w-5 text-rose-300" />}</button>; })}</div>
          {answer && <div className={`mt-5 rounded-2xl border p-5 ${state === "correct" ? "border-emerald-400/30 bg-emerald-400/10" : "border-rose-400/30 bg-rose-400/10"}`}><div className="flex gap-3"><Lightbulb className={`mt-1 h-5 w-5 shrink-0 ${state === "correct" ? "text-emerald-300" : "text-rose-300"}`} /><div><p className="font-black text-white">{state === "correct" ? "Helyes döntés" : "Nézzük meg, miért veszélyes"}</p><p className="mt-2 text-sm leading-6 text-slate-200">{situation.explanation}</p></div></div></div>}
          <div className="mt-6 flex flex-wrap items-center gap-2"><button type="button" onClick={() => { setAnswer(null); replay(); }} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-black text-white hover:border-amber-300"><RotateCcw className="h-4 w-4" />Alaphelyzet</button><button type="button" onClick={replay} disabled={!answer} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-[#07152d] disabled:cursor-not-allowed disabled:opacity-40"><Play className="h-4 w-4" />Újrajátszás</button><button type="button" onClick={() => setSlow((value) => !value)} className={`rounded-xl border px-4 py-3 text-sm font-black ${slow ? "border-blue-300 bg-blue-300/15 text-blue-200" : "border-white/15 text-slate-300"}`}>Lassítás {slow ? "be" : "ki"}</button></div>
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"><button type="button" disabled={selected === 0} onClick={() => selectSituation(selected - 1)} className="inline-flex items-center gap-1 text-sm font-bold text-slate-300 disabled:opacity-30"><ChevronLeft className="h-4 w-4" />Előző</button><span className="text-xs font-black text-slate-500">{situation.number} / 164</span><button type="button" disabled={selected === situations.length - 1} onClick={() => selectSituation(selected + 1)} className="inline-flex items-center gap-1 text-sm font-bold text-slate-300 disabled:opacity-30">Következő<ChevronRight className="h-4 w-4" /></button></div>
        </div>
      </div>
    </section>
  );
}
