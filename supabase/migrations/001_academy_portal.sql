-- =====================================================================
-- Tattva Academy — student / teacher portal (run once in Supabase SQL editor)
-- Safe to re-run: every statement is idempotent.
--
-- Tables used by the portal:
--   profiles, courses, enrollments, lectures, lecture_visits   (core)
--   students                                                   (mirrored at signup)
--   reviews, trial_registrations                               (teacher moderation)
-- =====================================================================

begin;

-- ---------------------------------------------------------------------
-- 1. Role helpers (SECURITY DEFINER so policies never recurse into profiles)
-- ---------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('teacher', 'admin') from public.profiles where id = auth.uid()),
    false
  )
$$;

grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_teacher() to authenticated;

-- ---------------------------------------------------------------------
-- 2. Create profile (+ students mirror) automatically at signup.
--    Wrapped in exception blocks so a problem here can NEVER block signups.
-- ---------------------------------------------------------------------
create or replace function public.tattva_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_name text := coalesce(nullif(meta->>'full_name', ''), split_part(new.email, '@', 1));
begin
  begin
    insert into public.profiles (id, full_name, phone, grade, country, role)
    values (
      new.id,
      v_name,
      nullif(meta->>'phone', ''),
      nullif(meta->>'grade', ''),
      nullif(meta->>'country', ''),
      'student'
    )
    on conflict (id) do nothing;
  exception when others then
    raise warning 'tattva_handle_new_user (profiles): %', sqlerrm;
  end;

  begin
    insert into public.students (id, auth_uid, full_name, email, phone, grade, country)
    values (
      gen_random_uuid(),
      new.id,
      v_name,
      new.email,
      coalesce(nullif(meta->>'phone', ''), ''),
      nullif(meta->>'grade', ''),
      nullif(meta->>'country', '')
    )
    on conflict do nothing;
  exception when others then
    raise warning 'tattva_handle_new_user (students): %', sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists tattva_on_auth_user_created on auth.users;
create trigger tattva_on_auth_user_created
  after insert on auth.users
  for each row execute function public.tattva_handle_new_user();

-- Backfill profiles for accounts that registered before this trigger existed
insert into public.profiles (id, full_name, phone, grade, country, role)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data->>'full_name', ''), split_part(u.email, '@', 1)),
  nullif(u.raw_user_meta_data->>'phone', ''),
  nullif(u.raw_user_meta_data->>'grade', ''),
  nullif(u.raw_user_meta_data->>'country', ''),
  'student'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ---------------------------------------------------------------------
-- 3. Row level security
-- ---------------------------------------------------------------------
alter table public.profiles       enable row level security;
alter table public.courses        enable row level security;
alter table public.enrollments    enable row level security;
alter table public.lectures       enable row level security;
alter table public.lecture_visits enable row level security;

-- profiles ------------------------------------------------------------
drop policy if exists "tattva profiles read own or teacher" on public.profiles;
create policy "tattva profiles read own or teacher" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_teacher());

drop policy if exists "tattva profiles insert own" on public.profiles;
create policy "tattva profiles insert own" on public.profiles
  for insert to authenticated
  with check (id = auth.uid() and coalesce(role, 'student') = 'student');

drop policy if exists "tattva profiles update own" on public.profiles;
create policy "tattva profiles update own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid() and role is not distinct from public.current_user_role());

drop policy if exists "tattva profiles teacher update" on public.profiles;
create policy "tattva profiles teacher update" on public.profiles
  for update to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- courses (public catalogue, teacher-managed) -------------------------
drop policy if exists "tattva courses public read" on public.courses;
create policy "tattva courses public read" on public.courses
  for select to anon, authenticated
  using (true);

drop policy if exists "tattva courses teacher write" on public.courses;
create policy "tattva courses teacher write" on public.courses
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- enrollments ---------------------------------------------------------
drop policy if exists "tattva enrollments read own or teacher" on public.enrollments;
create policy "tattva enrollments read own or teacher" on public.enrollments
  for select to authenticated
  using (profile_id = auth.uid() or public.is_teacher());

drop policy if exists "tattva enrollments student request" on public.enrollments;
create policy "tattva enrollments student request" on public.enrollments
  for insert to authenticated
  with check (
    profile_id = auth.uid()
    and coalesce(status, 'pending') = 'pending'
    and coalesce(fee_status, 'unpaid') = 'unpaid'
  );

drop policy if exists "tattva enrollments teacher write" on public.enrollments;
create policy "tattva enrollments teacher write" on public.enrollments
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- lectures ------------------------------------------------------------
drop policy if exists "tattva lectures read own or teacher" on public.lectures;
create policy "tattva lectures read own or teacher" on public.lectures
  for select to authenticated
  using (
    public.is_teacher()
    or exists (
      select 1 from public.enrollments e
      where e.id = lectures.enrollment_id and e.profile_id = auth.uid()
    )
  );

drop policy if exists "tattva lectures teacher write" on public.lectures;
create policy "tattva lectures teacher write" on public.lectures
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- lecture_visits ------------------------------------------------------
drop policy if exists "tattva visits read own or teacher" on public.lecture_visits;
create policy "tattva visits read own or teacher" on public.lecture_visits
  for select to authenticated
  using (profile_id = auth.uid() or public.is_teacher());

drop policy if exists "tattva visits student join" on public.lecture_visits;
create policy "tattva visits student join" on public.lecture_visits
  for insert to authenticated
  with check (
    profile_id = auth.uid()
    and coalesce(attended, false) = false
    and exists (
      select 1
      from public.lectures l
      join public.enrollments e on e.id = l.enrollment_id
      where l.id = lecture_visits.lecture_id and e.profile_id = auth.uid()
    )
  );

drop policy if exists "tattva visits teacher write" on public.lecture_visits;
create policy "tattva visits teacher write" on public.lecture_visits
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

-- reviews & trial_registrations (existing tables: teacher moderation) --
drop policy if exists "tattva reviews public read approved" on public.reviews;
create policy "tattva reviews public read approved" on public.reviews
  for select to anon, authenticated
  using (status = 'approved');

drop policy if exists "tattva reviews teacher all" on public.reviews;
create policy "tattva reviews teacher all" on public.reviews
  for all to authenticated
  using (public.is_teacher())
  with check (public.is_teacher());

drop policy if exists "tattva trials teacher read" on public.trial_registrations;
create policy "tattva trials teacher read" on public.trial_registrations
  for select to authenticated
  using (public.is_teacher());

-- ---------------------------------------------------------------------
-- 4. Indexes (also stops the same student being logged twice per lecture)
-- ---------------------------------------------------------------------
create index if not exists enrollments_profile_idx   on public.enrollments (profile_id);
create index if not exists enrollments_course_idx    on public.enrollments (course_id);
create index if not exists lectures_enrollment_idx   on public.lectures (enrollment_id, lecture_date);
create unique index if not exists lecture_visits_unique_idx
  on public.lecture_visits (lecture_id, profile_id);

-- ---------------------------------------------------------------------
-- 5. Starter courses (only if the table is empty). Teacher can edit later.
-- ---------------------------------------------------------------------
insert into public.courses (id, subject, curriculum, description)
select gen_random_uuid(), v.subject, v.curriculum, v.description
from (values
  ('Mathematics', 'All Curricula',
   'Build strong mathematical concepts through personalized one-on-one learning, problem-solving, and exam-focused preparation.'),
  ('Physics', 'All Curricula',
   'Understand Physics with conceptual clarity, numerical practice, real-world examples, and effective exam strategies.')
) as v(subject, curriculum, description)
where not exists (select 1 from public.courses);

-- ---------------------------------------------------------------------
-- 6. Privacy hardening for tables that hold personal data.
--    reviews / trial_registrations are written by the Next.js API routes
--    with the service-role key (which bypasses RLS), and reviews are read
--    publicly via the "approved only" policy above, so the site keeps working.
-- ---------------------------------------------------------------------
alter table public.reviews             enable row level security;
alter table public.trial_registrations enable row level security;

commit;

-- =====================================================================
-- 7. RUN SEPARATELY, AFTER the teacher has created an account on the site:
--    promote that account to teacher (change the email if needed).
--
--    update public.profiles
--       set role = 'teacher'
--     where id = (select id from auth.users where email = 'tattva2612@gmail.com');
-- =====================================================================
