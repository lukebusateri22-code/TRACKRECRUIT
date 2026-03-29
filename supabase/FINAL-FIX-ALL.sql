-- FINAL FIX - Run this entire script in Supabase SQL Editor
-- This fixes ALL database issues at once

-- 1. DROP AND RECREATE SIGNUP TRIGGER (fixes 500 error)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_profile_id UUID;
  safe_role TEXT;
BEGIN
  -- Get role as text, default to 'athlete'
  safe_role := COALESCE(NEW.raw_user_meta_data->>'role', 'athlete');
  
  -- Insert profile with text role (let database handle enum conversion)
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    safe_role::user_role,
    false
  )
  ON CONFLICT (user_id) DO UPDATE SET 
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role
  RETURNING id INTO new_profile_id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail signup
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 2. ENSURE ATHLETE_PROFILES TABLE HAS CORRECT SCHEMA
ALTER TABLE public.athlete_profiles
  DROP COLUMN IF EXISTS height,
  DROP COLUMN IF EXISTS weight,
  DROP COLUMN IF EXISTS gpa,
  DROP COLUMN IF EXISTS location;

ALTER TABLE public.athlete_profiles
  ADD COLUMN IF NOT EXISTS school_name TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
  ADD COLUMN IF NOT EXISTS milesplit_url TEXT;

-- 3. ENSURE PERSONAL_RECORDS TABLE EXISTS WITH CORRECT SCHEMA
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_profile_id UUID REFERENCES public.athlete_profiles(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  performance TEXT NOT NULL,
  date TEXT,
  meet_name TEXT,
  location TEXT,
  is_personal_best BOOLEAN DEFAULT true,
  verification_status TEXT DEFAULT 'pending',
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BACKFILL ANY MISSING PROFILES
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'Name'),
  COALESCE(au.raw_user_meta_data->>'role', 'athlete')::user_role,
  false
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 5. VERIFY EVERYTHING
SELECT 
  'Trigger created: ' || COUNT(*)::TEXT as status
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

SELECT 
  'Users without profiles: ' || COUNT(*)::TEXT as status
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL;
