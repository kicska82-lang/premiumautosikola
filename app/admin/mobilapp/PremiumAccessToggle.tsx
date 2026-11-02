"use client";

import { useState, useTransition } from "react";
import { setMobilePremiumActive } from "./actions";

export default function PremiumAccessToggle({ userId, active }: { userId: string; active: boolean }) {
  const [enabled, setEnabled] = useState(active);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  return <span className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{enabled ? "Prémium aktív" : "Prémium inaktív"}</span><button disabled={pending} onClick={() => startTransition(async () => {
    setError("");
    try { const result = await setMobilePremiumActive(userId, !enabled); setEnabled(result.active); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Nem sikerült a módosítás."); }
  })} className="rounded-lg border border-slate-300 px-2 py-1 text-[10px] font-bold disabled:opacity-50">{pending ? "Mentés…" : enabled ? "Lejárat / kikapcsolás" : "Aktiválás"}</button>{error && <span role="alert" className="text-xs text-red-700">{error}</span>}</span>;
}
