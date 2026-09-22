"use client";

import { useEffect, useState } from "react";

function getRemaining(target: string | null) {
  const milliseconds = target ? Math.max(0, new Date(target).getTime() - Date.now()) : 0;
  const seconds = Math.floor(milliseconds / 1000);
  return {
    nap: Math.floor(seconds / 86_400),
    óra: Math.floor((seconds % 86_400) / 3_600),
    perc: Math.floor((seconds % 3_600) / 60),
    mp: seconds % 60,
  };
}

export default function HeroCountdown({ label, target }: { label: string; target: string | null }) {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);
  useEffect(() => {
    const updateRemaining = () => setRemaining(getRemaining(target));
    updateRemaining();
    const interval = window.setInterval(updateRemaining, 1_000);
    return () => window.clearInterval(interval);
  }, [target]);
  if (!target) return null;
  return <div className="rounded-xl border border-amber-400/80 bg-black/55 px-4 py-3 text-center backdrop-blur-md md:px-5">
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white md:text-xs">{label}</p>
    <div className="mt-2 grid grid-cols-4 divide-x divide-amber-400/40">
      {Object.entries(remaining ?? getRemaining(null)).map(([unit, value]) => <div key={unit} className="px-1.5"><p className="text-xl font-black text-amber-400 md:text-3xl">{String(value).padStart(2, "0")}</p><p className="mt-0.5 text-[9px] uppercase tracking-wider text-white md:text-[10px]">{unit}</p></div>)}
    </div>
  </div>;
}
