import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#0d162d]/95 backdrop-blur">
      <div className="hidden border-b border-white/10 md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-end gap-6 px-6 text-xs font-semibold text-slate-300">
          <a href="tel:+36302352597" className="transition hover:text-amber-300">+36/30-235-2597</a>
          <a href="mailto:info@premiumautosiskola.hu" className="transition hover:text-amber-300">info@premiumautosiskola.hu</a>
          <span>4400 Nyíregyháza, Széchenyi utca 17. fszt. 2U.</span>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">

        {/* Logó */}
        <div className="flex items-center">
          <Image
            src="/images/logoo.png"
            alt="Prémium Autósiskola"
            width={220}
            height={60}
            priority
            className="h-auto w-[clamp(112px,36vw,150px)] sm:w-[190px] lg:w-[220px]"
          />
        </div>

        {/* Menü */}
        <nav className="hidden items-center gap-5 text-sm text-white lg:flex xl:gap-7 xl:text-base">
          <Link href="/#fooldal" className="font-semibold transition hover:text-amber-400">Főoldal</Link>
          <Link href="/#kepzesek" className="font-semibold transition hover:text-amber-400">Képzések</Link>
          <Link href="/kreta-ejogsi" className="rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1.5 font-bold text-amber-300 transition hover:bg-amber-400 hover:text-slate-950">KRÉTA eJogsi</Link>
          <Link href="/#oktatok" className="font-semibold transition hover:text-amber-400">Oktatók</Link>
          <Link href="/#autok" className="font-semibold transition hover:text-amber-400">Autók</Link>
          <Link href="/#velemenyek" className="font-semibold transition hover:text-amber-400">Vélemények</Link>
          <Link href="/#kapcsolat" className="font-semibold transition hover:text-amber-400">Kapcsolat</Link>
        </nav>

        {/* Gomb */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <MobileNav />
          <Link href="/jelentkezes" className="whitespace-nowrap rounded-xl bg-amber-500 px-2 py-2.5 text-xs font-semibold text-black transition hover:bg-amber-400 sm:px-6 sm:py-3 sm:text-base">
            Jelentkezem
          </Link>
        </div>

      </div>
    </header>
  );
}
