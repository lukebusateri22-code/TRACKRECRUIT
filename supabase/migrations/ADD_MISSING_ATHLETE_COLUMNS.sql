-- Add all missing columns to athlete_profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS event_specialties TEXT[];
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS personal_records JSONB;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2);
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS act_score INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS sat_score INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS has_verified_academics BOOLEAN DEFAULT false;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS preferred_contact TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
