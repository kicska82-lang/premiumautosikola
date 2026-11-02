import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isMobileCloudConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getMobileCloud() {
  if (!isMobileCloudConfigured()) throw new Error("A közös adatbázis nincs beállítva ehhez az alkalmazáshoz.");
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } },
    );
  }
  return client;
}

export type MobileProfile = {
  user_id: string;
  username: string;
  role: "instructor" | "student";
  display_name: string;
  student_category: "B" | "AM" | "A1" | "A2" | "A" | null;
  is_active: boolean;
  premium_active: boolean;
};

export type MobileStudent = Pick<MobileProfile, "user_id" | "username" | "display_name" | "student_category" | "premium_active">;

export type DrivingLessonRow = {
  id: string;
  student_user_id: string;
  instructor_user_id: string;
  lesson_type: string;
  lesson_hours: number;
  start_odometer: number;
  end_odometer: number;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  gps_distance_km: number;
  route_points: unknown;
  instructor_notes: string;
  homework: string;
  is_simulated: boolean;
};

