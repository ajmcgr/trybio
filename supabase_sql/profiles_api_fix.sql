-- Run this in Supabase SQL Editor for project hxjlplwqpkstkjyekrce

-- 1) Ensure base table exists
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 2) Add any missing columns (idempotent)
alter table public.profiles add column if not exists username text;
-- Prefer a partial unique index to allow NULLs but keep usernames unique when set
create unique index if not exists profiles_username_unique on public.profiles (username) where username is not null;

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists wallpaper_url text;
alter table public.profiles add column if not exists text_color text default '#FFFFFF';
alter table public.profiles add column if not exists button_color text default '#000000';
alter table public.profiles add column if not exists button_text_color text default '#FFFFFF';
alter table public.profiles add column if not exists background_color text default '#000000';
alter table public.profiles add column if not exists font text default 'font-sans';
alter table public.profiles add column if not exists links jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists is_primary boolean default false;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

-- 3) updated_at trigger (idempotent)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 4) Read-only view that maps user_id -> id (compat for code doing select=id)
drop view if exists public.profiles_api;
create view public.profiles_api as
select
  user_id as id,
  username,
  full_name,
  avatar_url,
  bio,
  wallpaper_url,
  text_color,
  button_color,
  button_text_color,
  background_color,
  font,
  links,
  is_primary,
  created_at,
  updated_at
from public.profiles;

-- 5) RLS: allow authenticated users to read their own row via base table policy
alter table public.profiles enable row level security;
do $$
begin
  if not exists (select 1 from pg_policies where policyname='profiles_select_own') then
    create policy profiles_select_own on public.profiles
    for select to authenticated
    using (auth.uid() = user_id);
  end if;
end $$;

-- 6) Refresh PostgREST schema cache so new columns/view are visible
notify pgrst, 'reload schema';

-- Optional helper to ensure a row exists (idempotent)
create or replace function public.ensure_profile_row()
returns void language sql security definer set search_path=public as $$
  insert into public.profiles (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;
$$;

-- END
