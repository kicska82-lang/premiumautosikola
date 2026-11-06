"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { name: string; coord: [number, number] };
type RouteState = "loading" | "ready" | "error";

export default function RouteMap({ path, points, color }: { path: [number, number][]; points: Point[]; color: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const routeRef = useRef<Leaflet.Polyline | null>(null);
  const routeCasingRef = useRef<Leaflet.Polyline | null>(null);
  const markerRefs = useRef<Leaflet.CircleMarker[]>([]);
  const [ready, setReady] = useState(false);
  const [roadGeometry, setRoadGeometry] = useState<[number, number][] | null>(null);
  const [snappedPoints, setSnappedPoints] = useState<[number, number][] | null>(null);
  const [routeState, setRouteState] = useState<RouteState>("loading");

  useEffect(() => {
    let disposed = false;
    void import("leaflet").then((module) => {
      if (disposed || !containerRef.current) return;
      const L = module.default;
      leafletRef.current = L;
      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false, preferCanvas: true }).setView([47.9551, 21.7165], 13);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők · <a href="https://www.openstreetmap.org/fixthemap">Térképhiba javítása</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);
      mapRef.current = map;
      setReady(true);
      window.setTimeout(() => map.invalidateSize(), 80);
    });

    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      routeRef.current = null;
      routeCasingRef.current = null;
      markerRefs.current = [];
      setReady(false);
    };
  }, []);

  useEffect(() => {
    if (!ready || path.length < 2) return;
    let disposed = false;
    const controller = new AbortController();
    setRoadGeometry(null);
    setSnappedPoints(null);
    setRouteState("loading");

    // Debounce edits and stay below the routing provider's published 1 request/second limit.
    const timer = window.setTimeout(() => {
      const coordinates = path.map(([lat, lng]) => `${lng},${lat}`).join(";");
      const url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`;
      void fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
        .then(async (response) => {
          if (!response.ok) throw new Error(`Útvonaltervező válasza: ${response.status}`);
          return await response.json() as {
            code?: string;
            routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
            waypoints?: Array<{ location?: [number, number] }>;
          };
        })
        .then((data) => {
          const geometry = data.code === "Ok" ? data.routes?.[0]?.geometry?.coordinates : undefined;
          if (!geometry?.length) throw new Error("Nem találtunk végigjárható autós útvonalat a megadott pontok között.");
          if (!disposed) {
            setRoadGeometry(geometry.map(([lng, lat]) => [lat, lng]));
            setSnappedPoints(data.waypoints?.flatMap((waypoint) => waypoint.location ? [[waypoint.location[1], waypoint.location[0]] as [number, number]] : []) ?? null);
            setRouteState("ready");
          }
        })
        .catch(() => {
          if (!disposed && !controller.signal.aborted) setRouteState("error");
        });
    }, 1100);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [path, ready]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!ready || !map || !L) return;

    routeRef.current?.remove();
    routeCasingRef.current?.remove();
    markerRefs.current.forEach((marker) => marker.remove());
    routeRef.current = null;
    markerRefs.current = [];

    if (roadGeometry?.length) {
      // White casing keeps the route legible over roads without hiding the street underneath.
      routeCasingRef.current = L.polyline(roadGeometry, { color: "#ffffff", weight: 10, opacity: 0.9, lineCap: "round", lineJoin: "round", interactive: false }).addTo(map);
      routeRef.current = L.polyline(roadGeometry, { color, weight: 5, opacity: 0.98, lineCap: "round", lineJoin: "round" }).addTo(map);
    }

    const markerCoordinates = snappedPoints?.length === path.length ? snappedPoints : path;
    const waypoints = markerCoordinates.map((coord, index) => ({ coord, label: `Útvonalpont ${index + 1}` }));
    markerRefs.current = waypoints.map(({ coord, label }, index) => L.circleMarker(coord, {
      radius: index === 0 || index === waypoints.length - 1 ? 7 : 5,
      color: "#ffffff",
      weight: 2,
      fillColor: index === 0 ? "#16a34a" : index === waypoints.length - 1 ? "#dc2626" : color,
      fillOpacity: 1,
    }).addTo(map).bindTooltip(label, { direction: "top", offset: [0, -4] }));

    points.forEach((point, index) => {
      const marker = L.circleMarker(point.coord, { radius: 6, color: "#ffffff", weight: 2, fillColor: "#172554", fillOpacity: 1 })
        .addTo(map)
        .bindTooltip(point.name || `Csomópont ${index + 1}`, { direction: "top", offset: [0, -4] });
      markerRefs.current.push(marker);
    });

    const bounds = roadGeometry?.length ? L.latLngBounds(roadGeometry) : L.latLngBounds(path);
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.12), { maxZoom: 16, animate: false });
    window.setTimeout(() => map.invalidateSize(), 80);
  }, [path, points, color, roadGeometry, snappedPoints, ready]);

  return <div className="relative h-full min-h-40 w-full overflow-hidden bg-[#e8eef1]">
    <div ref={containerRef} className="absolute inset-0 z-0" />
    {!ready && <div className="absolute inset-0 z-10 grid place-items-center bg-[#e8eef1] text-sm font-bold text-slate-600">Térkép betöltése…</div>}
    {ready && routeState === "loading" && <div className="absolute left-3 top-3 z-[500] rounded-xl border border-white/80 bg-white/95 px-3 py-2 text-[11px] font-bold text-slate-700 shadow">Útvonal illesztése az utcákhoz…</div>}
    {ready && routeState === "error" && <div className="absolute inset-x-3 bottom-3 z-[500] rounded-xl border border-amber-200 bg-white/95 px-3 py-2 text-[11px] font-semibold leading-4 text-amber-950 shadow">Most nem sikerült az utcahálózathoz igazítani. Ellenőrizd, hogy a koordináták úttesten vannak, vagy próbáld újra később.</div>}
  </div>;
}
