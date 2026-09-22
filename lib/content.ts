import "server-only";

import { createPublicClient } from "@/lib/supabase/public";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type {
  Car,
  Course,
  HeroContent,
  Instructor,
  SiteSettings,
  Testimonial,
} from "@/types/content";

const PUBLIC_CONTENT_TIMEOUT_MS = 4_000;

// Csak akkor használjuk, ha a CMS átmenetileg nem elérhető. A Supabase-ben
// rögzített adatok mindig elsőbbséget élveznek, ezért ez nem helyettesíti az
// admin felületet, hanem a nyilvános oldal elérhetőségét védi.
const offlineHero: HeroContent = {
  id: "offline-hero",
  badge: "Nyíregyháza",
  title: "VEZESS A SIKERHEZ,",
  accent_title: "A PRÉMIUM AUTÓSISKOLÁVAL!",
  description: "Iratkozz be a Prémium Autósiskolába rejtett költségek nélkül!\nA célunk nem csupán a sikeres vizsga, hanem hogy magabiztos, biztonságos és önálló sofőrré válj.",
  primary_button_text: "JELENTKEZEM →",
  primary_button_link: "/jelentkezes",
  secondary_button_text: "KÉPZÉSEINK",
  secondary_button_link: "/#kepzesek",
  background_image: "/images/nyiregyhaza-hosok-tere.png",
  car_image: "",
  countdown_label: "",
  countdown_target: null,
  giveaway_steps: [],
  giveaway_prize: "",
};

const offlineSettings: SiteSettings = {
  id: "offline-settings",
  school_name: "Prémium Autósiskola",
  phone: "+36-30-235-2597",
  email: "info@premiumautosiskola.hu",
  address: "4400 Nyíregyháza, Széchenyi utca 18.",
  google_rating: "4.9",
  stats: [
    { number: 2500, suffix: "+", title: "Sikeres vizsga" },
    { number: 15, suffix: "+", title: "Év tapasztalat" },
    { number: 98, suffix: "%", title: "Elsőre sikeres vizsgák" },
    { number: 4.9, suffix: "★", title: "Google értékelés", decimals: 1 },
  ],
  features: [
    { title: "Modern oktatóautók", text: "Korszerű, biztonságos és kényelmes járművek a magabiztos vezetéshez.", icon: "🚗" },
    { title: "Tapasztalt oktatók", text: "Türelmes, segítőkész és vizsgaközpontú oktatás minden tanulónknak.", icon: "👨‍🏫" },
    { title: "Rugalmas időpontok", text: "Az órákat a tanulók időbeosztásához igazítjuk.", icon: "📅" },
  ],
};

const offlineCourses: Course[] = [
  {
    id: "offline-b",
    title: "B kategória",
    price: "310 000 Ft",
    icon: "🚗",
    features: ["Online KRESZ tanfolyam", "30 óra gyakorlati vezetés", "Vizsgafelkészítés"],
    minimum_age: "16,5 év",
    exam_fee: "17 300 Ft",
    price_details: [{ label: "Elmélet", value: "40 000 Ft" }, { label: "Járműkezelési órák", value: "9 × 9 000 Ft" }, { label: "Forgalmi órák + vizsgaóra", value: "21 × 9 000 Ft" }, { label: "Pótóra", value: "9 000 Ft" }],
    sort_order: 1,
    status: "published",
  },
  {
    id: "offline-b-gyors",
    title: "B gyors",
    price: "370 000 Ft",
    icon: "🚗",
    features: ["Online KRESZ tanfolyam", "Intenzív, rugalmas vezetési időpontok", "30 kötelező gyakorlati óra"],
    minimum_age: "16,5 év",
    exam_fee: "17 300 Ft",
    price_details: [{ label: "Elmélet", value: "40 000 Ft" }, { label: "Járműkezelési órák", value: "9 × 11 000 Ft" }, { label: "Forgalmi órák + vizsgaóra", value: "21 × 11 000 Ft" }, { label: "Pótóra", value: "11 000 Ft" }],
    sort_order: 2,
    status: "published",
  },
];

/**
 * A nyilvános oldalnak akkor is elérhetőnek kell maradnia, amikor a Supabase
 * Free projekt felébresztése vagy hálózati hiba miatt egy kérés beragad.
 */
async function withPublicTimeout<T>(promise: PromiseLike<T>, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(fallback), PUBLIC_CONTENT_TIMEOUT_MS);

    Promise.resolve(promise)
      .then((result) => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(fallback);
      });
  });
}

type PublicQueryResult<T> = {
  data: T | null;
  error: { message: string } | null;
};

function withPublicQueryTimeout<T>(
  query: PromiseLike<PublicQueryResult<T>>
): Promise<PublicQueryResult<T>> {
  return withPublicTimeout(query, { data: null, error: null });
}

async function listPublished<T>(table: string): Promise<T[]> {
  const supabase = createPublicClient();
  const { data, error } = await withPublicQueryTimeout(
    supabase.from(table).select("*").eq("status", "published").order("sort_order")
  );

  if (error) {
    console.error(`Unable to load ${table}:`, error.message);
    return [];
  }

  return (data ?? []) as T[];
}

export async function getPublicContent() {
  const supabase = createPublicClient();
  const [heroResult, settingsResult, courses, instructors, cars, testimonials] =
    await Promise.all([
      withPublicQueryTimeout(
        supabase.from("hero").select("*").eq("is_active", true).limit(1).maybeSingle()
      ),
      withPublicQueryTimeout(
        supabase.from("site_settings").select("*").limit(1).maybeSingle()
      ),
      listPublished<Course>("courses"),
      listPublished<Instructor>("instructors"),
      listPublished<Car>("cars"),
      listPublished<Testimonial>("testimonials"),
    ]);

  if (heroResult.error) console.warn("Unable to load hero:", heroResult.error.message);
  if (settingsResult.error) console.warn("Unable to load settings:", settingsResult.error.message);

  return {
    hero: (heroResult.data as HeroContent | null) ?? offlineHero,
    settings: (settingsResult.data as SiteSettings | null) ?? offlineSettings,
    courses: courses.length > 0 ? courses : offlineCourses,
    instructors,
    cars,
    testimonials,
  };
}

export async function getAdminRecords<T>(table: string): Promise<T[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from(table).select("*").order("sort_order");

  if (error) {
    console.error(`Unable to load ${table}:`, error.message);
    return [];
  }

  return data as T[];
}

export async function getAdminSingleton<T>(table: string): Promise<T | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from(table).select("*").limit(1).maybeSingle();

  if (error) {
    console.error(`Unable to load ${table}:`, error.message);
    return null;
  }

  return data as T | null;
}
