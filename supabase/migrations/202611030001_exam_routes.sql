-- Adminból szerkeszthető, közösen használt nyíregyházi vizsgaútvonalak.
create table if not exists public.exam_routes (
  id text primary key check (char_length(id) between 2 and 40),
  name text not null check (char_length(name) between 2 and 120),
  streets text not null default '' check (char_length(streets) <= 2000),
  color text not null default '#eab533' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  path jsonb not null check (jsonb_typeof(path) = 'array' and jsonb_array_length(path) between 2 and 10),
  stops jsonb not null default '[]'::jsonb check (jsonb_typeof(stops) = 'array' and jsonb_array_length(stops) <= 20),
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists exam_routes_updated on public.exam_routes;
create trigger exam_routes_updated before update on public.exam_routes
  for each row execute procedure public.set_updated_at();

alter table public.exam_routes enable row level security;
drop policy if exists "published exam routes are public" on public.exam_routes;
create policy "published exam routes are public" on public.exam_routes
  for select to anon, authenticated using (is_published or public.is_admin());
drop policy if exists "admins manage exam routes" on public.exam_routes;
create policy "admins manage exam routes" on public.exam_routes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
grant select on public.exam_routes to anon, authenticated;
grant insert, update, delete on public.exam_routes to authenticated;

insert into public.exam_routes (id, name, streets, color, path, stops, is_published, sort_order)
values
('F/SZ/264', 'Stadion–Kórház', 'Törzs u. 108. → Pazonyi út → Stadion u. → Kórház u. → Sarkantyú u. → Vay Ádám krt.', '#eab533',
 '[[47.9536,21.7508],[47.9605,21.739],[47.9688,21.7205],[47.9628,21.7138],[47.953,21.7175],[47.951,21.729]]'::jsonb,
 '[{"name":"Pazonyi út","coord":[47.9605,21.739],"note":"Sávválasztás előtt időben ellenőrizd a tükröket, és határozottan jelezd az irányváltást."},{"name":"Stadion utca","coord":[47.9688,21.7205],"note":"Figyeld a gyalogosokat, a kerékpárosokat és a kapubejárókból érkező járműveket."},{"name":"Vay Ádám körút","coord":[47.953,21.7175],"note":"A nagyobb forgalomban tarts megfelelő követési távolságot, és időben készülj fel a besorolásra."}]'::jsonb, false, 1),
('F/SZ/260', 'Kálvin tér–Belváros', 'Törzs u. 108. → Kórház u. → Arany János u. → Kálvin tér → Szent István u. → Hunyadi u.', '#4f6fa9',
 '[[47.9536,21.7508],[47.959,21.724],[47.9534,21.7143],[47.9522,21.7107],[47.9475,21.7195],[47.956,21.728]]'::jsonb,
 '[{"name":"Kálvin tér","coord":[47.9522,21.7107],"note":"Már a csomópont előtt olvasd le a táblákat, válassz megfelelő sávot, és számíts gyalogosokra."},{"name":"Szent István utca","coord":[47.9475,21.7195],"note":"Parkoló autók mellett hagyj oldaltávolságot, és keresd a takarásból kilépő gyalogosokat."},{"name":"Hunyadi utca","coord":[47.956,21.728],"note":"Ne csak az előtted haladót figyeld: folyamatosan ellenőrizd a jelzőlámpát és a környező forgalmat."}]'::jsonb, false, 2),
('F/SZ/266', 'Északi körút', 'Törzs u. 108. → Északi krt. → Rákóczi u. → Árok u. → Új u. → Szent István u.', '#2f8a72',
 '[[47.9536,21.7508],[47.9707,21.725],[47.9608,21.7105],[47.9545,21.7045],[47.948,21.716],[47.9536,21.7508]]'::jsonb,
 '[{"name":"Északi körút","coord":[47.9707,21.725],"note":"Nagyobb sebességnél előrelátóan válassz sávot, és kerüld a hirtelen kormánymozdulatokat."},{"name":"Rákóczi utca","coord":[47.9608,21.7105],"note":"A sűrű forgalomban különösen fontos a tükrök rendszeres használata és a holttér ellenőrzése."},{"name":"Árok utca","coord":[47.9545,21.7045],"note":"Szűkebb környezetben csökkents sebességet, és figyeld az elsőbbséget szabályozó jelzéseket."}]'::jsonb, false, 3)
on conflict (id) do nothing;

comment on table public.exam_routes is 'Adminisztrátori felületről szerkeszthető vizsgaútvonalak és koordináta-útvonalpontok.';
comment on column public.exam_routes.path is 'Sorba rendezett [szélesség, hosszúság] koordináták; Google Maps Directions ezek között utcahálózaton útvonalat tervez.';
