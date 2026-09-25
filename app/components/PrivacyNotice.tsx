"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const storageKey = "premium-autosiskola-privacy-notice-v1";
const subscribe = () => () => undefined;
const getServerSnapshot = () => false;

export default function PrivacyNotice() {
  const [dismissed, setDismissed] = useState(false);
  const accepted = useSyncExternalStore(subscribe, () => window.localStorage.getItem(storageKey) === "accepted", getServerSnapshot);
  function accept() { window.localStorage.setItem(storageKey, "accepted"); setDismissed(true); }
  if (accepted || dismissed) return null;
  return <div className="fixed inset-0 z-[100] flex items-end bg-black/45 p-3 sm:p-5" role="presentation"><section aria-labelledby="privacy-notice-title" className="mx-auto w-full max-w-5xl rounded-2xl border border-white/15 bg-[#0c1428] p-5 shadow-2xl sm:flex sm:items-center sm:gap-6 sm:p-6" role="dialog" aria-modal="true"><div className="flex-1"><h2 id="privacy-notice-title" className="font-black text-white">Adatkezelési tájékoztató</h2><p className="mt-2 text-sm leading-6 text-slate-200">A weboldal használatának folytatásával tudomásul veszed az adatkezelési tájékoztatót. Az online jelentkezéshez külön, kifejezett hozzájárulást kérünk.</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm"><Link href="/adatkezeles" className="font-bold text-amber-300 underline underline-offset-4">Adatkezelési tájékoztató</Link><Link href="/altalanos-szerzodesi-feltetelek" className="font-bold text-amber-300 underline underline-offset-4">ÁSZF</Link></div></div><button type="button" onClick={accept} className="mt-5 w-full shrink-0 rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300 sm:mt-0 sm:w-auto">Elfogadom</button></section></div>;
}
