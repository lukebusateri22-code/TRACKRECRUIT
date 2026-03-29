-- COMPLETE FIX - Run this entire script in Supabase SQL Editor
-- This fixes signup, profiles, RLS, and creates a working trigger

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own athlete profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Users can update own athlete profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Users can insert own athlete profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Users can view own PRs" ON personal_records;
DROP POLICY IF EXISTS "Users can insert own PRs" ON personal_records;

-- 2. Create working RLS policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own athlete profile"
  ON athlete_profiles FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own athlete profile"
  ON athlete_profiles FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own athlete profile"
  ON athlete_profiles FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own PRs"
  ON personal_records FOR SELECT
  USING (
    athlete_profile_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN profiles p ON ap.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own PRs"
  ON personal_records FOR INSERT
  WITH CHECK (
    athlete_profile_id IN (
      SELECT ap.id FROM athlete_profiles ap
      JOIN profiles p ON ap.profile_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- 3. Drop and recreate signup trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'athlete')::user_role,
    false
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail
  RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Create profiles for all existing users who don't have one
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'last_name', 'Name'),
  COALESCE(u.raw_user_meta_data->>'role', 'athlete')::user_role,
  false
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- 5. Verify everything
SELECT 
  'Setup complete!' as status,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM auth.users u LEFT JOIN profiles p ON u.id = p.user_id WHERE p.id IS NULL) as users_without_profiles;
