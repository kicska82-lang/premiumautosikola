import Link from "next/link";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import KreszGuide from "@/app/components/KreszGuide";
import PrintDocumentButton from "@/app/components/PrintDocumentButton";
import { getPublicContent } from "@/lib/content";
import { publicDocuments } from "@/lib/documents";

export default async function PublicDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, content] = await Promise.all([params, getPublicContent()]);
  const document = publicDocuments[slug];
  if (!document) notFound();
  if (slug === "kresz-gyorssegedlet") return <><Header /><main className="min-h-screen bg-[#15203a] pb-24 pt-32 text-white"><KreszGuide /></main><Footer settings={content.settings} /></>;
  return <><Header /><main className="min-h-screen bg-[#15203a] pb-24 pt-32 text-white"><article className="mx-auto max-w-4xl px-6"><Link href="/#kapcsolat" className="text-sm font-semibold text-amber-300 hover:text-amber-200">← Vissza a lábléchez</Link><header className="mt-8 rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/15 to-white/5 p-7 md:p-10"><FileText className="h-8 w-8 text-amber-400" /><h1 className="mt-5 text-3xl font-black md:text-5xl">{document.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">{document.lead}</p><PrintDocumentButton /></header><div className="mt-8 space-y-6">{document.sections.map((section) => <section key={section.heading} className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8"><h2 className="text-2xl font-black text-white">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-slate-200">{paragraph}</p>)}{section.bullets && <ul className="mt-5 space-y-3 text-slate-200">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-3"><span className="text-amber-400">•</span>{bullet}</li>)}</ul>}</section>)}</div>{document.notice && <aside className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">{document.notice}</aside>}</article></main><Footer settings={content.settings} /></>;
}
