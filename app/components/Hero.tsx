import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CarFront, Star, UsersRound } from "lucide-react";
import type { HeroContent, Stat } from "@/types/content";

const statIcons = [UsersRound, CarFront, CalendarDays, Star];

function withoutPromotion(description: string) {
  return description
    .replace(/Vezess nálunk 30 órát[^!\n]*!/giu, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function Hero({ hero, stats }: { hero: HeroContent | null; stats: Stat[] }) {
  if (!hero) return null;
  const backgroundImage = hero.background_image === "/images/hero-bg.png"
    ? "/images/nyiregyhaza-hosok-tere.png"
    : hero.background_image;

  return <section id="fooldal" className="relative isolate min-h-[620px] overflow-hidden bg-[#0a1124] pt-20 text-white lg:min-h-[650px]">
    <Image
      src={backgroundImage}
      alt=""
      fill
      priority
      sizes="100vw"
      className="-z-30 object-cover object-center"
      style={{ maskImage: "linear-gradient(to right, transparent 0%, black 48%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 48%)" }}
    />
    <div className="absolute inset-0 -z-20 bg-[#0a1124]/40" />
    <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0a1124] via-[#0a1124]/85 via-45% to-[#172542]/35" />
    <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#0a1124] via-transparent to-[#0a1124]/45" />

    <div className="relative mx-auto flex min-h-[540px] max-w-[1600px] flex-col px-6 pb-36 pt-20 lg:min-h-[570px] lg:px-10 lg:pt-24">
      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.45em] text-amber-400">{hero.badge}</p>
        <h1 className="whitespace-pre-line text-xl font-black uppercase italic leading-[0.95] tracking-tight sm:text-2xl lg:text-3xl xl:text-4xl">{hero.title}</h1>
        <h2 className="mt-2 text-xl font-black uppercase italic leading-[0.95] tracking-tight text-amber-400 sm:text-2xl lg:text-3xl xl:text-4xl">{hero.accent_title}</h2>
        <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-7 text-gray-100 lg:text-lg">{withoutPromotion(hero.description)}</p>
        <div className="mt-7 flex flex-wrap gap-4">
          <Link href="/jelentkezes" className="rounded-lg bg-gradient-to-br from-amber-300 to-amber-600 px-6 py-3 text-sm font-extrabold text-black shadow-lg shadow-amber-600/20 transition hover:scale-[1.02]">{hero.primary_button_text}</Link>
          <Link href="/#kepzesek" className="rounded-lg border border-amber-400 bg-black/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-400 hover:text-black">Képzéseink</Link>
        </div>
      </div>
    </div>
    {stats.length > 0 && <div className="absolute bottom-10 left-1/2 z-20 w-[calc(100%-3rem)] max-w-[1500px] -translate-x-1/2 rounded-xl border border-amber-400/60 bg-black/75 px-4 py-4 backdrop-blur-md">
      <div className="grid grid-cols-2 gap-y-4 md:grid-cols-4">{stats.slice(0, 4).map((stat, index) => { const Icon = statIcons[index] ?? Star; return <div key={stat.title} className="flex items-center justify-center gap-3 border-amber-400/25 px-3 md:border-r last:border-0"><Icon className="h-9 w-9 text-amber-400" strokeWidth={1.6} /><div><p className="text-2xl font-black text-amber-400">{stat.number}{stat.suffix}</p><p className="text-sm text-white">{stat.title}</p></div></div>; })}</div>
    </div>}
  </section>;
}
