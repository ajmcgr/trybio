-- Social handles table for storing user's social media links
create table public.social_handles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null check (platform in ('instagram', 'youtube', 'tiktok', 'x', 'whatsapp', 'telegram', 'threads', 'facebook', 'snapchat', 'email')),
  handle text not null,
  url text not null,
  is_visible boolean default true,
  position integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.social_handles enable row level security;

-- Policies
create policy "Public social handles are viewable by everyone"
  on public.social_handles for select
  using (is_visible = true);

create policy "Users can insert their own social handles"
  on public.social_handles for insert
  with check (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

create policy "Users can update their own social handles"
  on public.social_handles for update
  using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

create policy "Users can delete their own social handles"
  on public.social_handles for delete
  using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Click tracking for social handles
create table public.social_handle_clicks (
  id uuid primary key default gen_random_uuid(),
  social_handle_id uuid references public.social_handles(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  platform text not null,
  clicked_at timestamptz default now()
);

alter table public.social_handle_clicks enable row level security;

create policy "Anyone can insert social handle clicks"
  on public.social_handle_clicks for insert
  with check (true);

create policy "Users can view their own social handle clicks"
  on public.social_handle_clicks for select
  using (
    profile_id in (select id from public.profiles where user_id = auth.uid())
  );

-- Add social icon settings to profiles table
alter table public.profiles 
  add column if not exists social_icon_position text default 'below' check (social_icon_position in ('above', 'below')),
  add column if not exists social_icon_style text default 'brand' check (social_icon_style in ('brand', 'monochrome', 'outline')),
  add column if not exists social_icon_shape text default 'circle' check (social_icon_shape in ('circle', 'rounded', 'square')),
  add column if not exists social_icon_size integer default 32 check (social_icon_size between 16 and 48),
  add column if not exists social_icon_spacing integer default 12 check (social_icon_spacing between 4 and 32),
  add column if not exists social_icon_alignment text default 'center' check (social_icon_alignment in ('left', 'center', 'right')),
  add column if not exists social_icon_hover text default 'scale' check (social_icon_hover in ('scale', 'underline', 'none')),
  add column if not exists social_icon_color text default '#000000';

-- Updated at trigger for social_handles
create trigger on_social_handles_updated
  before update on public.social_handles
  for each row execute function public.handle_updated_at();
