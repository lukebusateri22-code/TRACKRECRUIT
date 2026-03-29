-- Fix user_role casting + backfill missing profiles
-- Run in Supabase SQL Editor

-- 1) Check enum values
SELECT unnest(enum_range(NULL::user_role)) AS role;

-- 2) Show recent users and whether they have profiles
SELECT 
  au.id AS user_id,
  au.email,
  au.raw_user_meta_data->>'role' AS role,
  p.id AS profile_id,
  CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'Has profile' END AS status
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
ORDER BY au.created_at DESC
LIMIT 20;

-- 3) Backfill profiles for any missing users
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'Name'),
  CASE
    WHEN au.raw_user_meta_data->>'role' IS NULL THEN 'athlete'::user_role
    WHEN (au.raw_user_meta_data->>'role') IN (SELECT unnest(enum_range(NULL::user_role))::text)
      THEN (au.raw_user_meta_data->>'role')::user_role
    ELSE 'athlete'::user_role
  END,
  false
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 4) Replace signup trigger with safe role handling
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_profile_id UUID;
  safe_role user_role;
BEGIN
  SELECT CASE
    WHEN NEW.raw_user_meta_data->>'role' IS NULL THEN 'athlete'::user_role
    WHEN (NEW.raw_user_meta_data->>'role') IN (SELECT unnest(enum_range(NULL::user_role))::text)
      THEN (NEW.raw_user_meta_data->>'role')::user_role
    ELSE 'athlete'::user_role
  END INTO safe_role;

  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    safe_role,
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
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
