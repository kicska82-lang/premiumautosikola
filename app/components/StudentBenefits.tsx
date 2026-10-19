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
    <section className="bg-[#1a2744] py-10 text-white md:py-14">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#15203a] shadow-2xl shadow-black/25 lg:grid-cols-[1.45fr_.55fr]">
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
          <Link href="/jelentkezes" className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-base font-black text-slate-950 transition hover:bg-amber-300 sm:w-auto">
            Jelentkezem
          </Link>
        </div>
        <div className="relative min-h-[280px] bg-[#15203a] lg:min-h-full">
          <Image src="/images/torok_tibor_oktatas.jpg" alt="Török Tibor oktatás közben az oktatóautóban" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15203a]/30 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}
