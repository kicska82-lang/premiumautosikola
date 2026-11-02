"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";

const coordinate = z.tuple([
  z.number().min(45).max(49),
  z.number().min(16).max(23),
]);

const routeSchema = z.object({
  id: z.string().trim().min(2).max(40),
  name: z.string().trim().min(2).max(120),
  streets: z.string().max(2000),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  path: z.array(coordinate).min(2).max(10),
  stops: z.array(z.object({
    name: z.string().trim().min(1).max(120),
    coord: coordinate,
    note: z.string().max(1000),
  })).max(20),
  is_published: z.boolean(),
  sort_order: z.number().int().min(0).max(10000),
});

export async function saveExamRoute(input: unknown) {
  const { supabase } = await requireAdmin();
  const route = routeSchema.parse(input);
  const { error } = await supabase.from("exam_routes").upsert({
    ...route,
    path: route.path,
    stops: route.stops,
  }, { onConflict: "id" });

  if (error) throw new Error(`Az útvonal mentése nem sikerült: ${error.message}`);

  revalidatePath("/admin/vizsga-utvonalak");
  revalidatePath("/mobilapp-prototipus");
  return { success: true };
}
