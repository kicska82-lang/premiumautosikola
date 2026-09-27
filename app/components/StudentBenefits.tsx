import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

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

export default function StudentBenefits() {
  return (
    <section className="bg-slate-100 py-16 text-slate-800 md:py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-950/10 lg:grid-cols-[1.25fr_.75fr]">
        <div className="p-8 sm:p-12 lg:p-14">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-600">Biztos kézben</p>
          <h2 className="mt-4 text-4xl font-black leading-tight text-[#15203a] sm:text-5xl">Előnyök, amelyek tanulóinkra várnak</h2>
          <div className="mt-10 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {benefits.map((benefit) => (
              <p key={benefit} className="flex items-start gap-3 text-base font-bold leading-6 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                {benefit}
              </p>
            ))}
          </div>
          <Link href="/jelentkezes" className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-950 transition hover:bg-amber-300 sm:w-auto">
            Jelentkezem
          </Link>
        </div>
        <div className="relative min-h-[360px] bg-[#15203a] lg:min-h-full">
          <Image src="/images/kicska-gabor-opel-belso-v1.jpg" alt="Oktatóautó belső tere vezetés közben" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15203a]/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
