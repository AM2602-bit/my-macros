-- My Mac-ro's database setup for Supabase.
-- Run once in Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: everything is created "if not exists" or replaced.

-- ---------- Tables ----------

-- One row per account, created automatically when a user signs up.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  disabled boolean not null default false,
  created_at timestamptz not null default now()
);

-- Each user's app data (targets, preferences, favourites, plan, cart, prices) as one JSON document.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- Helpers ----------

-- True when the signed-in user is an active admin. SECURITY DEFINER so policies
-- can call it without recursing through profiles' own row-level security.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin' and not disabled);
$$;

create or replace function public.is_disabled()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select disabled from profiles where id = auth.uid()), false);
$$;

-- Create a profile for every new auth user.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, display_name)
  values (new.id, new.email, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may edit their own display name, but only admins (or the server-side
-- admin function) may change role, disabled or email.
create or replace function public.protect_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce(auth.jwt() ->> 'role', '') <> 'service_role' and not public.is_admin() then
    new.role := old.role;
    new.disabled := old.disabled;
    new.email := old.email;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile
  before update on public.profiles
  for each row execute function public.protect_profile();

-- ---------- Row-level security ----------

alter table public.profiles enable row level security;
alter table public.user_data enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: update own or admin" on public.profiles;
create policy "profiles: update own or admin" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "user_data: read own or admin" on public.user_data;
create policy "user_data: read own or admin" on public.user_data
  for select to authenticated using ((user_id = auth.uid() and not public.is_disabled()) or public.is_admin());

drop policy if exists "user_data: insert own" on public.user_data;
create policy "user_data: insert own" on public.user_data
  for insert to authenticated with check ((user_id = auth.uid() and not public.is_disabled()) or public.is_admin());

drop policy if exists "user_data: update own or admin" on public.user_data;
create policy "user_data: update own or admin" on public.user_data
  for update to authenticated using ((user_id = auth.uid() and not public.is_disabled()) or public.is_admin());

-- Accounts that existed before this script ran also get a profile.
insert into public.profiles (id, email, display_name)
select id, email, split_part(email, '@', 1) from auth.users
on conflict (id) do nothing;

-- ---------- Make yourself an admin ----------
-- After creating your own account in the app, run this once with your email:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
