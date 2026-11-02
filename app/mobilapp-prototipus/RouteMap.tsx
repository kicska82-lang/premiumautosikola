"use client";

type Point = { name: string; coord: [number, number] };

function googleDirectionsEmbedUrl(path: [number, number][], points: Point[], key: string) {
  const origin = path[0];
  const destination = path[path.length - 1];
  // Route shaping points describe the intended road course; named stops are only a fallback.
  const waypoints = path.length > 2 ? path.slice(1, -1) : points.map((point) => point.coord);
  const params = new URLSearchParams({
    key,
    origin: `${origin[0]},${origin[1]}`,
    destination: `${destination[0]},${destination[1]}`,
    mode: "driving",
    language: "hu",
    region: "HU",
  });

  if (waypoints.length > 0) {
    params.set("waypoints", waypoints.map(([lat, lng]) => `${lat},${lng}`).join("|"));
  }

  return `https://www.google.com/maps/embed/v1/directions?${params.toString()}`;
}

export default function RouteMap({ path, points }: { path: [number, number][]; points: Point[]; color: string }) {
  const embedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;

  if (!embedKey) {
    return <div className="flex h-full items-center justify-center px-6 text-center text-sm font-bold text-slate-500">
      A Google Térkép megjelenítéséhez API-kulcs szükséges.
    </div>;
  }

  return <iframe
    title="Google Térkép – vizsgaútvonal"
    className="h-full w-full border-0"
    loading="lazy"
    allowFullScreen
    referrerPolicy="strict-origin-when-cross-origin"
    src={googleDirectionsEmbedUrl(path, points, embedKey)}
  />;
}
