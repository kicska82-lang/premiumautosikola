"use client";

import { useMemo, useState } from "react";
import RouteMap from "@/app/mobilapp-prototipus/RouteMap";
import type { ExamRoute } from "@/lib/exam-routes";
import { saveExamRoute } from "./actions";

function coordsText(points: [number, number][]) {
  return points.map(([lat, lng]) => `${lat}, ${lng}`).join("\n");
}

function parseCoords(value: string): [number, number][] {
  const matches = [...value.matchAll(/(-?\d{1,2}\.\d+)\s*[,; ]\s*(-?\d{1,3}\.\d+)/g)];
  return matches.map((match) => [Number(match[1]), Number(match[2])]);
}

function googleRoutePreviewUrl(path: [number, number][]) {
  if (path.length < 2) return "https://maps.google.com";
  const params = new URLSearchParams({
    api: "1",
    origin: `${path[0][0]},${path[0][1]}`,
    destination: `${path[path.length - 1][0]},${path[path.length - 1][1]}`,
    travelmode: "driving",
  });
  if (path.length > 2) params.set("waypoints", path.slice(1, -1).map(([lat, lng]) => `${lat},${lng}`).join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function stopsText(route: ExamRoute) {
  return route.stops.map((stop) => `${stop.name} | ${stop.coord[0]}, ${stop.coord[1]} | ${stop.note}`).join("\n");
}

function parseStops(value: string): ExamRoute["stops"] {
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [name = "", coords = "", ...note] = line.split("|").map((part) => part.trim());
    const [coord] = parseCoords(coords);
    if (!coord) throw new Error(`A csomópont koordinátája hibás: ${line}`);
    return { name, coord, note: note.join(" | ") };
  });
}

export default function ExamRouteManager({ initialRoutes }: { initialRoutes: ExamRoute[] }) {
  const [routes, setRoutes] = useState(initialRoutes);
  const [selectedId, setSelectedId] = useState(initialRoutes[0]?.id ?? "");
  const [route, setRoute] = useState<ExamRoute>(() => initialRoutes[0] ?? {
    id: "F/SZ/000", name: "Új vizsgaútvonal", streets: "", color: "#eab533",
    path: [[47.9536, 21.7508], [47.953, 21.7175]], stops: [], is_published: false, sort_order: 100,
  });
  const [pathInput, setPathInput] = useState(() => coordsText(initialRoutes[0]?.path ?? []));
  const [stopInput, setStopInput] = useState(() => initialRoutes[0] ? stopsText(initialRoutes[0]) : "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const parsedPath = useMemo(() => parseCoords(pathInput), [pathInput]);
  const pathValid = parsedPath.length >= 2 && parsedPath.length <= 10 && parsedPath.every(([lat, lng]) => lat >= 45 && lat <= 49 && lng >= 16 && lng <= 23);

  const selectRoute = (id: string) => {
    const next = routes.find((item) => item.id === id);
    if (!next) return;
    setSelectedId(id); setRoute(next); setPathInput(coordsText(next.path)); setStopInput(stopsText(next)); setMessage("");
  };

  const addRoute = () => {
    const next: ExamRoute = { id: `F/SZ/${String(Date.now()).slice(-3)}`, name: "Új vizsgaútvonal", streets: "", color: "#eab533", path: [[47.9536, 21.7508], [47.953, 21.7175]], stops: [], is_published: false, sort_order: routes.length + 1 };
    setRoute(next); setSelectedId(""); setPathInput(coordsText(next.path)); setStopInput(""); setMessage("");
  };

  const pasteFromClipboard = async () => {
    try { setPathInput(await navigator.clipboard.readText()); setMessage("Beillesztve. Ellenőrizd a pontok sorrendjét és az előnézetet."); }
    catch { setMessage("A vágólap nem olvasható. Illeszd be közvetlenül a koordinátamezőbe."); }
  };

  const save = async () => {
    setSaving(true); setMessage("");
    try {
      const stops = parseStops(stopInput);
      if (!pathValid) throw new Error("Adj meg 2–10 érvényes nyíregyházi koordinátapárt, sorrendben.");
      if (stops.length > 20) throw new Error("Legfeljebb 20 csomópont adható meg.");
      const payload = { ...route, path: parsedPath, stops };
      await saveExamRoute(payload);
      setRoute(payload); setRoutes((current) => [...current.filter((item) => item.id !== payload.id), payload].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))); setSelectedId(payload.id);
      setMessage(payload.is_published ? "Elmentve és közzétéve. A tanulói alkalmazás a közös adatbázisból tölti be." : "Elmentve piszkozatként; a tanulók még nem látják.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Nem sikerült menteni."); }
    finally { setSaving(false); }
  };

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <select value={selectedId} onChange={(event) => selectRoute(event.target.value)} className="min-w-56 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-semibold">
          {routes.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.name}{item.is_published ? " · közzétéve" : " · piszkozat"}</option>)}
          {!selectedId && <option value="">Új útvonal…</option>}
        </select>
        <button type="button" onClick={addRoute} className="rounded-xl border border-slate-300 px-4 py-2.5 font-bold">+ Új útvonal</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold">Azonosító<input value={route.id} onChange={(e) => setRoute({ ...route, id: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>
        <label className="text-sm font-bold">Útvonal neve<input value={route.name} onChange={(e) => setRoute({ ...route, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>
      </div>
      <label className="block text-sm font-bold">Érintett utcák<input value={route.streets} onChange={(e) => setRoute({ ...route, streets: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="text-sm font-bold">Megjelenítési sorrend<input type="number" min="0" value={route.sort_order ?? 0} onChange={(e) => setRoute({ ...route, sort_order: Number(e.target.value) })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5" /></label>
        <label className="text-sm font-bold">Szín<input type="color" value={route.color} onChange={(e) => setRoute({ ...route, color: e.target.value })} className="mt-1.5 h-11 w-16 rounded-lg border border-slate-300 p-1" /></label>
        <label className="flex h-11 items-center gap-2 rounded-xl bg-slate-50 px-3 text-sm font-bold"><input type="checkbox" checked={Boolean(route.is_published)} onChange={(e) => setRoute({ ...route, is_published: e.target.checked })} /> Tanulóknak közzétéve</label>
      </div>
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><strong>Koordinátapontok sorrendben.</strong> Google Térképen jobb kattintással másolj pontot az utcán, és illeszd be soronként „szélesség, hosszúság” formában. Az első és utolsó pont a kezdet/vég; a köztes pontok az útvonal kanyarjait rögzítik. A köztes pontok az úttesten legyenek.</div>
      <label className="block text-sm font-bold">Útvonalkoordináták<textarea rows={8} spellCheck={false} value={pathInput} onChange={(e) => setPathInput(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 font-mono text-sm leading-6" placeholder={'47.953600, 21.750800\n47.960500, 21.739000\n47.953000, 21.717500'} /></label>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs"><button type="button" onClick={pasteFromClipboard} className="rounded-lg border border-slate-300 px-3 py-2 font-bold">Vágólap beillesztése</button><span className={pathValid ? "font-bold text-emerald-700" : "font-bold text-red-700"}>{parsedPath.length} / 10 pont {pathValid ? "· rendben" : "· ellenőrizd a formátumot"}</span></div>
      <label className="block text-sm font-bold">Csomópontok és oktatói magyarázat<textarea rows={7} spellCheck={false} value={stopInput} onChange={(e) => setStopInput(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 font-mono text-xs leading-5" placeholder="Pont neve | szélesség, hosszúság | oktatói magyarázat" /></label>
      <p className="-mt-3 text-xs text-slate-500">Minden csomópont külön sor: <code>név | szélesség, hosszúság | magyarázat</code></p>
      {message && <p role="status" className="rounded-xl bg-slate-100 p-3 text-sm font-semibold">{message}</p>}
      <button type="button" disabled={saving} onClick={save} className="w-full rounded-xl bg-slate-900 px-4 py-3.5 font-black text-white disabled:opacity-50">{saving ? "Mentés…" : "Útvonal mentése"}</button>
    </section>
    <aside className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="px-4 py-3 font-black">Útvonal-előnézet</h2>
        <div className="relative h-[420px] bg-slate-100">{pathValid ? <RouteMap path={parsedPath} points={[]} color={route.color} /> : <div className="grid h-full place-items-center p-8 text-center text-sm font-semibold text-slate-500">Adj meg legalább két érvényes koordinátát az előnézethez.</div>}{pathValid && <a href={googleRoutePreviewUrl(parsedPath)} target="_blank" rel="noreferrer" className="absolute right-3 top-3 z-[500] rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow">Megnyitás Google Térképen ↗</a>}</div>
      </div>
      <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">A térkép utcahálózaton illeszti össze a beírt pontokat. Mentés előtt ellenőrizd a vonalat és a csomópontokat a térképen/utcaképen. A hibás régi útvonalakat piszkozatként tartjuk, amíg a tényleges koordinátákat be nem állítod.</p>
    </aside>
  </div>;
}
