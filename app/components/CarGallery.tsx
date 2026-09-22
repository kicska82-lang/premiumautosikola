"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function CarGallery({ carName, images, variant = "cover" }: { carName: string; images: string[]; variant?: "cover" | "grid" }) {
  const gallery = images.slice(0, 5);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index + gallery.length - 1) % gallery.length);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index + 1) % gallery.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gallery.length, isOpen]);

  if (!gallery.length) return null;
  const goPrevious = () => setActiveIndex((index) => (index + gallery.length - 1) % gallery.length);
  const goNext = () => setActiveIndex((index) => (index + 1) % gallery.length);

  return <>
    {variant === "cover" ? <button type="button" onClick={() => { setActiveIndex(0); setIsOpen(true); }} className="relative block h-60 w-full overflow-hidden text-left" aria-label={`${carName} galériájának megnyitása`}>
      <Image src={gallery[0]} alt={`${carName} – galéria borítókép`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-110" />
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-4 pt-10 text-sm font-bold text-white"><span className="inline-flex items-center gap-2"><Images className="h-4 w-4 text-amber-400" />Autógaléria</span><span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 text-xs">{gallery.length}/5 kép</span></span>
    </button> : <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">{gallery.map((image, index) => <button key={image} type="button" onClick={() => { setActiveIndex(index); setIsOpen(true); }} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 text-left transition hover:border-amber-400" aria-label={`${carName} – ${index + 1}. kép megnyitása`}><Image src={image} alt={`${carName} – ${index + 1}. kép`} fill sizes="(max-width: 640px) 45vw, 220px" className="object-cover transition duration-300 hover:scale-105" /></button>)}</div>}
    {isOpen && typeof document !== "undefined" && createPortal(<div role="dialog" aria-modal="true" aria-label={`${carName} képgaléria`} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div className="relative h-[min(82vh,900px)] w-[min(96vw,1400px)]" onClick={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => setIsOpen(false)} className="absolute right-3 top-3 z-10 rounded-full bg-black/65 p-3 text-white transition hover:bg-amber-500 hover:text-black" aria-label="Galéria bezárása"><X className="h-5 w-5" /></button>
        <div className="relative h-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950"><Image src={gallery[activeIndex]} alt={`${carName} – ${activeIndex + 1}. kép`} fill sizes="96vw" className="object-contain" priority />
          {gallery.length > 1 && <><button type="button" onClick={goPrevious} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-3 text-white transition hover:bg-amber-500 hover:text-black" aria-label="Előző kép"><ChevronLeft className="h-6 w-6" /></button><button type="button" onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-3 text-white transition hover:bg-amber-500 hover:text-black" aria-label="Következő kép"><ChevronRight className="h-6 w-6" /></button></>}
        </div>
        {gallery.length > 1 && <div className="mt-4 flex justify-center gap-2">{gallery.map((image, index) => <button key={image} type="button" onClick={() => setActiveIndex(index)} className={`relative h-14 w-20 overflow-hidden rounded-lg border-2 ${activeIndex === index ? "border-amber-400" : "border-transparent opacity-60 hover:opacity-100"}`} aria-label={`${index + 1}. kép`}><Image src={image} alt="" fill sizes="80px" className="object-cover" /></button>)}</div>}
      </div>
    </div>, document.body)}
  </>;
}
