const cars = [
  {
    instructor: "Moravcsik Gábor",
    car: "Suzuki Swift",
    transmission: "Manuális váltó",
    climate: "Klímás",
    image: "/cars/swift.jpg",
  },
  {
    instructor: "Török Tibor",
    car: "Opel Astra J",
    transmission: "Manuális váltó",
    climate: "Klímás",
    image: "/cars/astra-tibor.jpg",
  },
  {
    instructor: "Rátonyi Róbert",
    car: "Kia Ceed",
    transmission: "Manuális váltó",
    climate: "Klímás",
    image: "/cars/ceed.jpg",
  },
  {
    instructor: "Kicska Gábor",
    car: "Opel Astra J",
    transmission: "Manuális váltó",
    climate: "Klímás",
    image: "/cars/astra-gabor.jpg",
  },
];

export default function Cars() {
  return (
    <section
      id="autok"
      className="relative overflow-hidden py-28"
    >
      {/* Háttér */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/cars-bg.jpg')",
        }}
      />

      {/* Sötét overlay */}
      <div className="absolute inset-0 bg-[#050816]/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <p className="text-sm uppercase tracking-[8px] text-amber-400">
            Tanulóautóink
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Ismerd meg autóinkat
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            Korszerű, kényelmes és megbízható tanulóautók,
            hogy a vezetés tanulása magabiztos élmény legyen.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {cars.map((car) => (
            <div
              key={car.instructor}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              <div className="h-60 overflow-hidden">

                <img
                  src={car.image}
                  alt={car.car}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold text-white">
                  {car.car}
                </h3>

                <p className="mt-2 text-amber-400">
                  {car.instructor}
                </p>

                <div className="mt-6 space-y-3 text-gray-300">

                  <p>🕹️ {car.transmission}</p>

                  <p>❄️ {car.climate}</p>

                  <p>📚 B kategória</p>

                </div>

                <button className="mt-8 w-full rounded-xl bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400">
                  Jelentkezem
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}