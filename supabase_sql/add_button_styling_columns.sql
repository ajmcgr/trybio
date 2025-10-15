-- Add missing button styling and font columns to profiles table
-- This will add columns if they don't exist (will error harmlessly if they already exist)

-- Add button_style column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'button_style'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN button_style text DEFAULT 'solid' 
    CHECK (button_style IN ('solid', 'glass', 'outline'));
  END IF;
END $$;

-- Add button_corners column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'button_corners'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN button_corners text DEFAULT 'round' 
    CHECK (button_corners IN ('square', 'round'));
  END IF;
END $$;

-- Add button_text_color column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'button_text_color'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN button_text_color text DEFAULT '#ffffff';
  END IF;
END $$;

-- Add font_size column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'font_size'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN font_size integer DEFAULT 16 
    CHECK (font_size >= 12 AND font_size <= 24);
  END IF;
END $$;

-- Add font_weight column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'font_weight'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN font_weight text DEFAULT 'normal' 
    CHECK (font_weight IN ('normal', 'medium', 'semibold', 'bold'));
  END IF;
END $$;

-- Update profiles_api view if it exists to include all new columns
DROP VIEW IF EXISTS profiles_api;
CREATE OR REPLACE VIEW profiles_api AS 
SELECT * FROM profiles;
