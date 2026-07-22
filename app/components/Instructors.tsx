export default function Instructors() {
  const instructors = [
    {
      name: "Moravcsik Gábor",
      category: "B kategória",
      experience: "15+ év tapasztalat",
      description:
        "Türelmes, gyakorlatorientált oktatás. A cél a magabiztos és biztonságos vezetés.",
      image: "/instructor-placeholder.jpg",
    },
    {
      name: "Török Tibor",
      category: "B kategória",
      experience: "12+ év tapasztalat",
      description:
        "Nyugodt, segítőkész oktató, aki minden tanulóra személyre szabott figyelmet fordít.",
      image: "/instructor-placeholder.jpg",
    },
    {
      name: "Rátonyi Róbert",
      category: "B kategória",
      experience: "10+ év tapasztalat",
      description:
        "Vizsgaközpontú felkészítés modern szemlélettel és türelmes hozzáállással.",
      image: "/instructor-placeholder.jpg",
    },
    {
      name: "Kicska Gábor",
      category: "B kategória",
      experience: "8+ év tapasztalat",
      description:
        "Barátságos légkör, modern oktatási módszerek és magas sikeres vizsgaarány.",
      image: "/instructor-placeholder.jpg",
    },
  ];

  return (
    <section
      id="oktatok"
      className="bg-[#050816] py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center mb-16">

          <p className="text-amber-400 tracking-[8px] uppercase text-sm">
            Oktatóink
          </p>

          <h2 className="mt-4 text-5xl font-black">
            Ismerd meg oktatóinkat
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Tapasztalt, türelmes és felkészült oktatóink segítenek,
            hogy magabiztos vezetővé válj.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          {instructors.map((item) => (

            <div
              key={item.name}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0B1024] transition duration-300 hover:-translate-y-3 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >

              <div className="h-72 overflow-hidden bg-gray-800">

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

              </div>

              <div className="p-8">

                <span className="rounded-full bg-amber-500/20 px-4 py-1 text-sm text-amber-300">
                  {item.category}
                </span>

                <h3 className="mt-5 text-2xl font-bold">
                  {item.name}
                </h3>

                <p className="mt-3 text-amber-400">
                  ⭐⭐⭐⭐⭐
                </p>

                <p className="mt-2 text-gray-400">
                  {item.experience}
                </p>

                <p className="mt-5 leading-7 text-gray-300">
                  {item.description}
                </p>

                <button
                  className="mt-8 w-full rounded-xl bg-amber-500 py-3 font-semibold text-black transition hover:bg-amber-400"
                >
                  Jelentkezem hozzá
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}