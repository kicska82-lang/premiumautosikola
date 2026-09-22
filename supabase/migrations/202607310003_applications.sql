create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete set null,
  course_title text not null,
  committed_price text not null,
  application_data jsonb not null,
  privacy_consent boolean not null default false,
  privacy_consent_at timestamptz,
  status text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.applications enable row level security;

create policy "anyone can submit a consented application" on public.applications
  for insert to anon, authenticated with check (privacy_consent = true);
create policy "admins manage applications" on public.applications
  for all using (public.is_admin()) with check (public.is_admin());
