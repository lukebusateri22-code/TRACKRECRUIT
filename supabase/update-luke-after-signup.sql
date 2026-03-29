-- Update Luke Busateri's Profile After Signup
-- Run this AFTER you sign up via the signup page

-- This will update the profile that was created during signup
-- Replace the email if you used a different one

DO $$
DECLARE
  luke_profile_id UUID;
  luke_athlete_id UUID;
BEGIN
  -- Find Luke's profile by email
  SELECT id INTO luke_profile_id 
  FROM profiles 
  WHERE email = 'lukebusateri22@gmail.com';

  IF luke_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile not found. Make sure you signed up first with email: lukebusateri22@gmail.com';
  END IF;

  -- Update the profile
  UPDATE profiles 
  SET first_name = 'Luke',
      last_name = 'Busateri',
      is_verified = true
  WHERE id = luke_profile_id;

  -- Get athlete profile ID
  SELECT id INTO luke_athlete_id
  FROM athlete_profiles
  WHERE profile_id = luke_profile_id;

  -- Update athlete profile with Luke's details
  UPDATE athlete_profiles
  SET school_name = 'Timberland High School',
      graduation_year = 2027,
      location = 'St. Stephen',
      state = 'SC',
      gpa = 3.7,
      sat_score = 1250,
      height = '6''3"',
      weight = 200,
      bio = 'Triple jump and long jump specialist. Looking for D1 program with strong jumps coaching.',
      instagram = '@lukebusateri',
      twitter = '@lukebusateri'
  WHERE id = luke_athlete_id;

  -- Delete any existing PRs (in case of re-run)
  DELETE FROM personal_records WHERE athlete_profile_id = luke_athlete_id;
  DELETE FROM meet_results WHERE athlete_profile_id = luke_athlete_id;

  -- Add Personal Records
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best)
  VALUES
    (luke_athlete_id, 'Triple Jump', '49''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true),
    (luke_athlete_id, 'Long Jump', '22''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true);

  -- Add meet results
  INSERT INTO meet_results (athlete_profile_id, meet_name, meet_date, location, event, performance, place, points, is_pr)
  VALUES
    (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Triple Jump', '48''6"', '1st', 10, false),
    (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Long Jump', '21''10"', '1st', 10, false),
    (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Triple Jump', '49''1.75"', '1st', 10, true),
    (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Long Jump', '22''1.75"', '2nd', 8, true);

  RAISE NOTICE 'Luke Busateri profile updated successfully!';
  RAISE NOTICE 'Profile ID: %', luke_profile_id;
  RAISE NOTICE 'Athlete Profile ID: %', luke_athlete_id;
  RAISE NOTICE 'You can now login with: lukebusateri22@gmail.com / Test123';
END $$;
