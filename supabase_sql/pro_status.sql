-- Run this in Supabase SQL Editor for project hxjlplwqpkstkjyekrce
-- This creates the pro_status table and RLS policies for webhook-based subscription management

create table if not exists public.pro_status (
  email text primary key,
  plan text, -- 'pro'
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

alter table public.pro_status enable row level security;

-- Allow each logged-in user to read ONLY their own row by email
-- We read email from the JWT claims provided by Supabase auth
drop policy if exists "Read own pro status" on public.pro_status;
create policy "Read own pro status"
on public.pro_status
for select
to authenticated
using ((auth.jwt() ->> 'email') = email);
