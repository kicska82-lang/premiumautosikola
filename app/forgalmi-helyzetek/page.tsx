import type { Metadata } from "next";
import { BrainCircuit, CarFront, ShieldCheck, Sparkles } from "lucide-react";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { getPublicContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Forgalmi Labor | Prémium Autósiskola",
  description:
    "166 interaktív forgalmi helyzet témakörök, animációk és részletes KRESZ-magyarázatok szerint.",
};

const benefits = [
  {
    icon: CarFront,
    title: "Életszerű helyzetek",
    text: "Kereszteződések, gyalogosok, kerékpárosok, villamosok és különleges forgalmi helyzetek.",
  },
  {
    icon: BrainCircuit,
    title: "Érthető magyarázat",
    text: "A helyes sorrend mellett azt is megmutatjuk, melyik KRESZ-szabály alapján születik a döntés.",
  },
  {
    icon: ShieldCheck,
    title: "Biztonságos gyakorlás",
    text: "Saját tempóban ismételhetsz, lassíthatsz és újra lejátszhatod az áthaladást.",
  },
];

export default async function TrafficSituationsPage() {
  const content = await getPublicContent();

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden bg-[#0b1426] pb-16 pt-28 text-white sm:pt-32">
        <section className="relative">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(circle_at_50%_0%,rgba(244,204,99,.18),transparent_62%)]" />
          <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.2em] text-amber-300">
                <Sparkles className="h-4 w-4" />
                Prémium interaktív gyakorlótér
              </p>
              <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Forgalmi helyzetek,
                <span className="block text-amber-300">érthetően.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Döntsd el az áthaladási sorrendet, játszd le a megoldást, majd ismerd meg a mögötte álló KRESZ-szabályt.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-6xl gap-4 md:grid-cols-3">
              {benefits.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[.045] p-5 shadow-xl shadow-black/10 backdrop-blur"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 text-lg font-black">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#0b1426] shadow-2xl shadow-black/40 ring-1 ring-amber-300/5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#101c31] px-5 py-4 sm:px-7">
                <div>
                  <p className="text-xs font-black uppercase tracking-[.18em] text-amber-300">Prémium Forgalmi Labor</p>
                  <p className="mt-1 text-sm text-slate-400">166 interaktív gyakorlóhelyzet</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs font-bold text-slate-300">
                  AI-támogatással készült tartalom
                </span>
              </div>
              <iframe
                src="/forgalmi-labor/index.html?v=20261018-1"
                title="Prémium Autósiskola – Forgalmi Labor"
                className="block h-[1380px] w-full border-0 md:h-[980px]"
                allowFullScreen
              />
            </div>

            <p className="mx-auto mt-6 max-w-4xl text-center text-xs leading-5 text-slate-500">
              Az ábrák AI-támogatással készültek, szemléltető célt szolgálnak és szakmai ellenőrzés alatt állnak.
            </p>
          </div>
        </section>
      </main>
      <Footer settings={content.settings} />
    </>
  );
}
