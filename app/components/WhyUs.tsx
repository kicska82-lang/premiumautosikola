const features = [
  {
    title: "Modern oktatóautók",
    text: "Korszerű, biztonságos és kényelmes járművek a magabiztos vezetéshez.",
    icon: "🚗",
  },
  {
    title: "Tapasztalt oktatók",
    text: "Türelmes, segítőkész és vizsgaközpontú oktatás minden tanulónknak.",
    icon: "👨‍🏫",
  },
  {
    title: "Rugalmas időpontok",
    text: "Az órákat a tanulók időbeosztásához igazítjuk.",
    icon: "📅",
  },
  {
    title: "Magas sikeres vizsgaarány",
    text: "Tanulóink nagy része első alkalommal sikeres vizsgát tesz.",
    icon: "🏆",
  },
  {
    title: "Online ügyintézés",
    text: "Gyors jelentkezés és egyszerű kapcsolattartás online.",
    icon: "💻",
  },
  {
    title: "Részletfizetés",
    text: "Kedvező fizetési lehetőségek a képzés teljes ideje alatt.",
    icon: "💳",
  },
];

export default function WhyUs() {
  return (
    <section
      id="miert"
      className="bg-[#070b18] py-28"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">

          <p className="uppercase tracking-[8px] text-amber-400 text-sm">
            Miért válassz minket?
          </p>

          <h2 className="mt-5 text-5xl font-black text-white">
            Több mint egy autósiskola
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
            A célunk nem csupán a sikeres vizsga, hanem hogy magabiztos,
            biztonságos és önálló sofőrré válj.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((item) => (

            <div
              key={item.title}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20"
            >

              <div className="mb-6 text-6xl">
                {item.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="leading-8 text-gray-300">
                {item.text}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}