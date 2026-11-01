"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  ["Főoldal", "/#fooldal"],
  ["Képzések", "/#kepzesek"],
  ["KRÉTA eJogsi", "/kreta-ejogsi"],
  ["Oktatók", "/#oktatok"],
  ["Autók", "/#autok"],
  ["Vélemények", "/#velemenyek"],
  ["Kapcsolat", "/#kapcsolat"],
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
        aria-expanded={open}
        aria-controls="mobile-site-menu"
        onClick={() => setOpen((current) => !current)}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:border-amber-400/60 hover:text-amber-300"
      >
        {open ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12" /></svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        )}
      </button>
      {open && (
        <>
          <button aria-label="Menü bezárása" className="fixed inset-20 z-40 cursor-default bg-black/35 lg:hidden" onClick={() => setOpen(false)} />
          <nav id="mobile-site-menu" aria-label="Mobil navigáció" className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#111d36] p-2 text-white shadow-2xl shadow-black/40">
            {links.map(([label, href]) => (
              <Link key={label} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-white/8 hover:text-amber-300">
                {label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
