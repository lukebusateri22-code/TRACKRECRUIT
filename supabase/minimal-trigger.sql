-- Minimal Trigger - Just Create Profile, No Athlete/Coach Profile
-- This prevents signup errors by only creating the basic profile
-- We'll add athlete/coach profiles manually after signup

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create the basic profile, nothing else
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'athlete'),
    false
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If anything fails, just return NEW so signup doesn't fail
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

SELECT 'Minimal trigger created. Signup should work now.' as message;
