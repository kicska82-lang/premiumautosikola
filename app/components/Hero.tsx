export default function Hero() {
  return (
    <section
      id="fooldal"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Háttér */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/auto_ejszaka.png')",
        }}
      />

      {/* Sötét réteg */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Bal oldali gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

      {/* Tartalom */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-8 pt-24">

        <div className="max-w-lg">

          {/* Város */}
          <p className="mb-4 text-xs uppercase tracking-[8px] text-amber-400">
            Nyíregyháza
          </p>

          {/* Cím */}
          <h1 className="text-5xl md:text-6xl font-black leading-none text-white">
            PRÉMIUM
          </h1>

          <h2 className="mb-8 text-5xl md:text-6xl font-black leading-none text-amber-400">
            AUTÓSISKOLA
          </h2>

          {/* Leírás */}
          <p className="mb-10 text-lg md:text-xl leading-8 text-gray-200">
            Modern oktatás, kiváló oktatók és prémium élmény.
            <br />
            Szerezd meg jogosítványodat magabiztosan,
            <br />
            a legjobb autókkal.
          </p>

          {/* Gombok */}
          <div className="flex gap-5 mb-14">

            <a
              href="#kapcsolat"
              className="rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-black transition duration-300 hover:bg-amber-400 hover:scale-105"
            >
              Jelentkezem →
            </a>

            <a
              href="#kepzesek"
              className="rounded-xl border border-amber-500 px-8 py-4 text-lg font-semibold text-white transition duration-300 hover:bg-amber-500 hover:text-black"
            >
              Képzések →
            </a>

          </div>

          {/* Statisztikák */}
          <div className="flex gap-12">

            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                2500+
              </h3>
              <p className="text-sm text-gray-300">
                sikeres vizsga
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                15+
              </h3>
              <p className="text-sm text-gray-300">
                év tapasztalat
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-amber-400">
                4.9 ★
              </h3>
              <p className="text-sm text-gray-300">
                Google értékelés
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}