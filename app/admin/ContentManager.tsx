"use client";

import { useState, useTransition } from "react";
import { deleteRecord, saveRecord } from "./actions";
import { LOCAL_IMAGE_OPTIONS } from "@/types/content";

type Field = { name: string; label: string; type?: "text" | "textarea" | "number" | "image" | "json" | "availability"; required?: boolean };
type RecordValue = { id: string | number };
type Availability = { day: string; from: string; to: string };
const weekDays = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];

export default function ContentManager({ table, title, fields, records }: { table: "courses" | "instructors" | "cars" | "testimonials"; title: string; fields: Field[]; records: RecordValue[] }) {
  const [editing, setEditing] = useState<RecordValue | null>(null);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const submit = (formData: FormData) => startTransition(async () => {
    try { await saveRecord(table, editing?.id ?? null, formData); setEditing(null); setMessage("A módosítás mentve."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Sikertelen mentés."); }
  });
  const remove = (id: string | number) => {
    if (!window.confirm("Biztosan törlöd ezt az elemet?")) return;
    startTransition(async () => { try { await deleteRecord(table, id); setMessage("Az elem törölve."); } catch (error) { setMessage(error instanceof Error ? error.message : "Sikertelen törlés."); } });
  };
  const displayValue = (value: unknown, preserveJson = false) => preserveJson
    ? JSON.stringify(value ?? [], null, 2)
    : Array.isArray(value) && value.every((item) => typeof item === "string")
      ? value.join("\n")
      : typeof value === "object" && value !== null
        ? JSON.stringify(value, null, 2)
        : String(value ?? "");
  const fieldValue = (record: RecordValue, key: string) => (record as Record<string, unknown>)[key];

  return <div>
    <div className="mb-8 flex items-center justify-between"><h1 className="text-4xl font-bold">{title}</h1><button onClick={() => setEditing({ id: "" })} className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black">+ Új elem</button></div>
    {message && <p aria-live="polite" className="mb-4 rounded-lg bg-slate-200 p-3 text-sm">{message}</p>}
    {editing && <form action={submit} className="mb-8 grid gap-4 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold">{editing.id ? "Szerkesztés" : "Új elem"}</h2>
      {fields.map((field) => <label key={field.name} className="grid gap-1 text-sm font-medium">{field.label}
        {field.type === "availability" ? <AvailabilityEditor key={String(editing.id)} initialValue={fieldValue(editing, field.name)} />
          : field.type === "textarea" || field.type === "json" ? <textarea name={field.name} required={field.required ?? field.name !== "experience"} rows={field.type === "json" ? 7 : 4} defaultValue={displayValue(fieldValue(editing, field.name), field.type === "json")} placeholder={field.type === "json" ? '[{ "label": "Elmélet", "value": "60 000 Ft" }]' : undefined} className="rounded-lg border p-3 font-mono" />
          : field.type === "image" ? <select name={field.name} required defaultValue={displayValue(fieldValue(editing, field.name)) || LOCAL_IMAGE_OPTIONS[0]} className="rounded-lg border p-3">{LOCAL_IMAGE_OPTIONS.map((image) => <option key={image} value={image}>{image}</option>)}</select>
          : <input name={field.name} type={field.type ?? "text"} required={field.required ?? field.name !== "experience"} defaultValue={displayValue(fieldValue(editing, field.name))} className="rounded-lg border p-3" />}
      </label>)}
      <div className="grid gap-1 text-sm font-medium"><span>Állapot</span><select name="status" defaultValue={displayValue(fieldValue(editing, "status")) || "draft"} className="rounded-lg border p-3"><option value="draft">Piszkozat</option><option value="published">Publikált</option></select></div>
      <label className="grid gap-1 text-sm font-medium">Sorrend<input name="sort_order" type="number" defaultValue={displayValue(fieldValue(editing, "sort_order")) || "0"} className="rounded-lg border p-3" /></label>
      <div className="flex gap-3"><button disabled={pending} className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-black">{pending ? "Mentés..." : "Mentés"}</button><button type="button" onClick={() => setEditing(null)} className="rounded-xl border px-5 py-3">Mégse</button></div>
    </form>}
    <div className="grid gap-4">{records.map((record) => <article key={record.id} className="flex items-center justify-between rounded-2xl bg-white p-6 shadow"><div><h2 className="text-xl font-bold">{String(fieldValue(record, "name") ?? fieldValue(record, "title") ?? "Névtelen elem")}</h2><p className="mt-1 text-sm text-slate-500">{fieldValue(record, "status") === "published" ? "Publikált" : "Piszkozat"}</p></div><div className="flex gap-2"><button onClick={() => setEditing(record)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">Szerkesztés</button><button disabled={pending} onClick={() => remove(record.id)} className="rounded-lg bg-red-600 px-4 py-2 text-white">Törlés</button></div></article>)}</div>
  </div>;
}

function AvailabilityEditor({ initialValue }: { initialValue: unknown }) {
  const initial = Array.isArray(initialValue) ? initialValue.filter((item): item is Availability => typeof item === "object" && item !== null && "day" in item && "from" in item && "to" in item).map((item) => ({ day: String(item.day), from: String(item.from), to: String(item.to) })) : [];
  const [slots, setSlots] = useState<Availability[]>(initial);
  const update = (index: number, key: keyof Availability, value: string) => setSlots((current) => current.map((slot, slotIndex) => slotIndex === index ? { ...slot, [key]: value } : slot));
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><input type="hidden" name="availability" value={JSON.stringify(slots)} />
    <p className="mb-3 text-xs font-normal text-slate-600">Add meg, hogy az oktató mely napokon és milyen időintervallumban vállal oktatást. Egy naphoz több idősáv is felvehető.</p>
    <div className="space-y-2">{slots.map((slot, index) => <div key={`${slot.day}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_120px_120px_auto]"><select value={slot.day} onChange={(event) => update(index, "day", event.target.value)} className="rounded-lg border p-2">{weekDays.map((day) => <option key={day}>{day}</option>)}</select><input type="time" value={slot.from} onChange={(event) => update(index, "from", event.target.value)} className="rounded-lg border p-2" /><input type="time" value={slot.to} onChange={(event) => update(index, "to", event.target.value)} className="rounded-lg border p-2" /><button type="button" onClick={() => setSlots((current) => current.filter((_, slotIndex) => slotIndex !== index))} className="rounded-lg border border-red-200 px-3 py-2 text-red-700">Törlés</button></div>)}</div>
    <button type="button" onClick={() => setSlots((current) => [...current, { day: "Hétfő", from: "08:00", to: "16:00" }])} className="mt-3 rounded-lg border border-amber-400 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">+ Idősáv hozzáadása</button>
  </div>;
}
