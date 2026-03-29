-- Create Luke Busateri from scratch
-- This checks for auth user and creates complete profile

DO $$
DECLARE
  luke_user_id UUID;
  luke_profile_id UUID;
  luke_athlete_id UUID;
BEGIN
  -- Check if there's an auth user for lukebusateri22@gmail.com
  SELECT id INTO luke_user_id
  FROM auth.users
  WHERE email = 'lukebusateri22@gmail.com';

  IF luke_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found. Please sign up at /signup first with email: lukebusateri22@gmail.com';
  END IF;

  RAISE NOTICE 'Found auth user! ID: %', luke_user_id;

  -- Create profile
  INSERT INTO profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (luke_user_id, 'lukebusateri22@gmail.com', 'Luke', 'Busateri', 'athlete', true)
  RETURNING id INTO luke_profile_id;

  RAISE NOTICE 'Created profile! ID: %', luke_profile_id;

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
    instagram,
    twitter
  )
  VALUES (
    luke_profile_id,
    'Timberland High School',
    2027,
    'St. Stephen',
    'SC',
    3.7,
    1250,
    '6''3"',
    200,
    'Triple jump and long jump specialist from Timberland HS. Looking for D1 program with strong jumps coaching.',
    '@lukebusateri',
    '@lukebusateri'
  )
  RETURNING id INTO luke_athlete_id;

  RAISE NOTICE 'Created athlete profile! ID: %', luke_athlete_id;

  -- Add PRs
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best)
  VALUES
    (luke_athlete_id, 'Triple Jump', '49''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true),
    (luke_athlete_id, 'Long Jump', '22''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true);

  RAISE NOTICE 'Added 2 PRs';

  -- Add meet results
  INSERT INTO meet_results (athlete_profile_id, meet_name, meet_date, location, event, performance, place, points, is_pr)
  VALUES
    (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Triple Jump', '48''6"', '1st', 10, false),
    (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Long Jump', '21''10"', '1st', 10, false),
    (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Triple Jump', '49''1.75"', '1st', 10, true),
    (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Long Jump', '22''1.75"', '2nd', 8, true);

  RAISE NOTICE 'Added 4 meet results';
  RAISE NOTICE '=================================';
  RAISE NOTICE 'Luke Busateri profile complete!';
  RAISE NOTICE 'Login: lukebusateri22@gmail.com';
  RAISE NOTICE 'Password: Test123';
  RAISE NOTICE '=================================';
END $$;
