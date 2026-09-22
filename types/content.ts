export type ContentStatus = "published" | "draft";

export interface HeroContent {
  id: string;
  badge: string;
  title: string;
  accent_title: string;
  description: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  background_image: string;
  car_image: string;
  countdown_label: string;
  countdown_target: string | null;
  giveaway_steps: string[];
  giveaway_prize: string;
  promotion_text?: string | null;
}

export interface Course {
  id: string;
  title: string;
  price: string;
  icon: string;
  features: string[];
  minimum_age?: string | null;
  price_details?: PriceDetail[];
  exam_fee?: string | null;
  sort_order: number;
  status: ContentStatus;
}

export interface PriceDetail {
  label: string;
  value: string;
}

export interface Instructor {
  id: string | number;
  name: string;
  category: string;
  experience: string;
  description: string;
  image: string | null;
  availability?: WeeklyAvailability[];
  sort_order: number;
  status: ContentStatus;
}

export interface WeeklyAvailability {
  day: string;
  from: string;
  to: string;
}

export interface Car {
  id: string;
  instructor: string;
  name: string;
  transmission: string;
  climate: string;
  image: string;
  gallery_images?: string[];
  sort_order: number;
  status: ContentStatus;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  source: string;
  sort_order: number;
  status: ContentStatus;
}

export interface Stat {
  number: number;
  suffix: string;
  title: string;
  decimals?: number;
}

export interface Feature {
  title: string;
  text: string;
  icon: string;
}

export interface SiteSettings {
  id: string;
  school_name: string;
  phone: string;
  email: string;
  address: string;
  google_rating: string;
  stats: Stat[];
  features: Feature[];
}

export const LOCAL_IMAGE_OPTIONS = [
  "/images/logoo.png",
  "/images/hero-bg.png",
  "/images/nyiregyhaza-hosok-tere.png",
  "/images/fiesta-premium.png",
  "/images/fiesta-hero.png",
  "/images/fiesta-hero-corrected.png",
  "/images/nyeremenyauto.png",
  "/images/fiesta.jpg",
  "/images/torok_tibor.jpg",
  "/images/torok_tibor_auto.jpg",
  "/images/torok_tibor_oktatas.jpg",
  "/images/Kicska_Gabor_auto.jpg",
] as const;
