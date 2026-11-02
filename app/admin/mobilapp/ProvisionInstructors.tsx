"use client";

import { useState, useTransition } from "react";
import { provisionMissingInstructorAccounts } from "./actions";

export default function ProvisionInstructors({ count }: { count: number }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Awaited<ReturnType<typeof provisionMissingInstructorAccounts>> | null>(null);
  const [error, setError] = useState("");
  return <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-blue-950">Weboldali oktatók fiókjai</h2><p className="mt-1 text-sm text-blue-900">A {count} aktív oktatói profil alapján automatikusan létrehozza a még hiányzó mobilbelépéseket.</p></div><button disabled={pending || count === 0} onClick={() => startTransition(async () => {
    setError("");
    try { setResult(await provisionMissingInstructorAccounts()); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Az oktatói fiókok nem hozhatók létre."); }
  })} className="rounded-xl bg-blue-950 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Fiókok készülnek…" : "Hiányzó oktatói fiókok létrehozása"}</button></div>
    {error && <p role="alert" className="mt-3 rounded-lg bg-white p-3 text-sm text-red-800">{error}</p>}
    {result && <div className="mt-4 space-y-3 rounded-xl border border-blue-200 bg-white p-4 text-sm"><p className="font-bold">Most mentsd el az egyszer megjelenő belépési adatokat.</p>{result.credentials.map((item) => <p key={item.username} className="rounded-lg bg-slate-50 p-3"><strong>{item.name}</strong><br />Felhasználónév: <code>{item.username}</code><br />Ideiglenes jelszó: <code>{item.password}</code></p>)}{result.skipped.length > 0 && <p className="text-xs text-slate-500">Már létező fiók: {result.skipped.join(", ")}</p>}{result.failures.length > 0 && <p role="alert" className="text-xs text-red-700">Nem sikerült: {result.failures.join("; ")}</p>}{result.credentials.length === 0 && result.failures.length === 0 && <p className="text-sm text-emerald-800">Minden aktív oktatóhoz már van mobilfiók.</p>}</div>}
  </section>;
}
