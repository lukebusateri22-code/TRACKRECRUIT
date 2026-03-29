-- Complete Luke's Profile After Signup
-- Run this after signing up with lukebusateri22@gmail.com

DO $$
DECLARE
  luke_profile_id UUID;
  luke_athlete_id UUID;
BEGIN
  -- Find Luke's profile
  SELECT id INTO luke_profile_id 
  FROM profiles 
  WHERE email = 'lukebusateri22@gmail.com';

  IF luke_profile_id IS NULL THEN
    RAISE EXCEPTION 'Profile not found. Sign up first at /signup';
  END IF;

  -- Check if athlete_profile exists, if not create it
  SELECT id INTO luke_athlete_id
  FROM athlete_profiles
  WHERE profile_id = luke_profile_id;

  IF luke_athlete_id IS NULL THEN
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
      'Triple jump and long jump specialist from Timberland HS. Looking for D1 program with strong jumps coaching and competitive team environment.',
      '@lukebusateri',
      '@lukebusateri'
    )
    RETURNING id INTO luke_athlete_id;
  ELSE
    -- Update existing athlete profile
    UPDATE athlete_profiles
    SET school_name = 'Timberland High School',
        graduation_year = 2027,
        location = 'St. Stephen',
        state = 'SC',
        gpa = 3.7,
        sat_score = 1250,
        height = '6''3"',
        weight = 200,
        bio = 'Triple jump and long jump specialist from Timberland HS. Looking for D1 program with strong jumps coaching and competitive team environment.',
        instagram = '@lukebusateri',
        twitter = '@lukebusateri'
    WHERE id = luke_athlete_id;
  END IF;

  -- Clear existing PRs and results
  DELETE FROM personal_records WHERE athlete_profile_id = luke_athlete_id;
  DELETE FROM meet_results WHERE athlete_profile_id = luke_athlete_id;

  -- Add PRs
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

  RAISE NOTICE 'Luke Busateri complete! Login: lukebusateri22@gmail.com / Test123';
END $$;
