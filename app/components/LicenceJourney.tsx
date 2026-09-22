import Link from "next/link";
import { ArrowRight, CarFront, ClipboardPenLine, MonitorPlay } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Jelentkezz akár online!",
    text: "Válaszd ki a képzést, töltsd ki a jelentkezési űrlapot, és kollégánk segít a szükséges dokumentumok, valamint a következő lépések egyeztetésében.",
    icon: ClipboardPenLine,
    action: true,
  },
  {
    number: "02",
    title: "Online KRESZ tanfolyam",
    text: "A tananyagot a saját ritmusodban végezheted. Bárhonnan tanulhatsz, miközben végig tudod, pontosan hol tartasz a felkészülésben.",
    icon: MonitorPlay,
  },
  {
    number: "03",
    title: "Gyakorlati vezetés és vizsga",
    text: "A sikeres KRESZ-vizsga után tapasztalt oktatókkal, modern oktatóautóinkban készülhetsz fel magabiztosan a forgalomra és a vizsgára.",
    icon: CarFront,
  },
];

export default function LicenceJourney() {
  return (
    <section id="ut-a-jogsihoz" className="relative overflow-hidden bg-[#10182d] py-12 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(212,175,55,0.16),transparent_25%),radial-gradient(circle_at_88%_92%,rgba(212,175,55,0.1),transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="text-3xl font-black text-white sm:text-4xl">Így lesz jogosítványod</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Lépésről lépésre végigvezetünk a jelentkezéstől a sikeres forgalmi vizsgáig.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border border-amber-300/20 bg-[#1b2948] p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-amber-400/60 sm:p-8"
              >
                <span className="absolute right-6 top-4 text-6xl font-black leading-none text-white/[0.035] sm:text-7xl">{step.number}</span>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-400/10 text-amber-300 transition group-hover:scale-105 group-hover:bg-amber-400 group-hover:text-[#070b18]">
                  <Icon className="h-7 w-7" strokeWidth={1.9} />
                </div>

                <h3 className="max-w-xs text-2xl font-extrabold leading-tight text-white">{step.title}</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-slate-300">{step.text}</p>

                {step.action && (
                  <Link
                    href="/jelentkezes"
                    className="mt-auto inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 px-5 py-3 text-sm font-extrabold text-black shadow-lg shadow-amber-600/20 transition hover:scale-[1.02]"
                  >
                    Jelentkezem <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
