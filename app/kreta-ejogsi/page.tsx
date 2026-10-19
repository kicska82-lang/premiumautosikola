import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CarFront,
  CheckCircle2,
  CircleAlert,
  Download,
  ExternalLink,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Laptop,
  Phone,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getPublicContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "KRÉTA eJogsi – gyakorlati képzés",
  description:
    "Útmutató a KRÉTA eJogsi rendszerből érkező tanulóknak: képzési igazolás letöltése, határidők és jelentkezés a Prémium Autósiskolába.",
};

const steps = [
  {
    icon: GraduationCap,
    number: "01",
    title: "Legyen sikeres a KRESZ-vizsgád",
    text: "A gyakorlati képzőszerv kiválasztásához előbb sikeres közlekedési alapismeretek vizsgára van szükséged.",
  },
  {
    icon: Laptop,
    number: "02",
    title: "Nyisd meg a KRÉTA DKT eJogsi felületét",
    text: "Az Elméleti képzések között nyisd meg a képzés összegzését, majd válaszd a Gyakorlati képzőszerv választása lehetőséget.",
  },
  {
    icon: Download,
    number: "03",
    title: "Töltsd le a Képzési igazolást",
    text: "Jelöld, hogy másik képzőszervnél folytatod, majd a Dokumentum kártyáról töltsd le a Képzési igazolást.",
  },
  {
    icon: CarFront,
    number: "04",
    title: "Jelentkezz hozzánk vezetni",
    text: "Vedd fel velünk a kapcsolatot, hozd el az igazolást, és segítünk a beiratkozásban, valamint a gyakorlati képzés elindításában.",
  },
];

const faqs = [
  {
    question: "Melyik dokumentumot kell letöltenem?",
    answer:
      "A pontos neve: Képzési igazolás. Az „Igazolás sikeres KRESZ képzésről” és az „Igazolás sikeres KRESZ vizsgáról” nem használható az autósiskolába történő áthelyezéshez.",
  },
  {
    question: "Ingyenes lesz nálatok a gyakorlati képzés?",
    answer:
      "Nem. A KRÉTA eJogsi keretében elvégzett ingyenes elméleti képzés nem teszi automatikusan ingyenessé a választott autósiskola gyakorlati oktatását. A vezetési órákra a Prémium Autósiskola aktuális díjai vonatkoznak.",
  },
  {
    question: "Mi történik, ha már nem vagyok tanulói jogviszonyban?",
    answer:
      "A hozzáférés megmaradhat, ha az iskola nem törli a belépési adataidat. Érdemes azonban a Képzési igazolást a sikeres vizsga után mielőbb letölteni és biztonságosan elmenteni.",
  },
  {
    question: "Segítetek, ha nem találom a dokumentumot?",
    answer:
      "Igen. Hívj minket vagy gyere be az irodába, és megmutatjuk, hol keresd. A KRÉTA-fiókod belépési adatait ne küldd el nekünk.",
  },
];

const officialScreenshots = [
  {
    src: "/images/kreta-kepzoszerv-valasztas.webp",
    alt: "A Személyesen választok képzőszervet lehetőség a KRÉTA eJogsi felületén",
    number: "1",
    title: "Válaszd a saját autósiskolát",
    text: "A Gyakorlati képzőszerv választása fülön kattints a „Személyesen választok képzőszervet” kártya Kiválasztás gombjára.",
  },
  {
    src: "/images/kreta-kepzoszerv-megerosites.webp",
    alt: "A képzőszerv-választás megerősítő ablaka a KRÉTA eJogsi felületén",
    number: "2",
    title: "Erősítsd meg a választást",
    text: "Olvasd el a tájékoztatást, jelöld be az elfogadást, majd küldd be. A KRÉTA figyelmeztetése szerint a beküldött választás nem módosítható és nem vonható vissza.",
  },
  {
    src: "/images/kreta-dokumentum-letoltes.webp",
    alt: "A Dokumentum gomb a KRÉTA eJogsi gyakorlati képzőszerv választási oldalán",
    number: "3",
    title: "Töltsd le a dokumentumot",
    text: "A kiválasztás után megjelenő kék „Dokumentum” gombbal tölthető le a Képzési igazolás.",
  },
];

export default async function KretaEJogsiPage() {
  const content = await getPublicContent();

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col overflow-hidden bg-[#0b1426] pt-28 text-white sm:pt-32">
        <section className="relative order-1 pb-10 pt-5 sm:pb-14 sm:pt-8">
          <div className="pointer-events-none absolute inset-x-0 -top-32 h-[640px] bg-[radial-gradient(circle_at_50%_0%,rgba(245,190,42,.2),transparent_62%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-7 px-6 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-amber-300">
                <BadgeCheck className="h-4 w-4" /> KRÉTA eJogsi segítség
              </p>
              <h1 className="mt-5 text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl">
                A KRESZ már megvan?
                <span className="mt-2 block text-amber-300">Folytasd nálunk a vezetést!</span>
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                Lépésről lépésre megmutatjuk, hogyan töltsd le a szükséges igazolást a KRÉTA rendszeréből, és hogyan jelentkezhetsz gyakorlati képzésre a Prémium Autósiskolába.
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm font-black text-amber-300"><ShieldCheck className="h-5 w-5 shrink-0" /> Átlátható díjakkal, rejtett költségek nélkül jelentkezhetsz.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/jelentkezes" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 transition hover:bg-amber-300">
                  Jelentkezem vezetésre <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="tel:+36302352597" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-bold transition hover:border-amber-300 hover:text-amber-300">
                  <Phone className="h-5 w-5" /> Segítséget kérek
                </a>
              </div>
            </div>
            <figure className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl shadow-black/40">
              <div className="relative aspect-[3/2]">
                <Image src="/images/kreta-ejogsi-utmutato-igazolassal-v3.webp" alt="Tanuló a KRÉTA Képzési igazolással megkezdi a gyakorlati vezetést Nyíregyházán" fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              </div>
              <figcaption className="border-t border-white/10 px-5 py-3 text-xs text-slate-400">Szemléltető, AI-támogatással készült illusztráció.</figcaption>
            </figure>
          </div>
        </section>

        <section className="order-3 py-8 sm:py-10">
          <div className="mx-auto max-w-5xl px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[.2em] text-amber-300">Hivatalos KRÉTA-képernyőképek</p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">Így találod meg a letöltést</h2>
              <p className="mt-4 leading-7 text-slate-300">A felület megjelenése idővel változhat. Mindig olvasd el a KRÉTA rendszerben megjelenő aktuális tájékoztatást a beküldés előtt.</p>
            </div>
            <div className="mt-6 space-y-4">
              {officialScreenshots.map(({ src, alt, number, title, text }) => (
                <article key={src} className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111c34] shadow-xl shadow-black/15 lg:grid-cols-[1.35fr_.65fr]">
                  <div className="relative aspect-[2.24/1] bg-white">
                    <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 65vw" className="object-contain" />
                  </div>
                  <div className="flex flex-col justify-center p-4 sm:p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300 font-black text-slate-950">{number}</span>
                    <h3 className="mt-4 text-xl font-black sm:text-2xl">{title}</h3>
                    <p className="mt-3 leading-7 text-slate-300">{text}</p>
                    <a href="https://tudasbazis.ekreta.hu/pages/viewpage.action?pageId=130678801" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200">Forrás: KRÉTA Tudásbázis <ExternalLink className="h-3.5 w-3.5" /></a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="order-4 border-y border-amber-300/25 bg-amber-300/10 py-8 sm:py-10">
          <div className="mx-auto grid max-w-6xl items-center gap-6 px-6 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-slate-950"><UserRoundCheck className="h-6 w-6" /></span>
              <p className="mt-4 text-sm font-black uppercase tracking-[.2em] text-amber-300">Kiemelten fontos 18 éves kor alatt</p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">Szülői jóváhagyás szükséges</h2>
              <p className="mt-4 leading-7 text-amber-50">
                Ha a tanuló még nem töltötte be a 18. életévét, a kiválasztott gyakorlati képzőszervet a szülőnek vagy törvényes képviselőnek is jóvá kell hagynia a <strong className="text-white">DKT eJogsi szülői felületén</strong>.
              </p>
              <ul className="mt-5 space-y-3 text-slate-200">
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />A tanuló először kiválasztja a kívánt lehetőséget.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />A választás ezután megjelenik a szülői felületen.</li>
                <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />A szülő vagy törvényes képviselő jóváhagyhatja vagy elutasíthatja azt.</li>
              </ul>
              <p className="mt-5 rounded-2xl border border-amber-300/30 bg-black/20 p-4 font-bold leading-7 text-white">Jóváhagyás nélkül a 18 év alatti tanuló gyakorlati képzésre történő jelentkezése nem véglegesíthető.</p>
            </div>
            <figure className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-white shadow-2xl shadow-black/30">
              <div className="relative aspect-[2.29/1]">
                <Image src="/images/kreta-szuloi-jovahagyas.webp" alt="A gyakorlati képzőszerv szülői jóváhagyása a KRÉTA eJogsi felületén" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
              </div>
              <figcaption className="border-t border-slate-200 px-5 py-3 text-xs leading-5 text-slate-600">A szülői felület mintaképe tesztadatokkal. Forrás: <a href="https://tudasbazis.ekreta.hu/pages/viewpage.action?pageId=130678801" target="_blank" rel="noreferrer" className="font-bold underline">KRÉTA Tudásbázis</a>.</figcaption>
            </figure>
          </div>
        </section>

        <section className="order-2 border-y border-white/10 bg-[#111c34] py-8 sm:py-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[.2em] text-amber-300">Így csináld</p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">Négy lépés a gyakorlati képzésig</h2>
              <p className="mt-4 leading-7 text-slate-300">A menüpontok neve a KRÉTA felület frissítésével változhat, de a letöltendő dokumentum neve mindig fontos.</p>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {steps.map(({ icon: Icon, number, title, text }) => (
                <article key={number} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1426] p-5">
                  <span className="absolute right-5 top-2 text-7xl font-black text-white/[.035]">{number}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300"><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-4 text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="order-5 border-y border-white/10 bg-[#111c34] py-8 sm:py-10">
          <div className="mx-auto grid max-w-6xl items-center gap-7 px-6 lg:grid-cols-[.8fr_1.2fr]">
            <figure className="mx-auto w-full max-w-md overflow-hidden rounded-[1.5rem] border border-white/15 bg-white p-4 shadow-2xl shadow-black/30 sm:p-6">
              <Image
                src="/images/kreta-kepzesi-igazolas-minta.webp"
                alt="A KRÉTA DKT eJogsi rendszerből letölthető Képzési igazolás mintája"
                width={624}
                height={732}
                sizes="(max-width: 1024px) 90vw, 420px"
                className="h-auto w-full"
              />
              <figcaption className="mt-4 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-600">
                Mintadokumentum, fiktív adatokkal. Forrás: KRÉTA Tudásbázis.
              </figcaption>
            </figure>
            <div>
              <p className="text-sm font-black uppercase tracking-[.2em] text-amber-300">Ezt a dokumentumot keresd</p>
              <h2 className="mt-2 text-2xl font-black sm:text-4xl">Így néz ki a Képzési igazolás</h2>
              <p className="mt-4 leading-7 text-slate-300">
                A dokumentum tetején a <strong className="text-white">„KÉPZÉSI IGAZOLÁS”</strong> megnevezés szerepel. Tartalmazza a kibocsátó intézmény, a tanuló és a képzés adatait, valamint a sikeres közlekedési alapismeretek vizsga időpontját.
              </p>
              <div className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-7 text-amber-50">
                A képen látható személyes adatok fiktív mintaadatok. A saját igazolásodat ne tedd közzé, és csak az ügyintézéshez szükséges csatornán add át.
              </div>
              <a
                href="https://tudasbazis.ekreta.hu/pages/viewpage.action?pageId=130678801"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-bold text-amber-300 transition hover:border-amber-300 hover:bg-amber-300 hover:text-slate-950"
              >
                Eredeti kép és hivatalos útmutató <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="order-6 py-8 sm:py-10">
          <div className="mx-auto grid max-w-6xl gap-5 px-6 lg:grid-cols-[1.05fr_.95fr]">
            <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-300/15 to-transparent p-6">
              <div className="flex items-start gap-4">
                <span className="rounded-2xl bg-amber-300 p-3 text-slate-950"><CircleAlert className="h-7 w-7" /></span>
                <div>
                  <p className="text-sm font-black uppercase tracking-[.18em] text-amber-300">Erre nagyon figyelj</p>
                  <h2 className="mt-2 text-3xl font-black">Csak a Képzési igazolás megfelelő</h2>
                </div>
              </div>
              <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="flex gap-3 font-bold text-emerald-300"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" /> Képzési igazolás – ezt töltsd le</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  <p>✕ Igazolás sikeres KRESZ képzésről</p>
                  <p>✕ Igazolás sikeres KRESZ vizsgáról</p>
                </div>
              </div>
              <p className="mt-5 leading-7 text-amber-50">A két hasonló nevű igazolás nem érvényes az autósiskolához történő átjelentkezésre.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <article className="rounded-3xl border border-white/10 bg-white/[.045] p-6">
                <CalendarClock className="h-7 w-7 text-amber-300" />
                <h3 className="mt-4 text-xl font-black">Fontos határidők</h3>
                <p className="mt-3 leading-7 text-slate-300">Az eJogsi képzés és vizsga teljesítésére 12 hónap áll rendelkezésre. A sikeres KRESZ-vizsga után a gyakorlati képzőszerv választása és a dokumentum letöltése legfeljebb 24 hónapig maradhat elérhető.</p>
              </article>
              <article className="rounded-3xl border border-white/10 bg-white/[.045] p-6">
                <HeartPulse className="h-7 w-7 text-amber-300" />
                <h3 className="mt-4 text-xl font-black">Orvosi alkalmasság</h3>
                <p className="mt-3 leading-7 text-slate-300">Érvényes TAJ-számmal az eJogsi programhoz kapcsolódó orvosi alkalmassági vizsgálat díjmentes lehet. TAJ nélkül a vizsgálat díjköteles.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="order-7 border-y border-white/10 bg-[#111c34] py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
              <div>
                <FileCheck2 className="h-9 w-9 text-amber-300" />
                <h2 className="mt-5 text-3xl font-black sm:text-4xl">Ezt készítsd elő</h2>
                <p className="mt-4 leading-7 text-slate-300">A gyors ügyintézéshez mentsd el a Képzési igazolást, és legyenek kéznél a személyes okmányaid. A pontos teendőket jelentkezés után egyeztetjük veled.</p>
                <a href="https://tudasbazis.ekreta.hu/pages/viewpage.action?pageId=130678801" target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-300 hover:text-amber-200">Hivatalos KRÉTA útmutató <ExternalLink className="h-4 w-4" /></a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Képzési igazolás", "Személyazonosító okmány", "Lakcímkártya", "Orvosi alkalmasság adatai"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1426] p-5 font-bold"><CheckCircle2 className="h-5 w-5 shrink-0 text-amber-300" />{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="order-8 py-8 sm:py-10">
          <div className="mx-auto max-w-4xl px-6">
            <div className="text-center">
              <HelpCircle className="mx-auto h-9 w-9 text-amber-300" />
              <h2 className="mt-3 text-2xl font-black sm:text-4xl">Gyakori kérdések</h2>
            </div>
            <div className="mt-7 space-y-3">
              {faqs.map(({ question, answer }) => (
                <details key={question} className="group rounded-2xl border border-white/10 bg-white/[.045] p-5 open:border-amber-300/30 sm:p-6">
                  <summary className="cursor-pointer list-none pr-8 text-lg font-black marker:hidden">{question}</summary>
                  <p className="mt-4 border-t border-white/10 pt-4 leading-7 text-slate-300">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="order-9 px-6 pb-14">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-amber-300/30 bg-gradient-to-r from-amber-300 to-amber-400 p-7 text-slate-950 shadow-2xl shadow-amber-950/20 sm:p-9">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <ShieldCheck className="h-9 w-9" />
                <h2 className="mt-4 text-3xl font-black sm:text-4xl">Elakadtál? Segítünk elindulni.</h2>
                <p className="mt-3 max-w-2xl text-lg font-semibold text-slate-800">Jelentkezz átlátható díjakkal, rejtett költségek nélkül, vagy hívd a +36/30-235-2597 telefonszámot. Együtt ellenőrizzük, hogy minden szükséges dokumentumod megvan-e.</p>
              </div>
              <Link href="/jelentkezes" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0b1426] px-7 py-4 font-black text-white transition hover:bg-[#162442]">Jelentkezem <ArrowRight className="h-5 w-5" /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer settings={content.settings} />
    </>
  );
}
