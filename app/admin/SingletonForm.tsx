"use client";

import { useState, useTransition } from "react";
import { saveHero, saveSettings } from "./actions";
import { LOCAL_IMAGE_OPTIONS } from "@/types/content";

export default function SingletonForm({ kind, values }: { kind: "hero" | "settings"; values: object | null }) {
  const [pending, startTransition] = useTransition(); const [message, setMessage] = useState("");
  if (!values) return <p className="rounded-xl bg-amber-100 p-4">Nincs betöltött beállítás. Előbb futtasd a Supabase migrációt és seed adatokat.</p>;
  const valuesRecord = values as Record<string, unknown>;
  const value = (key: string) => Array.isArray(valuesRecord[key]) || typeof valuesRecord[key] === "object" ? JSON.stringify(valuesRecord[key], null, 2) : String(valuesRecord[key] ?? "");
  const action = kind === "hero" ? saveHero : saveSettings;
  const fields = kind === "hero" ? ["badge", "title", "accent_title", "description", "primary_button_text", "primary_button_link", "secondary_button_text", "secondary_button_link"] : ["school_name", "phone", "email", "address", "google_rating", "stats", "features"];
  const labels: Record<string, string> = { badge: "Címke", title: "Főcím (sortörés megengedett)", accent_title: "Arany kiemelt cím", description: "Leírás", promotion_text: "Sárga, félkövér promóciós kiemelés", primary_button_text: "Első gomb felirata", primary_button_link: "Első gomb linkje", secondary_button_text: "Második gomb felirata", secondary_button_link: "Második gomb linkje", countdown_label: "Visszaszámlálás felirata", countdown_target: "Visszaszámlálás vége (ISO dátum)", giveaway_steps: "Sorsolás lépései (soronként)", giveaway_prize: "Fődíj", school_name: "Iskolanév", phone: "Telefonszám", email: "E-mail", address: "Cím", google_rating: "Google értékelés", stats: "Statisztikák (JSON)", features: "Előnyök (JSON)" };
  return <form action={(data) => startTransition(async () => { try { await action(data); setMessage("A módosítás mentve."); } catch (error) { setMessage(error instanceof Error ? error.message : "Sikertelen mentés."); } })} className="grid gap-4 rounded-2xl bg-white p-6 shadow">
    {message && <p aria-live="polite" className="rounded-lg bg-slate-200 p-3 text-sm">{message}</p>}<input type="hidden" name="id" value={value("id")} />
    {fields.map((field) => <label key={field} className="grid gap-1 text-sm font-medium">{labels[field]}<textarea name={field} required={field !== "phone" && field !== "email" && field !== "address"} rows={field === "description" || field === "stats" || field === "features" || field === "giveaway_steps" ? 5 : 2} defaultValue={value(field)} className="rounded-lg border p-3" /></label>)}
    {kind === "hero" && <><label className="grid gap-1 text-sm font-medium">Háttérkép<select name="background_image" defaultValue={value("background_image")} className="rounded-lg border p-3">{LOCAL_IMAGE_OPTIONS.map((image) => <option key={image}>{image}</option>)}</select></label><label className="flex gap-2 text-sm"><input type="checkbox" name="is_active" value="true" defaultChecked={Boolean(valuesRecord.is_active)} /> Aktív Hero</label></>}
    <button disabled={pending} className="rounded-xl bg-amber-500 px-5 py-3 font-semibold text-black">{pending ? "Mentés..." : "Mentés"}</button>
  </form>;
}
