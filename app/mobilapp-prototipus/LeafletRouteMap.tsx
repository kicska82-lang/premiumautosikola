"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GpsPoint } from "./useDriveTracker";

const nyiregyhaza: [number, number] = [47.9551, 21.7165];

export default function LeafletRouteMap({ points, follow = false }: { points: GpsPoint[]; follow?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const routeRef = useRef<Leaflet.Polyline | null>(null);
  const startMarkerRef = useRef<Leaflet.CircleMarker | null>(null);
  const endMarkerRef = useRef<Leaflet.CircleMarker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let resizeTimer: number | undefined;

    void import("leaflet").then((module) => {
      if (disposed || !containerRef.current) return;
      const L = module.default;
      leafletRef.current = L;
      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false })
        .setView(nyiregyhaza, 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> közreműködők",
      }).addTo(map);
      mapRef.current = map;
      setReady(true);
      resizeTimer = window.setTimeout(() => map.invalidateSize(), 80);
    });

    return () => {
      disposed = true;
      if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
      mapRef.current?.remove();
      mapRef.current = null;
      leafletRef.current = null;
      routeRef.current = null;
      startMarkerRef.current = null;
      endMarkerRef.current = null;
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!ready || !map || !L) return;

    const coordinates: [number, number][] = points.map((point) => [point.latitude, point.longitude]);
    if (coordinates.length === 0) {
      routeRef.current?.remove();
      startMarkerRef.current?.remove();
      endMarkerRef.current?.remove();
      routeRef.current = null;
      startMarkerRef.current = null;
      endMarkerRef.current = null;
      map.setView(nyiregyhaza, 14, { animate: false });
      return;
    }

    if (!routeRef.current) {
      routeRef.current = L.polyline(coordinates, { color: "#f2ae24", weight: 7, opacity: 0.95, lineCap: "round", lineJoin: "round" }).addTo(map);
    } else {
      routeRef.current.setLatLngs(coordinates);
    }

    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    if (!startMarkerRef.current) {
      startMarkerRef.current = L.circleMarker(first, { radius: 7, color: "#ffffff", weight: 3, fillColor: "#101b35", fillOpacity: 1 }).addTo(map);
      startMarkerRef.current.bindTooltip("Indulás", { direction: "top", offset: [0, -6] });
    }
    if (!endMarkerRef.current) {
      endMarkerRef.current = L.circleMarker(last, { radius: 8, color: "#ffffff", weight: 3, fillColor: "#dc2626", fillOpacity: 1 }).addTo(map);
      endMarkerRef.current.bindTooltip("Aktuális hely / érkezés", { direction: "top", offset: [0, -6] });
    } else {
      endMarkerRef.current.setLatLng(last);
    }

    if (follow) {
      map.setView(last, Math.max(map.getZoom(), 16), { animate: false });
    } else if (coordinates.length > 1) {
      map.fitBounds(routeRef.current.getBounds().pad(0.15), { maxZoom: 17, animate: false });
    } else {
      map.setView(last, 16, { animate: false });
    }
  }, [points, follow, ready]);

  return <div className="relative h-full min-h-40 w-full overflow-hidden bg-[#dce5dc]">
    <div ref={containerRef} className="absolute inset-0 z-0" />
    {!ready && <div className="absolute inset-0 z-10 grid place-items-center bg-[#dce5dc] px-8 text-center text-sm font-bold text-slate-600">Térkép betöltése…</div>}
    {points.length > 0 && <div className="pointer-events-none absolute bottom-3 right-3 z-[400] rounded-xl bg-white/95 px-3 py-1.5 text-[9px] font-black text-slate-600 shadow">{points.at(-1)!.accuracy > 80 ? "GYENGE GPS-JEL" : `GPS · ±${Math.round(points.at(-1)!.accuracy)} m`}</div>}
  </div>;
}
