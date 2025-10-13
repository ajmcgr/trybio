-- Create analytics tables for tracking views and clicks

-- Table for profile views
create table public.profile_views (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(user_id) on delete cascade,
  viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  referrer text
);

-- Table for link clicks
create table public.link_clicks (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid not null references public.profiles(user_id) on delete cascade,
  link_title text not null,
  link_url text not null,
  clicked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_agent text,
  referrer text
);

-- Enable RLS
alter table public.profile_views enable row level security;
alter table public.link_clicks enable row level security;

-- Allow anyone to insert analytics (public tracking)
create policy "Anyone can track profile views"
  on public.profile_views for insert
  with check (true);

create policy "Anyone can track link clicks"
  on public.link_clicks for insert
  with check (true);

-- Allow users to view their own analytics
create policy "Users can view their own profile views"
  on public.profile_views for select
  using (
    profile_id = auth.uid()
  );

create policy "Users can view their own link clicks"
  on public.link_clicks for select
  using (
    profile_id = auth.uid()
  );

-- Create indexes for better performance
create index profile_views_profile_id_idx on public.profile_views(profile_id);
create index profile_views_viewed_at_idx on public.profile_views(viewed_at);
create index link_clicks_profile_id_idx on public.link_clicks(profile_id);
create index link_clicks_clicked_at_idx on public.link_clicks(clicked_at);
