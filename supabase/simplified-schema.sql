-- Simplified Schema for TrackRecruit
-- Run this in Supabase SQL Editor

-- 1. PROFILES TABLE (basic user info)
-- Already exists, just verify structure
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS height,
  DROP COLUMN IF EXISTS weight,
  DROP COLUMN IF EXISTS gpa;

-- 2. ATHLETE PROFILES (simplified - just school, city, state)
ALTER TABLE public.athlete_profiles
  DROP COLUMN IF EXISTS height,
  DROP COLUMN IF EXISTS weight,
  DROP COLUMN IF EXISTS gpa;

-- Make sure we have the essential columns
ALTER TABLE public.athlete_profiles
  ADD COLUMN IF NOT EXISTS school_name TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
  ADD COLUMN IF NOT EXISTS milesplit_url TEXT;

-- 3. PERSONAL RECORDS (event + performance)
-- Verify structure
ALTER TABLE public.personal_records
  ADD COLUMN IF NOT EXISTS event TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS performance TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS date TEXT,
  ADD COLUMN IF NOT EXISTS meet_name TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS is_personal_best BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS source_url TEXT;

-- 4. COACH PROFILES (add conference)
ALTER TABLE public.coach_profiles
  ADD COLUMN IF NOT EXISTS conference_name TEXT,
  ADD COLUMN IF NOT EXISTS conference_url TEXT;

-- Clean up any problematic constraints
ALTER TABLE public.personal_records
  ALTER COLUMN event DROP DEFAULT,
  ALTER COLUMN performance DROP DEFAULT;
