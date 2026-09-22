alter table public.instructors
  add column if not exists availability jsonb not null default '[]'::jsonb;
