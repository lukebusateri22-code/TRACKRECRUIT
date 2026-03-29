-- Fix the trigger to properly create profiles and athlete/coach profiles

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_profile_id UUID;
  user_role user_role;
BEGIN
  -- Get the role from metadata, default to 'athlete'
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'athlete');
  
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    user_role
  )
  RETURNING id INTO new_profile_id;
  
  -- Create athlete or coach profile based on role
  IF user_role = 'athlete' THEN
    INSERT INTO public.athlete_profiles (
      profile_id,
      school_name,
      graduation_year,
      location,
      state,
      gpa
    )
    VALUES (
      new_profile_id,
      COALESCE(NEW.raw_user_meta_data->>'school', 'Not specified'),
      COALESCE((NEW.raw_user_meta_data->>'graduation_year')::INTEGER, 2027),
      'Not specified',
      'Not specified',
      0.0
    );
  ELSIF user_role = 'coach' THEN
    INSERT INTO public.coach_profiles (
      profile_id,
      university_name,
      position
    )
    VALUES (
      new_profile_id,
      COALESCE(NEW.raw_user_meta_data->>'school', 'Not specified'),
      'Coach'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
