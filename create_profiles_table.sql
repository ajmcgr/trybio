-- Run this SQL in your Supabase SQL Editor

-- Create profiles table
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  username text unique,
  bio text,
  avatar_url text,
  font text default 'font-sans',
  links jsonb default '[]'::jsonb,
  wallpaper_url text,
  text_color text default '#FFFFFF',
  button_color text default '#000000',
  background_color text default '#000000',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
-- Allow anyone to view profiles (public access)
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Create function to handle profile creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, user_id, name)
  values (new.id, new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
