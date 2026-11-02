-- Nyilvános telefonszámok az oktatói profilokon és a fő kapcsolatnál.
alter table public.instructors
  add column if not exists phone text not null default '';

update public.instructors
set phone = '+36/20-313-7137'
where name ilike 'Török Tibor%';

update public.instructors
set phone = '+36/30-235-2597'
where name ilike 'Kicska Gábor%';

update public.site_settings
set phone = '+36/20-313-7137';

comment on column public.instructors.phone is 'Az oktató nyilvános, kattintással hívható telefonszáma.';
