-- Mobilalkalmazás: tanulói/oktatói szerepkör és közös digitális vezetési karton.
-- A profilokat kizárólag a szerver service-role kulcsával (admin felületről) hozzuk létre.

create table if not exists public.mobile_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('instructor', 'student')),
  display_name text not null,
  student_contract_id uuid unique references public.training_contracts(id) on delete restrict,
  student_category text check (student_category is null or student_category in ('B', 'AM', 'A1', 'A2', 'A')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check ((role = 'student' and student_contract_id is not null) or (role = 'instructor' and student_contract_id is null))
);

create table if not exists public.mobile_instructor_students (
  instructor_user_id uuid not null references public.mobile_profiles(user_id) on delete cascade,
  student_user_id uuid not null references public.mobile_profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (instructor_user_id, student_user_id),
  check (instructor_user_id <> student_user_id)
);

create index if not exists mobile_assignments_student_idx
  on public.mobile_instructor_students (student_user_id, instructor_user_id);

create table if not exists public.driving_lessons (
  id uuid primary key default gen_random_uuid(),
  student_user_id uuid not null references public.mobile_profiles(user_id) on delete restrict,
  instructor_user_id uuid not null references public.mobile_profiles(user_id) on delete restrict,
  lesson_type text not null check (lesson_type in ('Alapoktatás', 'Országúti vezetés', 'Városi vezetés', 'Éjszakai vezetés')),
  lesson_hours smallint not null check (lesson_hours between 1 and 8),
  start_odometer integer not null check (start_odometer >= 0),
  end_odometer integer not null check (end_odometer >= start_odometer),
  started_at timestamptz not null,
  ended_at timestamptz not null check (ended_at >= started_at),
  duration_seconds integer not null check (duration_seconds >= 0),
  gps_distance_km numeric(8, 2) not null default 0 check (gps_distance_km >= 0),
  route_points jsonb not null default '[]'::jsonb check (jsonb_typeof(route_points) = 'array'),
  instructor_notes text not null default '' check (char_length(instructor_notes) <= 3000),
  is_simulated boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists driving_lessons_student_date_idx
  on public.driving_lessons (student_user_id, started_at desc);
create index if not exists driving_lessons_instructor_date_idx
  on public.driving_lessons (instructor_user_id, started_at desc);

create or replace function public.mobile_is_instructor()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.mobile_profiles p
    where p.user_id = auth.uid() and p.role = 'instructor' and p.is_active
  );
$$;

create or replace function public.mobile_can_access_student(target_student uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.mobile_instructor_students a
    join public.mobile_profiles instructor on instructor.user_id = a.instructor_user_id
    join public.mobile_profiles student on student.user_id = a.student_user_id
    where a.instructor_user_id = auth.uid()
      and a.student_user_id = target_student
      and instructor.role = 'instructor' and instructor.is_active
      and student.role = 'student' and student.is_active
  );
$$;

alter table public.mobile_profiles enable row level security;
alter table public.mobile_instructor_students enable row level security;
alter table public.driving_lessons enable row level security;

drop policy if exists "mobile users read own or assigned profiles" on public.mobile_profiles;
create policy "mobile users read own or assigned profiles" on public.mobile_profiles
  for select to authenticated
  using (user_id = auth.uid() or (role = 'student' and public.mobile_can_access_student(user_id)));

drop policy if exists "admins read mobile profiles" on public.mobile_profiles;
create policy "admins read mobile profiles" on public.mobile_profiles
  for select to authenticated using (public.is_admin());

drop policy if exists "instructors read their assignments" on public.mobile_instructor_students;
create policy "instructors read their assignments" on public.mobile_instructor_students
  for select to authenticated
  using (instructor_user_id = auth.uid() and public.mobile_is_instructor());

drop policy if exists "admins read mobile assignments" on public.mobile_instructor_students;
create policy "admins read mobile assignments" on public.mobile_instructor_students
  for select to authenticated using (public.is_admin());

drop policy if exists "students and assigned instructors read driving lessons" on public.driving_lessons;
create policy "students and assigned instructors read driving lessons" on public.driving_lessons
  for select to authenticated
  using (
    public.mobile_can_access_student(student_user_id)
    or (
      student_user_id = auth.uid()
      and exists (
        select 1 from public.mobile_profiles student
        where student.user_id = auth.uid() and student.role = 'student' and student.is_active
      )
    )
  );

drop policy if exists "assigned instructors add driving lessons" on public.driving_lessons;
create policy "assigned instructors add driving lessons" on public.driving_lessons
  for insert to authenticated
  with check (
    instructor_user_id = auth.uid()
    and public.mobile_is_instructor()
    and public.mobile_can_access_student(student_user_id)
  );

drop policy if exists "assigned instructors update driving lessons" on public.driving_lessons;
create policy "assigned instructors update driving lessons" on public.driving_lessons
  for update to authenticated
  using (instructor_user_id = auth.uid() and public.mobile_can_access_student(student_user_id))
  with check (instructor_user_id = auth.uid() and public.mobile_can_access_student(student_user_id));

grant select on public.mobile_profiles, public.mobile_instructor_students, public.driving_lessons to authenticated;
grant insert, update on public.driving_lessons to authenticated;
grant execute on function public.mobile_is_instructor() to authenticated;
grant execute on function public.mobile_can_access_student(uuid) to authenticated;
revoke all on function public.mobile_is_instructor() from public, anon;
revoke all on function public.mobile_can_access_student(uuid) from public, anon;

comment on table public.driving_lessons is 'Digitális vezetési karton: csak az érintett tanuló és a hozzá rendelt oktató férhet hozzá.';
comment on column public.driving_lessons.route_points is 'Rögzített GPS-pontok tömbje; a tanuló csak a saját óráihoz tartozó útvonalakat olvashatja.';
