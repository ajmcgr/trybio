-- Add font_size and font_weight columns to profiles table

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS font_size integer DEFAULT 16,
ADD COLUMN IF NOT EXISTS font_weight text DEFAULT 'normal';

-- Add check constraint for font_size
ALTER TABLE public.profiles 
ADD CONSTRAINT font_size_range CHECK (font_size >= 12 AND font_size <= 24);

-- Add check constraint for font_weight
ALTER TABLE public.profiles 
ADD CONSTRAINT font_weight_values CHECK (font_weight IN ('normal', 'medium', 'semibold', 'bold'));
