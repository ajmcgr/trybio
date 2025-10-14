-- Run this in Supabase SQL Editor for project hxjlplwqpkstkjyekrce

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

-- Idempotent create-on-auth trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where policyname='profiles_select_own') then
    create policy profiles_select_own on public.profiles
    for select to authenticated
    using (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname='profiles_update_own') then
    create policy profiles_update_own on public.profiles
    for update to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);
  end if;

  if not exists (select 1 from pg_policies where policyname='profiles_insert_own') then
    create policy profiles_insert_own on public.profiles
    for insert to authenticated
    with check (auth.uid() = user_id);
  end if;
end $$;

-- Idempotent helper to ensure a row exists for current user
create or replace function public.ensure_profile_row()
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.profiles (user_id)
  values (auth.uid())
  on conflict (user_id) do nothing;
$$;
