-- Robust Signup Trigger - Ensures Profile Creation
-- Run this in Supabase SQL Editor to fix the signup flow

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
  
  -- Insert into profiles table and get the ID
  INSERT INTO public.profiles (
    user_id, 
    email, 
    first_name, 
    last_name, 
    role, 
    is_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    user_role,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = NOW()
  RETURNING id INTO new_profile_id;
  
  -- Log success
  RAISE LOG 'Created profile % for user %', new_profile_id, NEW.id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error with details
  RAISE LOG 'Error in handle_new_user for user %: %', NEW.id, SQLERRM;
  -- Still return NEW so signup doesn't fail
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify the trigger was created
SELECT 
  'Trigger created successfully!' as status,
  tgname as trigger_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';
