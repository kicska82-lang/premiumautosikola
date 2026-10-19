import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront, CheckCircle2, ClipboardPenLine, MonitorPlay } from "lucide-react";

const benefits = [
  "Magabiztos, biztonságos vezetési tudás",
  "Online KRESZ-tanfolyam saját tempóban",
  "Átlátható képzési díjak",
  "Személyre szabott haladási ütem",
  "Türelmes, tanulóközpontú oktatás",
  "Vizsgára felkészítő gyakorlati órák",
  "Rugalmas, egyeztetett vezetési időpontok",
  "Gyakorlás tanpályán és valós forgalmi helyzetekben",
  "Automata váltós B kategóriás képzés",
  "Motoros képzések AM, A1, A2 és A kategóriában",
  "Jogosítvánnyal rendelkezőknek gyakorlóóra",
  "Segítség az átjelentkezés ügyintézésében",
];

const steps = [
  {
    number: "01",
    title: "Jelentkezz",
    text: "Válaszd ki a képzést, töltsd ki az online jelentkezést, mi pedig segítünk a szükséges dokumentumok és a következő lépések egyeztetésében.",
    icon: ClipboardPenLine,
    action: true,
  },
  {
    number: "02",
    title: "Online KRESZ tanfolyam",
    text: "A tananyagot bárhonnan, saját ritmusodban végezheted, miközben mindig pontosan látod, hol tartasz.",
    icon: MonitorPlay,
  },
  {
    number: "03",
    title: "Vezetés és vizsga",
    text: "Tapasztalt oktatókkal és modern oktatóautóinkban készülsz fel magabiztosan a forgalomra és a vizsgára.",
    icon: CarFront,
  },
];

export default function StudentBenefits() {
  return (
    <section id="ut-a-jogsihoz" className="bg-[#1a2744] py-10 text-white md:py-14">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#15203a] shadow-2xl shadow-black/25">
        <div className="grid lg:grid-cols-[1.45fr_.55fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-500">Biztos kézben</p>
            <h2 className="mt-2 text-3xl font-black leading-tight text-white sm:text-4xl">Előnyök, amelyek tanulóinkra várnak</h2>
            <div className="mt-6 grid gap-x-7 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
              {benefits.map((benefit) => (
                <p key={benefit} className="flex items-start gap-2.5 text-sm font-bold leading-5 text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                  {benefit}
                </p>
              ))}
            </div>
          </div>
          <div className="relative min-h-[280px] bg-[#15203a] lg:min-h-full">
            <Image src="/images/torok_tibor_oktatas.jpg" alt="Török Tibor oktatás közben az oktatóautóban" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15203a]/30 via-transparent to-transparent" />
          </div>
        </div>

        <div className="border-t border-white/10 bg-[#10182d] p-6 sm:p-8 lg:p-10">
          <div className="mb-6 md:flex md:items-end md:justify-between md:gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-400">Három egyszerű lépés</p>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">Így lesz jogosítványod</h2>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:mt-0 md:text-right">
              A jelentkezéstől a sikeres forgalmi vizsgáig végig melletted leszünk.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article key={step.number} className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-[#1b2948] p-5">
                  <span className="absolute right-4 top-2 text-5xl font-black leading-none text-white/[0.04]">{step.number}</span>
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-400/35 bg-amber-400/10 text-amber-300">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </span>
                    <div className="relative">
                      <h3 className="text-lg font-extrabold text-white">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{step.text}</p>
                      {step.action && (
                        <Link href="/jelentkezes" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-amber-300 transition hover:text-amber-200">
                          Jelentkezem <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
