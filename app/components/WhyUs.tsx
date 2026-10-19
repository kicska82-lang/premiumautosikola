import type { Feature } from "@/types/content";

export default function WhyUs({ features }: { features: Feature[] }) {
  return (
    <section
      id="miert"
      className="bg-[#1a2744] pb-10 pt-3 md:pb-12 md:pt-4"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-6 text-center md:mb-8">

          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">
            Miért válassz minket?
          </p>

          <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">
            Több mint egy autósiskola
          </h2>

          <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-gray-400 md:text-base">
            A célunk nem csupán a sikeres vizsga, hanem hogy magabiztos,
            biztonságos és önálló sofőrré válj.
          </p>

        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {features.map((item) => (

            <div
              key={item.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/15"
            >

              <div className="mb-3 text-3xl">
                {item.icon}
              </div>

              <h3 className="mb-2 text-lg font-bold text-white">
                {item.title}
              </h3>

              <p className="text-sm leading-6 text-gray-300">
                {item.text}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
