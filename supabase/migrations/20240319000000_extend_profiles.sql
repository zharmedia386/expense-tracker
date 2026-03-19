-- Extend profiles table for settings (run in Supabase SQL Editor if needed)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_notifications boolean DEFAULT true;
