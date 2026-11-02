"use client";

import { useState } from "react";
import { createMobileAccount } from "./actions";

type Contract = { id: string; student_name: string; student_email: string; course_category: string; contract_number: string };
type Instructor = { user_id: string; display_name: string; username: string };

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "").slice(0, 25);
}

export default function MobileAccountForm({ contracts, instructors }: { contracts: Contract[]; instructors: Instructor[] }) {
  const [role, setRole] = useState<"student" | "instructor">("student");
  const [isTestAccount, setIsTestAccount] = useState(true);
  const [contractId, setContractId] = useState(contracts[0]?.id ?? "");
  const [instructorId, setInstructorId] = useState(instructors[0]?.user_id ?? "");
  const [displayName, setDisplayName] = useState("Teszt Tanuló");
  const [username, setUsername] = useState("teszt.tanulo");
  const [premiumActive, setPremiumActive] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState<{ username: string; password: string; role: string; isTestAccount: boolean } | null>(null);

  function selectContract(id: string) {
    setContractId(id);
    const contract = contracts.find((item) => item.id === id);
    if (contract) {
      setDisplayName(contract.student_name);
      const digits = contract.contract_number.match(/\d+/g)?.join("").slice(-4) ?? "0001";
      setUsername(`${slug(contract.student_name)}.${digits}`.slice(0, 31));
    }
  }

  function selectRole(nextRole: "student" | "instructor") {
    setRole(nextRole);
    const testMode = nextRole === "student";
    setIsTestAccount(testMode);
    setDisplayName(testMode ? "Teszt Tanuló" : "");
    setUsername(testMode ? "teszt.tanulo" : "");
    if (testMode) setPremiumActive(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setCredentials(null);
    try {
      const result = await createMobileAccount({
        role, username, displayName, isTestAccount: role === "student" && isTestAccount,
        premiumActive: role === "student" && premiumActive,
        ...(role === "student" ? { ...(isTestAccount ? {} : { contractId }), instructorId } : {}),
      });
      setCredentials(result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "A fiók létrehozása nem sikerült.");
    } finally { setBusy(false); }
  }

  const canSubmit = !busy && (role === "instructor" || (instructors.length > 0 && (isTestAccount || contracts.length > 0)));

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]">
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold">Új portálfiók</h2>
      <label className="block text-sm font-semibold">Fiók típusa<select value={role} onChange={(event) => selectRole(event.target.value as typeof role)} className="mt-1 w-full rounded-lg border p-2"><option value="student">Tanuló</option><option value="instructor">Oktató</option></select></label>
      {role === "student" && <>
        <label className="flex items-start gap-3 rounded-xl bg-amber-50 p-3 text-sm"><input type="checkbox" checked={isTestAccount} onChange={(event) => setIsTestAccount(event.target.checked)} className="mt-1" /><span><strong>Elkülönített teszttanuló</strong><span className="mt-1 block text-xs leading-5 text-slate-600">Nem kapcsolódik valódi szerződéshez; próbaórák és prémium hozzáférés céljára.</span></span></label>
        {isTestAccount ? <label className="block text-sm font-semibold">Tesztfiók neve<input required minLength={2} maxLength={120} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-1 w-full rounded-lg border p-2" /></label> : <label className="block text-sm font-semibold">Aktív képzési szerződés<select required value={contractId} onChange={(event) => selectContract(event.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="">Válassz szerződést</option>{contracts.map((contract) => <option key={contract.id} value={contract.id}>{contract.contract_number} · {contract.student_name} · {contract.course_category}</option>)}</select></label>}
        <label className="block text-sm font-semibold">Hozzárendelt oktató<select required value={instructorId} onChange={(event) => setInstructorId(event.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="">Válassz oktatót</option>{instructors.map((item) => <option key={item.user_id} value={item.user_id}>{item.display_name} · @{item.username}</option>)}</select></label>
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm"><input type="checkbox" checked={premiumActive} onChange={(event) => setPremiumActive(event.target.checked)} /><span><strong>Prémium hozzáférés aktív</strong><span className="mt-1 block text-xs text-slate-500">A teszttanulónál kötelező; valódi előfizetésnél admin aktiválja, amíg nincs fizetési szolgáltató bekötve.</span></span></label>
      </>}
      {role === "instructor" && <label className="block text-sm font-semibold">Oktató neve<input required minLength={2} maxLength={120} value={displayName} onChange={(event) => { setDisplayName(event.target.value); setUsername(slug(event.target.value) ? `oktato.${slug(event.target.value)}`.slice(0, 31) : ""); }} className="mt-1 w-full rounded-lg border p-2" /></label>}
      <label className="block text-sm font-semibold">Felhasználónév<input required minLength={3} maxLength={31} pattern="[a-z0-9][a-z0-9._-]{2,30}" autoCapitalize="none" autoCorrect="off" value={username} onChange={(event) => setUsername(event.target.value.toLowerCase())} className="mt-1 w-full rounded-lg border p-2 font-mono" /><span className="mt-1 block text-xs font-normal text-slate-500">Belépéshez ezt és az egyszer megjelenő jelszót kell használni.</span></label>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button disabled={!canSubmit} className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy ? "Létrehozás…" : "Fiók létrehozása"}</button>
    </form>
    <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950"><h3 className="font-bold">Hozzáférések és tesztelés</h3><p className="mt-2">Minden oktatónak és tanulónak egyedi felhasználóneve készül. A jelszó csak egyszer, sikeres létrehozás után látszik; add át biztonságosan. A tanuló csak a saját, a hozzárendelt oktató pedig csak az aktív prémium tanulók kartonját látja.</p>{credentials && <div className="mt-4 rounded-xl border border-amber-300 bg-white p-4"><p className="font-bold">Belépési adatok — most mentsd el</p><p className="mt-2">Név: <strong>{displayName}</strong></p><p>Szerepkör: <strong>{credentials.role === "instructor" ? "Oktató" : credentials.isTestAccount ? "Teszt tanuló" : "Tanuló"}</strong></p><p>Felhasználónév: <strong className="font-mono">{credentials.username}</strong></p><p className="break-all">Jelszó: <strong className="font-mono">{credentials.password}</strong></p></div>}</aside>
  </div>;
}
