-- Migration: Enable multiple bio pages per user with plan-based limits
-- This modifies the profiles table to support multiple bio pages per user

-- 1. Remove the unique constraint on user_id to allow multiple profiles per user
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- 2. Add a new column to track if this is the primary/default bio page
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false;

-- 3. Update existing profiles to be primary
UPDATE public.profiles SET is_primary = true WHERE is_primary IS NULL OR is_primary = false;

-- 4. Create a function to get user's profile count
CREATE OR REPLACE FUNCTION public.get_user_profile_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.profiles
  WHERE user_id = p_user_id;
$$;

-- 5. Create a function to check if user can create more profiles
CREATE OR REPLACE FUNCTION public.can_create_profile(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  user_email text;
  user_plan text;
  max_profiles integer;
BEGIN
  -- Get current profile count
  current_count := public.get_user_profile_count(p_user_id);
  
  -- Get user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = p_user_id;
  
  -- Get user plan from pro_status table
  SELECT plan INTO user_plan
  FROM public.pro_status
  WHERE email = user_email;
  
  -- Determine max profiles based on plan
  IF user_plan = 'pro' THEN
    max_profiles := 5;
  ELSIF user_plan = 'business' THEN
    max_profiles := 20;
  ELSE
    max_profiles := 1; -- Free plan
  END IF;
  
  -- Return true if user can create more profiles
  RETURN current_count < max_profiles;
END;
$$;

-- 6. Update the insert policy to check profile limits
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    AND public.can_create_profile(auth.uid())
  );

-- 7. Add policy to allow users to delete their own profiles
DROP POLICY IF EXISTS "Users can delete their own profiles" ON public.profiles;
CREATE POLICY "Users can delete their own profiles"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- 8. Update the handle_new_user function to not automatically create a profile
-- (We'll let users create profiles manually through the UI)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Note: Run this migration in your Supabase SQL Editor
-- After running this migration, existing users will keep their current profile
-- and will be able to create additional profiles based on their plan limits
