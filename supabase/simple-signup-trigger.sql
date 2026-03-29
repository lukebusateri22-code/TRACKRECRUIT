-- Simple Signup Trigger - Only required fields
-- Run this in Supabase SQL Editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_profile_id UUID;
  user_role user_role;
BEGIN
  -- Get the role from metadata, default to 'athlete'
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'athlete');
  
  -- Insert into profiles table with only required fields
  INSERT INTO public.profiles (
    user_id, 
    email, 
    first_name, 
    last_name, 
    role, 
    is_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    user_role,
    false
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role
  RETURNING id INTO new_profile_id;
  
  -- Log success
  RAISE NOTICE 'Created profile % for user % with role %', new_profile_id, NEW.id, user_role;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error with details
  RAISE WARNING 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  -- Still return NEW so signup doesn't fail
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Test query to verify trigger exists
SELECT 
  'Trigger created successfully!' as status,
  t.tgname as trigger_name,
  p.proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE t.tgname = 'on_auth_user_created';
