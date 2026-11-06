"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = { name: string; coord: [number, number] };

export default function RouteMap({ path, points, color }: { path: [number, number][]; points: Point[]; color: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<typeof Leaflet | null>(null);
  const routeRef = useRef<Leaflet.Polyline | null>(null);
  const markersRef = useRef<Leaflet.CircleMarker[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    void import("leaflet").then((module) => {
      if (disposed || !containerRef.current) return;
      const L = module.default;
      leafletRef.current = L;
      const map = L.map(containerRef.current, { zoomControl: true, scrollWheelZoom: false }).setView([47.9551, 21.7165], 13);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> közreműködők',
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
      markersRef.current = [];
      setReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!ready || !map || !L || path.length === 0) return;

    routeRef.current?.remove();
    markersRef.current.forEach((marker) => marker.remove());
    routeRef.current = L.polyline(path, { color, weight: 6, opacity: 0.92, lineCap: "round", lineJoin: "round" }).addTo(map);
    markersRef.current = points.map((point, index) => L.circleMarker(point.coord, {
      radius: index === 0 || index === points.length - 1 ? 7 : 5,
      color: "#ffffff",
      weight: 2,
      fillColor: index === 0 ? "#15803d" : index === points.length - 1 ? "#dc2626" : color,
      fillOpacity: 1,
    }).addTo(map).bindTooltip(`${index + 1}. ${point.name}`, { direction: "top", offset: [0, -4] }));

    map.fitBounds(routeRef.current.getBounds().pad(0.12), { maxZoom: 16, animate: false });
    window.setTimeout(() => map.invalidateSize(), 80);
  }, [path, points, color, ready]);

  return <div className="relative h-full min-h-40 w-full overflow-hidden bg-[#dce5dc]">
    <div ref={containerRef} className="absolute inset-0 z-0" />
    {!ready && <div className="absolute inset-0 z-10 grid place-items-center bg-[#dce5dc] text-sm font-bold text-slate-600">Térkép betöltése…</div>}
  </div>;
}
