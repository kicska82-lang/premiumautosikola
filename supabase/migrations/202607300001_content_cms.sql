-- Existing production tables are preserved. This migration extends `hero` and
-- `instructors`, and creates only the CMS tables that do not already exist.
create extension if not exists "pgcrypto";

do $$ begin
  create type public.content_status as enum ('draft', 'published');
exception when duplicate_object then null;
end;
$$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- The project already has a hero table. The old columns remain available.
alter table public.hero add column if not exists badge text not null default '';
alter table public.hero add column if not exists title text not null default 'PRÉMIUM';
alter table public.hero add column if not exists accent_title text not null default 'AUTÓSISKOLA';
alter table public.hero add column if not exists description text not null default '';
alter table public.hero add column if not exists primary_button_text text not null default 'Jelentkezem →';
alter table public.hero add column if not exists primary_button_link text not null default '#kapcsolat';
alter table public.hero add column if not exists secondary_button_text text not null default 'Képzések →';
alter table public.hero add column if not exists secondary_button_link text not null default '#kepzesek';
alter table public.hero add column if not exists background_image text not null default '/images/hero-bg.png';
alter table public.hero add column if not exists car_image text not null default '/images/fiesta-premium.png';
alter table public.hero add column if not exists countdown_label text not null default 'NYEREMÉNYJÁTÉKBÓL HÁTRALÉVŐ IDŐ';
alter table public.hero add column if not exists countdown_target timestamptz;
alter table public.hero add column if not exists giveaway_steps jsonb not null default '[]'::jsonb;
alter table public.hero add column if not exists giveaway_prize text not null default '';
alter table public.hero add column if not exists is_active boolean not null default true;
alter table public.hero add column if not exists created_at timestamptz not null default now();
alter table public.hero add column if not exists updated_at timestamptz not null default now();

-- Existing instructors keep their ids, names, cars and active/order_number values.
alter table public.instructors add column if not exists experience text not null default '';
alter table public.instructors add column if not exists sort_order integer not null default 0;
alter table public.instructors add column if not exists status public.content_status not null default 'published';
alter table public.instructors add column if not exists created_at timestamptz not null default now();
alter table public.instructors add column if not exists updated_at timestamptz not null default now();
update public.instructors set sort_order = coalesce(order_number, 0) where sort_order = 0 and order_number is not null;
update public.instructors set status = case when active then 'published'::public.content_status else 'draft'::public.content_status end where active is not null;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(), title text not null, price text not null,
  icon text not null default '🚗', features jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0, status public.content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(), instructor text not null, name text not null,
  transmission text not null default 'Manuális váltó', climate text not null default 'Klímás',
  image text not null check (image like '/images/%'), sort_order integer not null default 0,
  status public.content_status not null default 'draft', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(), name text not null, text text not null,
  rating smallint not null default 5 check (rating between 1 and 5), source text not null default 'Google értékelés',
  sort_order integer not null default 0, status public.content_status not null default 'draft',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(), school_name text not null,
  phone text not null default '', email text not null default '', address text not null default '',
  google_rating text not null default '4.9 / 5 Google értékelés', stats jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
drop trigger if exists hero_updated on public.hero; create trigger hero_updated before update on public.hero for each row execute procedure public.set_updated_at();
drop trigger if exists instructors_updated on public.instructors; create trigger instructors_updated before update on public.instructors for each row execute procedure public.set_updated_at();
drop trigger if exists courses_updated on public.courses; create trigger courses_updated before update on public.courses for each row execute procedure public.set_updated_at();
drop trigger if exists cars_updated on public.cars; create trigger cars_updated before update on public.cars for each row execute procedure public.set_updated_at();
drop trigger if exists testimonials_updated on public.testimonials; create trigger testimonials_updated before update on public.testimonials for each row execute procedure public.set_updated_at();
drop trigger if exists settings_updated on public.site_settings; create trigger settings_updated before update on public.site_settings for each row execute procedure public.set_updated_at();

alter table public.hero enable row level security; alter table public.courses enable row level security; alter table public.instructors enable row level security; alter table public.cars enable row level security; alter table public.testimonials enable row level security; alter table public.site_settings enable row level security; alter table public.admin_users enable row level security;
create policy "published hero is public" on public.hero for select using (is_active or public.is_admin());
create policy "published courses are public" on public.courses for select using (status = 'published' or public.is_admin());
create policy "published instructors are public" on public.instructors for select using (status = 'published' or public.is_admin());
create policy "published cars are public" on public.cars for select using (status = 'published' or public.is_admin());
create policy "published testimonials are public" on public.testimonials for select using (status = 'published' or public.is_admin());
create policy "settings are public" on public.site_settings for select using (true);
create policy "admins can read admin list" on public.admin_users for select using (public.is_admin());
create policy "admins manage hero" on public.hero for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage courses" on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage instructors" on public.instructors for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage cars" on public.cars for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into public.hero (badge, title, accent_title, description, primary_button_text, secondary_button_text, background_image, car_image, countdown_label, countdown_target, giveaway_steps, giveaway_prize)
select 'Nyíregyháza', E'VEZESS\nA SIKERHEZ,', 'NYERD MEG!', E'Iratkozz be a Prémium Autósiskolába,\nszerezz sikeres forgalmi vizsgát,\nés automatikusan részt veszel\na nyereményautó sorsolásán.', 'JELENTKEZEM  →', 'ÁRAINK  →', '/images/hero-bg.png', '/images/fiesta-hero-corrected.png', 'NYEREMÉNYJÁTÉKBÓL HÁTRALÉVŐ IDŐ', '2026-12-31 23:59:59+01', '["Beiratkozol", "Levizsgázol", "Részt veszel a sorsoláson"]', '' where not exists (select 1 from public.hero);
insert into public.site_settings (school_name, stats, features)
select 'Prémium Autósiskola', '[{"number":2500,"suffix":"+","title":"Sikeres vizsga"},{"number":15,"suffix":"+","title":"Év tapasztalat"},{"number":98,"suffix":"%","title":"Elsőre sikeres vizsgák"},{"number":4.9,"suffix":"★","title":"Google értékelés","decimals":1}]', '[{"title":"Modern oktatóautók","text":"Korszerű, biztonságos és kényelmes járművek a magabiztos vezetéshez.","icon":"🚗"},{"title":"Tapasztalt oktatók","text":"Türelmes, segítőkész és vizsgaközpontú oktatás minden tanulónknak.","icon":"👨‍🏫"},{"title":"Rugalmas időpontok","text":"Az órákat a tanulók időbeosztásához igazítjuk.","icon":"📅"},{"title":"Magas sikeres vizsgaarány","text":"Tanulóink nagy része első alkalommal sikeres vizsgát tesz.","icon":"🏆"},{"title":"Online ügyintézés","text":"Gyors jelentkezés és egyszerű kapcsolattartás online.","icon":"💻"},{"title":"Részletfizetés","text":"Kedvező fizetési lehetőségek a képzés teljes ideje alatt.","icon":"💳"}]' where not exists (select 1 from public.site_settings);
insert into public.courses (title, price, icon, features, sort_order, status) values
('B kategória', '390 000 Ft', '🚗', '["Online KRESZ tanfolyam", "30 óra gyakorlati vezetés", "Vizsgafelkészítés"]', 1, 'published'), ('A kategória', '420 000 Ft', '🏍️', '["Motoros KRESZ", "Rutin és forgalmi oktatás", "Védőfelszerelés tanácsadás"]', 2, 'published'), ('AM kategória', '180 000 Ft', '🛵', '["Segédmotor képzés", "Rugalmas időpontok", "Gyors vizsgafelkészítés"]', 3, 'published'), ('Utánképzés', 'Egyedi ajánlat', '🎓', '["Vizsga előtti gyakorlás", "Magabiztos vezetés", "Tapasztalt oktatók"]', 4, 'published');
insert into public.cars (instructor, name, image, sort_order, status) values ('Török Tibor', 'Ford Fiesta', '/images/fiesta.jpg', 1, 'published'), ('Kicska Gábor', 'Oktatóautó', '/images/Kicska_Gabor_auto.jpg', 2, 'published');
insert into public.testimonials (name, text, rating, source, sort_order, status) values ('Kovács Péter', 'Elsőre sikerült a forgalmi vizsgám. Az oktatóm végig türelmes és segítőkész volt.', 5, 'Google értékelés', 1, 'published'), ('Nagy Anna', 'Modern autók, jó hangulat és profi oktatás. Csak ajánlani tudom.', 5, 'Google értékelés', 2, 'published'), ('Szabó Zoltán', 'Nagyon korrekt autósiskola. Minden kérdésemre gyors választ kaptam.', 5, 'Google értékelés', 3, 'published');
