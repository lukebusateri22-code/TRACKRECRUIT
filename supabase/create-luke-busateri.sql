-- Create Test User: Luke Busateri
-- This creates a complete test account with profile and PRs

-- First, we need to create the auth user
-- NOTE: You'll need to create the auth user manually in Supabase Dashboard
-- Go to Authentication > Users > Add User
-- Email: lukebusateri22@gmail.com
-- Password: Test123
-- Then come back and run the rest of this script

-- After creating the auth user, get the user_id and replace 'YOUR_USER_ID_HERE' below
-- You can find it in Authentication > Users > click on the user > copy the ID

DO $$
DECLARE
  -- IMPORTANT: Replace this with the actual user_id from auth.users after creating the user
  luke_user_id UUID := 'YOUR_USER_ID_HERE'; -- Replace this!
  luke_profile_id UUID;
  luke_athlete_id UUID;
BEGIN
  -- Check if we need to replace the user_id
  IF luke_user_id = 'YOUR_USER_ID_HERE' THEN
    RAISE EXCEPTION 'Please replace YOUR_USER_ID_HERE with the actual user_id from auth.users';
  END IF;

  -- Create profile
  INSERT INTO profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (luke_user_id, 'lukebusateri22@gmail.com', 'Luke', 'Busateri', 'athlete', true)
  RETURNING id INTO luke_profile_id;

  -- Create athlete profile
  INSERT INTO athlete_profiles (
    profile_id,
    school_name,
    graduation_year,
    location,
    state,
    gpa,
    sat_score,
    height,
    weight,
    bio,
    phone,
    instagram,
    twitter
  )
  VALUES (
    luke_profile_id,
    'Timberland High School',
    2027,
    'St. Stephen', -- Timberland is in South Carolina
    'SC',
    3.7,
    1250,
    '6''3"',
    200,
    'Triple jump and long jump specialist. Looking for D1 program with strong jumps coaching.',
    NULL,
    '@lukebusateri',
    '@lukebusateri'
  )
  RETURNING id INTO luke_athlete_id;

  -- Add Personal Records
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best)
  VALUES
    (luke_athlete_id, 'Triple Jump', '49''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true),
    (luke_athlete_id, 'Long Jump', '22''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true);

  -- Add some meet results
  INSERT INTO meet_results (athlete_profile_id, meet_name, meet_date, location, event, performance, place, points, is_pr)
  VALUES
    (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Triple Jump', '48''6"', '1st', 10, false),
    (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Long Jump', '21''10"', '1st', 10, false),
    (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Triple Jump', '49''1.75"', '1st', 10, true),
    (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Long Jump', '22''1.75"', '2nd', 8, true);

  RAISE NOTICE 'Luke Busateri profile created successfully!';
  RAISE NOTICE 'Profile ID: %', luke_profile_id;
  RAISE NOTICE 'Athlete Profile ID: %', luke_athlete_id;
  RAISE NOTICE 'Login: lukebusateri22@gmail.com / Test123';
END $$;
