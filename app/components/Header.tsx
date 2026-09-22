import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#0d162d]/95 backdrop-blur">
      <div className="hidden border-b border-white/10 md:block">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-end gap-6 px-6 text-xs font-semibold text-slate-300">
          <a href="tel:+36302352597" className="transition hover:text-amber-300">+36-30-235-2597</a>
          <a href="mailto:info@premiumautosiskola.hu" className="transition hover:text-amber-300">info@premiumautosiskola.hu</a>
          <span>4400 Nyíregyháza, Széchenyi utca 18.</span>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logó */}
        <div className="flex items-center">
          <Image
            src="/images/logoo.png"
            alt="Prémium Autósiskola"
            width={220}
            height={60}
            priority
            style={{ width: "220px", height: "auto" }}
          />
        </div>

        {/* Menü */}
        <nav className="hidden gap-8 text-white lg:flex">
          <Link href="/#fooldal" className="font-semibold transition hover:text-amber-400">Főoldal</Link>
          <Link href="/#kepzesek" className="font-semibold transition hover:text-amber-400">Képzések</Link>
          <Link href="/#oktatok" className="font-semibold transition hover:text-amber-400">Oktatók</Link>
          <Link href="/#autok" className="font-semibold transition hover:text-amber-400">Autók</Link>
          <Link href="/#velemenyek" className="font-semibold transition hover:text-amber-400">Vélemények</Link>
          <Link href="/#kapcsolat" className="font-semibold transition hover:text-amber-400">Kapcsolat</Link>
        </nav>

        {/* Gomb */}
        <Link href="/jelentkezes" className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400">
          Jelentkezem
        </Link>

      </div>
    </header>
  );
}
