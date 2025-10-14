-- Run this in Supabase SQL Editor for project hxjlplwqpkstkjyekrce

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1) Drop and recreate profiles table with id as primary key (multi-bio support)
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  wallpaper_url text,
  text_color text default '#FFFFFF',
  button_color text default '#000000',
  button_text_color text default '#FFFFFF',
  background_color text default '#000000',
  font text default 'font-sans',
  links jsonb default '[]'::jsonb,
  is_primary boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for faster lookups
create index idx_profiles_user_id on public.profiles(user_id);

-- Prefer a partial unique index to allow NULLs but keep usernames unique when set
create unique index profiles_username_unique on public.profiles (username) where username is not null;

-- 2) updated_at trigger
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

-- 3) Function to get user's subscription plan from pro_status
create or replace function public.get_user_plan(_user_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select product_id from public.pro_status where user_id = _user_id and subscribed = true limit 1),
    'free'
  );
$$;

-- 4) Function to check if user can create a profile based on their plan
create or replace function public.can_create_profile(_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  current_count integer;
  user_plan text;
  max_profiles integer;
begin
  -- Get current profile count
  select count(*) into current_count
  from public.profiles
  where user_id = _user_id;
  
  -- Get user's plan
  user_plan := public.get_user_plan(_user_id);
  
  -- Determine max profiles based on plan
  max_profiles := case user_plan
    when 'prod_RXCLLYRbS86yEm' then 5  -- pro plan product_id
    when 'prod_RXCMgf3YWnXbR8' then 20 -- business plan product_id
    else 1  -- free plan
  end;
  
  return current_count < max_profiles;
end;
$$;

-- 5) Create one primary profile on user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, full_name, is_primary)
  values (new.id, new.raw_user_meta_data->>'full_name', true);
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 6) Read-only view (profiles_api) - now just exposes all columns directly since id exists
drop view if exists public.profiles_api;
create view public.profiles_api as
select
  id,
  user_id,
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

-- 7) RLS
alter table public.profiles enable row level security;

create policy profiles_select_public on public.profiles
for select to anon, authenticated
using (true);

create policy profiles_insert_own on public.profiles
for insert to authenticated
with check (
  auth.uid() = user_id 
  and public.can_create_profile(auth.uid())
);

create policy profiles_update_own on public.profiles
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy profiles_delete_own on public.profiles
for delete to authenticated
using (auth.uid() = user_id);

-- 8) Refresh PostgREST schema cache
notify pgrst, 'reload schema';

-- END
