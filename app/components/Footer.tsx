import Link from "next/link";
import { MapPin, Share2 } from "lucide-react";
import type { SiteSettings } from "@/types/content";

const documents = [
  { href: "/forgalmi-helyzetek", label: "Forgalmi helyzetek – bemutató" },
  { href: "/dokumentumok/kresz-gyorssegedlet", label: "KRESZ gyorssegédlet" },
  { href: "/dokumentumok/irasbeli-tajekoztato", label: "Írásbeli tájékoztató" },
  { href: "/altalanos-szerzodesi-feltetelek", label: "Általános szerződési feltételek" },
  { href: "/dokumentumok/jelentkezesi-adatlap", label: "Jelentkezési adatlap" },
  { href: "/dokumentumok/vezetesi-karton", label: "Vezetési karton" },
  { href: "/dokumentumok/kepzesi-igazolas", label: "Képzési igazolás" },
];

export default function Footer({ settings }: { settings: SiteSettings | null }) {
  const schoolName = settings?.school_name || "Prémium Autósiskola";
  return <footer id="kapcsolat" className="border-t-4 border-amber-400 bg-[#111a31] text-slate-200 shadow-[0_-18px_50px_rgba(0,0,0,0.22)]">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Aktualitások, letöltések</p>
        <ul className="mt-5 space-y-3 text-sm">{documents.map((document) => <li key={document.href}><Link href={document.href} className="transition hover:text-amber-300">{document.label}</Link></li>)}</ul>
      </section>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Kapcsolat</p>
        <div className="mt-5 space-y-3 text-sm"><a href="tel:+36302352597" className="block transition hover:text-amber-300">+36/30-235-2597</a><a href="mailto:info@premiumautosiskola.hu" className="block transition hover:text-amber-300">info@premiumautosiskola.hu</a><p className="pt-2 leading-6">Felnőttképzési nyilvántartási szám:<br /><strong className="text-white">B/2020/005325</strong></p></div>
      </section>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Iroda</p>
        <address className="mt-5 not-italic text-sm leading-6">4400 Nyíregyháza<br /><strong className="text-white">Széchenyi utca 17. fszt. 2U.</strong></address>
        <p className="mt-5 text-sm font-bold text-white">Nyitvatartás</p><p className="mt-2 text-sm leading-6">Kedd, csütörtök: 12–16 óra<br />Egyéb időpontban egyeztetéssel</p>
      </section>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-400">Kövess minket</p>
        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500"><Share2 className="h-4 w-4" />Facebook hamarosan</p>
        <a href="https://www.google.com/maps/search/?api=1&query=4400+Ny%C3%ADregyh%C3%A1za+Sz%C3%A9chenyi+utca+17" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-400/60 px-4 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-400 hover:text-black"><MapPin className="h-4 w-4" />Térkép az irodához</a>
      </section>
    </div>
    <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} {schoolName}. Minden jog fenntartva. <Link href="/adatkezeles" className="ml-3 hover:text-amber-300">Adatkezelési tájékoztató</Link><Link href="/altalanos-szerzodesi-feltetelek" className="ml-3 hover:text-amber-300">ÁSZF</Link></div>
  </footer>;
}
