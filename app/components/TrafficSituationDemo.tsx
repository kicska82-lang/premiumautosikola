"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Lightbulb, RotateCcw, Route, XCircle } from "lucide-react";

type VehicleColor = "blue" | "gold" | "red" | "green";
type SignType = "stop" | "yield" | "priority";
type SituationId = "right-hand" | "stop" | "left-turn" | "yield";
type Situation = { id: SituationId; number: string; topic: string; title: string; question: string; hint: string; choices: { id: "a" | "b"; text: string }[]; correct: "a" | "b"; explanation: string; a: { color: VehicleColor; sign?: SignType }; b: { color: VehicleColor; sign?: SignType } };

const situations: Situation[] = [
  { id: "right-hand", number: "01", topic: "Jobbkéz-szabály", title: "Egyenrangú kereszteződés", question: "Ki haladhat át először?", hint: "Nincs elsőbbséget szabályozó tábla vagy jelzőlámpa.", choices: [{ id: "a", text: "A kék jármű" }, { id: "b", text: "B arany jármű" }], correct: "b", explanation: "Az A jármű jobb oldaláról érkezik a B, ezért A-nak elsőbbséget kell adnia. B halad át először.", a: { color: "blue" }, b: { color: "gold" } },
  { id: "stop", number: "02", topic: "STOP tábla", title: "Megállási kötelezettség", question: "Kié az elsőbbség?", hint: "Az A jármű STOP táblához érkezik, B az elsőbbséget élvező úton halad.", choices: [{ id: "a", text: "A piros jármű" }, { id: "b", text: "B zöld jármű" }], correct: "b", explanation: "A STOP tábla kötelező megállást és elsőbbségadást jelent. A főúton közlekedő B jármű halad át először.", a: { color: "red", sign: "stop" }, b: { color: "green", sign: "priority" } },
  { id: "left-turn", number: "03", topic: "Balra kanyarodás", title: "Szemből érkező jármű", question: "Ki indulhat el előbb?", hint: "Az A jármű balra kíván kanyarodni, B egyenesen halad tovább.", choices: [{ id: "a", text: "A balra kanyarodó jármű" }, { id: "b", text: "B egyenesen haladó jármű" }], correct: "b", explanation: "Balra kanyarodáskor elsőbbséget kell adni a szemből érkező, egyenesen továbbhaladó járműnek. Előbb B, utána A kanyarodik.", a: { color: "gold" }, b: { color: "blue" } },
  { id: "yield", number: "04", topic: "Elsőbbségadás", title: "Macisajt tábla", question: "Melyik autó indul először?", hint: "Az A jármű elsőbbségadás kötelező táblával védett útra érkezik.", choices: [{ id: "a", text: "A zöld jármű" }, { id: "b", text: "B piros jármű" }], correct: "b", explanation: "Az elsőbbségadás kötelező tábla szerint A csak akkor hajthat be, ha ezzel nem zavarja a védett úton érkező B járművet.", a: { color: "green", sign: "yield" }, b: { color: "red", sign: "priority" } },
];

function RoadSign({ type, vehicle }: { type: SignType; vehicle: "a" | "b" }) {
  if (type === "stop") return <span aria-label="STOP tábla" className={`traffic-sign traffic-sign--${vehicle} traffic-sign--stop`}>STOP</span>;
  if (type === "yield") return <span aria-label="Elsőbbségadás kötelező tábla" className={`traffic-sign traffic-sign--${vehicle} traffic-sign--yield`}><span /></span>;
  return <span aria-label="Főútvonal tábla" className={`traffic-sign traffic-sign--${vehicle} traffic-sign--priority`}><span /></span>;
}

function DirectionArrows({ id }: { id: SituationId }) {
  const paths: Record<SituationId, { a: string; b: string }> = {
    "right-hand": { a: "M 54 96 L 54 35", b: "M 96 46 L 35 46" }, stop: { a: "M 54 96 L 54 35", b: "M 5 46 L 68 46" },
    "left-turn": { a: "M 54 96 L 54 58 Q 54 46 42 46 L 8 46", b: "M 46 4 L 46 67" }, yield: { a: "M 5 46 L 67 46", b: "M 54 96 L 54 35" },
  };
  return <svg aria-label="A járművek tervezett haladási iránya" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 z-[4] h-full w-full overflow-visible"><defs><marker id="traffic-arrow-tip" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L0 5L5 2.5Z" fill="#fcd34d" /></marker></defs><path d={paths[id].a} className="traffic-direction traffic-direction--a" markerEnd="url(#traffic-arrow-tip)" /><path d={paths[id].b} className="traffic-direction traffic-direction--b" markerEnd="url(#traffic-arrow-tip)" /></svg>;
}

function Vehicle({ letter, data }: { letter: "a" | "b"; data: Situation["a"] }) {
  return <div className={`traffic-car traffic-car--${letter} traffic-car--${data.color}`}><Image src="/images/traffic-car-blue-v1.png" alt={`${letter.toUpperCase()} jelű ${data.color} Prémium Autósiskola jármű`} fill sizes="150px" className="traffic-car__image object-contain" /><div className="traffic-car__logo"><Image src="/images/logoo.png" alt="Prémium Autósiskola" fill sizes="100px" className="object-contain" /></div><span className="traffic-car__badge">{letter.toUpperCase()}</span></div>;
}

export default function TrafficSituationDemo() {
  const [situationId, setSituationId] = useState<SituationId>("right-hand");
  const [answer, setAnswer] = useState<"a" | "b" | null>(null);
  const situation = situations.find((item) => item.id === situationId) ?? situations[0];
  const correct = answer === situation.correct;
  const state = answer ? (correct ? "correct" : "crash") : "idle";
  const select = (id: SituationId) => { setSituationId(id); setAnswer(null); };

  return <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#111c36] shadow-2xl shadow-slate-950/25">
    <div className="border-b border-white/10 bg-slate-950/35 p-4 sm:p-5"><div className="flex gap-2 overflow-x-auto pb-1">{situations.map((item) => <button key={item.id} type="button" onClick={() => select(item.id)} className={`min-w-[180px] rounded-xl border px-4 py-3 text-left transition ${item.id === situation.id ? "border-amber-300 bg-amber-300/15 text-white" : "border-white/10 bg-white/[.03] text-slate-300 hover:border-white/30"}`}><span className="text-[11px] font-black tracking-[.16em] text-amber-300">{item.number} · {item.topic}</span><span className="mt-1 block text-sm font-black">{item.title}</span></button>)}</div></div>
    <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
      <div key={`${situation.id}-${state}`} className={`traffic-scene traffic-scene--${situation.id} traffic-scene--${state} relative min-h-[500px] overflow-hidden border-b border-white/10 bg-[#172643] lg:border-r lg:border-b-0`}>
        <Image src="/images/traffic-intersection-two-way-v1.png" alt="Valósághű, kétirányú, egy-egy sávos városi kereszteződés" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_32%,rgba(6,16,33,.42)_100%)]" />
        <div className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-slate-950/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-amber-300 backdrop-blur">{situation.number} / {situation.topic}</div>
        <DirectionArrows id={situation.id} /><Vehicle letter="a" data={situation.a} /><Vehicle letter="b" data={situation.b} />
        {situation.a.sign && <RoadSign type={situation.a.sign} vehicle="a" />}
        {situation.b.sign && <RoadSign type={situation.b.sign} vehicle="b" />}
        {answer && <div className={`traffic-result-banner ${correct ? "traffic-result-banner--correct" : "traffic-result-banner--crash"}`}>{correct ? <><CheckCircle2 className="h-5 w-5" />Szabályos áthaladás: B, majd A</> : <><AlertTriangle className="h-5 w-5" />Ütközésveszély! Ezért kell elsőbbséget adni.</>}</div>}
        {state === "crash" && <div className="traffic-impact" aria-label="Ütközés jelzése">✦</div>}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/85 p-4 text-sm text-slate-100 backdrop-blur"><Route className="h-6 w-6 shrink-0 text-amber-300" /><p>{situation.hint}</p></div>
      </div>
      <div className="p-6 sm:p-9"><p className="text-sm font-black uppercase tracking-[0.18em] text-amber-300">Gyakorló helyzet</p><h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{situation.question}</h2><p className="mt-4 leading-7 text-slate-300">Nézd meg a két autó mozgási irányát a sárga nyilak alapján, majd hozz döntést.</p>
        <div className="mt-7 space-y-3">{situation.choices.map((option) => { const selected = answer === option.id; const isCorrect = option.id === situation.correct; const style = !answer ? "border-white/10 bg-white/[.04] hover:border-amber-300/70 hover:bg-amber-300/10" : isCorrect ? "border-emerald-400/70 bg-emerald-400/10" : selected ? "border-rose-400/70 bg-rose-400/10" : "border-white/10 bg-white/[.025] opacity-65"; return <button key={option.id} type="button" disabled={Boolean(answer)} onClick={() => setAnswer(option.id)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${style}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black ${option.id === "a" ? "bg-blue-500 text-white" : "bg-amber-400 text-slate-950"}`}>{option.id.toUpperCase()}</span><span className="flex-1 font-bold text-white">{option.text}</span>{answer && isCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-300" />}{answer && selected && !isCorrect && <XCircle className="h-6 w-6 text-rose-300" />}{!answer && <ChevronRight className="h-5 w-5 text-slate-500" />}</button>; })}</div>
        {answer && <div className={`mt-6 rounded-2xl border p-5 ${correct ? "border-emerald-400/30 bg-emerald-400/10" : "border-rose-400/30 bg-rose-400/10"}`}><div className="flex gap-3">{correct ? <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /> : <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />}<div><p className="font-black text-white">{correct ? "Helyes válasz!" : "Ez most balesetveszélyes lenne."}</p><p className="mt-2 text-sm leading-6 text-slate-200">{situation.explanation}</p></div></div></div>}
        <div className="mt-7 flex flex-wrap gap-3">{answer ? <button type="button" onClick={() => setAnswer(null)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-amber-300 hover:text-amber-200"><RotateCcw className="h-4 w-4" />Újrapróbálom</button> : <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-400"><ArrowRight className="h-4 w-4 text-amber-300" />Válassz egy járművet a folytatáshoz.</span>}</div>
      </div>
    </div>
  </section>;
}
