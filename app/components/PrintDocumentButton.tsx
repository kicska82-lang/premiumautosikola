"use client";

import { Printer } from "lucide-react";

export default function PrintDocumentButton() {
  return <button type="button" onClick={() => window.print()} className="mt-7 inline-flex items-center gap-2 rounded-xl border border-amber-400/70 px-4 py-3 text-sm font-bold text-amber-300 hover:bg-amber-400 hover:text-black"><Printer className="h-4 w-4" />Nyomtatás / Mentés PDF-ként</button>;
}
