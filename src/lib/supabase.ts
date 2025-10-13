import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hxjlplwqpkstkjyekrce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4amxwbHdxcGtzdGtqeWVrcmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDU2NTEsImV4cCI6MjA3NTkyMTY1MX0.HXix_D_HjkNpv5T6UudKQGEYs3ASTFxLpaMsdl91e4Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
