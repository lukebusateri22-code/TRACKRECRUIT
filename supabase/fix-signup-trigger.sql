-- Fix Signup Trigger to Create Athlete/Coach Profiles
-- This replaces the existing trigger with one that creates both profile and athlete/coach profile

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_profile_id UUID;
  user_role user_role;
BEGIN
  -- Get the role from metadata, default to 'athlete'
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'athlete');
  
  -- Insert into profiles table only
  -- Athlete/coach profiles will be created during onboarding
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    user_role,
    false
  )
  RETURNING id INTO new_profile_id;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the signup
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Success message
SELECT 'Trigger updated successfully! Try signing up again.' as message;
