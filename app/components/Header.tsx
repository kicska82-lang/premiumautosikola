import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#050816]/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logó */}
        <div className="flex items-center">
          <Image
            src="/logoo.png"
            alt="Prémium Autósiskola"
            width={220}
            height={60}
            priority
            style={{ width: "220px", height: "auto" }}
          />
        </div>

        {/* Menü */}
        <nav className="hidden md:flex gap-8 text-white">
          <a href="#fooldal" className="hover:text-amber-400 transition">Főoldal</a>
          <a href="#kepzesek" className="hover:text-amber-400 transition">Képzések</a>
          <a href="#arlista" className="hover:text-amber-400 transition">Árlista</a>
          <a href="#oktatok" className="hover:text-amber-400 transition">Oktatók</a>
          <a href="#kapcsolat" className="hover:text-amber-400 transition">Kapcsolat</a>
        </nav>

        {/* Gomb */}
        <button className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400">
          Jelentkezem
        </button>

      </div>
    </header>
  );
}