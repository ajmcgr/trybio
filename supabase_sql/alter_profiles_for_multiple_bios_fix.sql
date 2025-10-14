-- Fix profiles schema to support multiple bio pages per user
-- 1) Ensure pgcrypto for UUID generation
create extension if not exists pgcrypto;

-- 2) Drop FK from profiles.id to auth.users (so id can be independent UUID)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 3) Allow multiple profiles per user by removing unique constraint on user_id (if still present)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- 4) Ensure id gets generated automatically
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 5) Add is_primary column (if not added yet)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false;

-- 6) Mark existing single profile rows as primary for their users
UPDATE public.profiles p
SET is_primary = true
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p2
  WHERE p2.user_id = p.user_id AND p2.is_primary = true AND p2.id <> p.id
);

-- 7) Safer can_create_profile using JWT email (avoid reading auth.users)
create or replace function public.can_create_profile(p_user_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
DECLARE
  current_count integer;
  user_plan text;
  max_profiles integer;
  user_email text;
BEGIN
  -- Current count for this user
  SELECT COUNT(*)::integer INTO current_count
  FROM public.profiles
  WHERE user_id = p_user_id;

  -- Email from JWT
  user_email := (auth.jwt() ->> 'email');

  -- Plan lookup (null => free)
  SELECT plan INTO user_plan
  FROM public.pro_status
  WHERE email = user_email;

  IF user_plan = 'pro' THEN
    max_profiles := 5;
  ELSIF user_plan = 'business' THEN
    max_profiles := 20;
  ELSE
    max_profiles := 1;
  END IF;

  RETURN current_count < max_profiles;
END;
$$;

-- 8) Recreate insert policy to enforce limits
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND public.can_create_profile(auth.uid())
  );

-- 9) Ensure delete policy exists
DROP POLICY IF EXISTS "Users can delete their own profiles" ON public.profiles;
CREATE POLICY "Users can delete their own profiles"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = user_id);
