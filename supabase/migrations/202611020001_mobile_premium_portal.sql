-- Prémium tanulói/oktatói portál: felhasználónevek, előfizetési jogosultság,
-- tesztfiókok és óránkénti oktatói magyarázat/házi feladat.

alter table public.mobile_profiles add column if not exists username text;
alter table public.mobile_profiles add column if not exists premium_active boolean not null default false;
alter table public.mobile_profiles add column if not exists is_test_account boolean not null default false;
alter table public.mobile_profiles add column if not exists source_instructor_key text;
create unique index if not exists mobile_profiles_source_instructor_key_idx
  on public.mobile_profiles (source_instructor_key) where source_instructor_key is not null;

-- Korábban létrehozott próba-profilokhoz adjunk determinisztikus, egyedi
-- felhasználónevet; az új fiókok saját felhasználónevüket kapják az adminból.
update public.mobile_profiles
set username = 'felhasznalo_' || substr(user_id::text, 1, 12)
where username is null or btrim(username) = '';

alter table public.mobile_profiles alter column username set not null;
create unique index if not exists mobile_profiles_username_lower_idx
  on public.mobile_profiles (lower(username));

alter table public.mobile_profiles drop constraint if exists mobile_profiles_check;
alter table public.mobile_profiles drop constraint if exists mobile_profiles_contract_check;
alter table public.mobile_profiles add constraint mobile_profiles_contract_check check (
  (role = 'student' and (
    (student_contract_id is not null and not is_test_account)
    or (student_contract_id is null and is_test_account)
  ))
  or (role = 'instructor' and student_contract_id is null and not is_test_account)
);

alter table public.driving_lessons
  add column if not exists homework text not null default '' check (char_length(homework) <= 3000);

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
      and student.role = 'student' and student.is_active and student.premium_active
  );
$$;

drop policy if exists "instructors read their assignments" on public.mobile_instructor_students;
drop policy if exists "instructors read premium student assignments" on public.mobile_instructor_students;
create policy "instructors read premium student assignments" on public.mobile_instructor_students
  for select to authenticated
  using (instructor_user_id = auth.uid() and public.mobile_is_instructor() and public.mobile_can_access_student(student_user_id));

drop policy if exists "students and assigned instructors read driving lessons" on public.driving_lessons;
drop policy if exists "premium students and assigned instructors read driving lessons" on public.driving_lessons;
create policy "premium students and assigned instructors read driving lessons" on public.driving_lessons
  for select to authenticated
  using (
    public.mobile_can_access_student(student_user_id)
    or (
      student_user_id = auth.uid()
      and exists (
        select 1 from public.mobile_profiles student
        where student.user_id = auth.uid() and student.role = 'student' and student.is_active and student.premium_active
      )
    )
  );

revoke all on function public.mobile_can_access_student(uuid) from public, anon;
grant execute on function public.mobile_can_access_student(uuid) to authenticated;

comment on column public.mobile_profiles.username is 'Egyedi, kisbetűs mobilalkalmazás-belépési név; Auth e-mail-alias tartozik hozzá.';
comment on column public.mobile_profiles.premium_active is 'Adminisztrátor vagy fizetési webhook által aktivált digitális karton/oktatói portál jogosultság.';
comment on column public.mobile_profiles.is_test_account is 'Képzési szerződés nélküli, kizárólag próba célra létrehozott tanulói fiók.';
comment on column public.driving_lessons.homework is 'Az adott vezetési órához rendelt, tanuló által megtekinthető házi feladat.';
