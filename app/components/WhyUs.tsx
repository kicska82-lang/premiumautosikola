import type { Feature } from "@/types/content";

export default function WhyUs({ features }: { features: Feature[] }) {
  return (
    <section
      id="miert"
      className="bg-[#1a2744] py-5"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">

          <p className="text-xl font-semibold uppercase tracking-[0.25em] text-amber-400 md:text-2xl">
            Miért válassz minket?
          </p>

          <h2 className="mt-4 text-3xl font-black text-white md:text-4xl">
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
