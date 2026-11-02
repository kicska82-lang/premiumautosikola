create table if not exists public.training_contracts (
  id uuid primary key default gen_random_uuid(),
  contract_number text not null unique,
  contract_year integer generated always as (extract(year from signed_at)::integer) stored,
  signed_at date not null,
  student_name text not null,
  student_birth_name text not null,
  student_birth_place text not null,
  student_birth_date date not null,
  student_mother_name text not null,
  student_address text not null,
  student_phone text not null,
  student_email text not null default '',
  course_category text not null check (course_category in ('B', 'AM', 'A1', 'A2', 'A')),
  guardian_name text not null default '',
  guardian_address text not null default '',
  theory_fee text not null,
  practice_hourly_fee text not null,
  extra_hourly_fee text not null,
  theory_exam_fee text not null,
  practical_exam_fee text not null,
  practice_location text not null,
  document_version integer not null default 1,
  document_snapshot jsonb not null,
  privacy_notice_version text not null default '2026-10-11',
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists training_contracts_year_idx on public.training_contracts (contract_year desc, signed_at desc);
create index if not exists training_contracts_student_name_idx on public.training_contracts using gin (to_tsvector('simple', student_name));

drop trigger if exists training_contracts_updated on public.training_contracts;
create trigger training_contracts_updated before update on public.training_contracts
  for each row execute procedure public.set_updated_at();

alter table public.training_contracts enable row level security;

create policy "admins manage training contracts" on public.training_contracts
  for all using (public.is_admin()) with check (public.is_admin());

comment on table public.training_contracts is 'Járművezető-képzési szerződések és a nyomtatáskori dokumentumpillanatkép.';
comment on column public.training_contracts.document_snapshot is 'A szerződés nyomtatásához használt teljes, változatlan adatpillanatkép.';
