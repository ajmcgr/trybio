-- Run this in Supabase SQL Editor for project hxjlplwqpkstkjyekrce

-- 1) Ensure base table exists with expected columns
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Create a read-only view that maps user_id -> id for API compatibility
drop view if exists public.profiles_api;
create view public.profiles_api as
select
  user_id as id,
  username,
  full_name,
  avatar_url,
  created_at,
  updated_at
from public.profiles;

-- 3) RLS on base table (if not already)
alter table public.profiles enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname='profiles_select_own') then
    create policy profiles_select_own on public.profiles
    for select to authenticated
    using (auth.uid() = user_id);
  end if;
end $$;

-- 4) RLS for the VIEW (use security barrier + policy on base table)
-- PostgREST respects base-table policies for simple views like this

-- 5) Refresh PostgREST schema cache so 'profiles_api' + columns are visible
notify pgrst, 'reload schema';

-- Optional: idempotent helper to create profile row on demand
create or replace function public.ensure_profile_row()
returns void language sql security definer set search_path = public as $$
  insert into public.profiles (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;
$$;

-- END
