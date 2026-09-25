"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { LOCAL_IMAGE_OPTIONS } from "@/types/content";

const tableSchema = z.enum(["courses", "instructors", "cars", "testimonials"]);
const imageSchema = z.string().refine((value) => LOCAL_IMAGE_OPTIONS.includes(value as (typeof LOCAL_IMAGE_OPTIONS)[number]), "Érvénytelen helyi kép.");

function parseList(value: unknown) {
  if (typeof value !== "string") return [];
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function parsePriceDetails(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    return z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).parse(JSON.parse(value));
  } catch {
    throw new Error("Az árlista tételei érvényes JSON formátumban legyenek.");
  }
}

function parseGalleryImages(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    return z.array(imageSchema).max(5).parse(JSON.parse(value));
  } catch {
    throw new Error("A galéria érvényes, legfeljebb 5 helyi képet tartalmazó JSON lista legyen.");
  }
}

function parseAvailability(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    return z.array(z.object({
      day: z.string().min(1),
      from: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "A kezdés ÓÓ:PP formátumú legyen."),
      to: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "A befejezés ÓÓ:PP formátumú legyen."),
    })).parse(JSON.parse(value));
  } catch {
    throw new Error("Az oktatási idősávok érvényes JSON formátumban legyenek.");
  }
}

function normalizePayload(table: z.infer<typeof tableSchema>, raw: Record<string, FormDataEntryValue>) {
  const status = raw.status === "published" ? "published" : "draft";
  const sortOrder = Number(raw.sort_order ?? 0);
  const base = { status, sort_order: Number.isFinite(sortOrder) ? sortOrder : 0 };

  if (table === "courses") {
    return z.object({ title: z.string().min(2), price: z.string().min(1), minimum_age: z.string().optional(), exam_fee: z.string().optional(), price_details: z.string().optional(), icon: z.string().min(1), features: z.string(), status: z.string(), sort_order: z.number() }).parse({ ...raw, ...base, features: raw.features ?? "", price_details: raw.price_details ?? "" }) as unknown as Record<string, unknown>;
  }
  if (table === "instructors") {
    const value = z.object({ name: z.string().min(2), category: z.string().min(1), experience: z.string(), description: z.string(), image: imageSchema, availability: z.string().optional(), status: z.string(), sort_order: z.number() }).parse({ ...raw, ...base, availability: raw.availability ?? "" });
    return value as unknown as Record<string, unknown>;
  }
  if (table === "cars") {
    const value = z.object({ instructor: z.string().min(2), name: z.string().min(2), transmission: z.string().min(1), climate: z.string().min(1), image: imageSchema, gallery_images: z.string().optional(), status: z.string(), sort_order: z.number() }).parse({ ...raw, ...base, gallery_images: raw.gallery_images ?? "" });
    return value as unknown as Record<string, unknown>;
  }
  const value = z.object({ name: z.string().min(2), text: z.string().min(2), rating: z.coerce.number().int().min(1).max(5), source: z.string().min(1), status: z.string(), sort_order: z.number() }).parse({ ...raw, ...base });
  return value as unknown as Record<string, unknown>;
}

function databasePayload(table: z.infer<typeof tableSchema>, payload: Record<string, unknown>) {
  if (table === "courses") {
    const priceDetails = parsePriceDetails(payload.price_details);
    return { ...payload, features: parseList(payload.features), price_details: priceDetails, price: String(payload.price) };
  }
  if (table === "cars") return { ...payload, gallery_images: parseGalleryImages(payload.gallery_images) };
  if (table === "instructors") return { ...payload, availability: parseAvailability(payload.availability) };
  return payload;
}

export async function saveRecord(tableValue: string, id: string | number | null, formData: FormData) {
  const table = tableSchema.parse(tableValue);
  const raw = Object.fromEntries(formData.entries());
  const payload = databasePayload(table, normalizePayload(table, raw));
  const { supabase } = await requireAdmin();
  const query = id
    ? supabase.from(table).update(payload).eq("id", id)
    : supabase.from(table).insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/arlista");
  revalidatePath("/jelentkezes");
  revalidatePath(`/admin/${table}`);
}

export async function deleteRecord(tableValue: string, id: string | number) {
  const table = tableSchema.parse(tableValue);
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/admin/${table}`);
}

const heroSchema = z.object({
  id: z.string().uuid(), badge: z.string(), title: z.string().min(1), accent_title: z.string(), description: z.string(),
  primary_button_text: z.string(), primary_button_link: z.string(), secondary_button_text: z.string(), secondary_button_link: z.string(),
  background_image: imageSchema, is_active: z.string().optional(),
});

export async function saveHero(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = heroSchema.parse(raw);
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("hero").update({ ...data, is_active: data.is_active === "true" }).eq("id", data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/admin/hero");
}

const settingsSchema = z.object({ id: z.string().uuid(), school_name: z.string().min(1), phone: z.string(), email: z.string().email().or(z.literal("")), address: z.string(), google_rating: z.string(), stats: z.string(), features: z.string() });

export async function saveSettings(formData: FormData) {
  const data = settingsSchema.parse(Object.fromEntries(formData.entries()));
  const parseJson = (value: string) => JSON.parse(value) as unknown;
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("site_settings").update({ ...data, stats: parseJson(data.stats), features: parseJson(data.features) }).eq("id", data.id);
  if (error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/admin/settings");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
