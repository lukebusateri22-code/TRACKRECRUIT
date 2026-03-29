-- Check what profiles exist and fix Luke's profile
-- This will show you what's in the database and create Luke's profile if needed

-- First, let's see what profiles exist
SELECT 'Existing profiles:' as info;
SELECT id, email, first_name, last_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Now let's check if Luke's profile exists
DO $$
DECLARE
  luke_profile_id UUID;
  luke_athlete_id UUID;
  luke_user_id UUID;
BEGIN
  -- Try to find Luke's profile
  SELECT id, user_id INTO luke_profile_id, luke_user_id
  FROM profiles 
  WHERE email ILIKE '%lukebusateri%' OR email ILIKE '%busateri%'
  LIMIT 1;

  IF luke_profile_id IS NULL THEN
    RAISE NOTICE 'No profile found with lukebusateri email. Check the profiles list above.';
    RAISE NOTICE 'You may need to sign up again or use a different email.';
  ELSE
    RAISE NOTICE 'Found profile! ID: %, Email from profiles table', luke_profile_id;
    
    -- Check if athlete_profile exists
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
        'Triple jump and long jump specialist from Timberland HS. Looking for D1 program with strong jumps coaching.',
        '@lukebusateri',
        '@lukebusateri'
      )
      RETURNING id INTO luke_athlete_id;
      
      RAISE NOTICE 'Created athlete profile! ID: %', luke_athlete_id;
    ELSE
      RAISE NOTICE 'Athlete profile already exists! ID: %', luke_athlete_id;
    END IF;

    -- Clear and add PRs
    DELETE FROM personal_records WHERE athlete_profile_id = luke_athlete_id;
    INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best)
    VALUES
      (luke_athlete_id, 'Triple Jump', '49''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true),
      (luke_athlete_id, 'Long Jump', '22''1.75"', '2024-05-15', 'State Championships', 'Columbia, SC', true);

    -- Clear and add meet results
    DELETE FROM meet_results WHERE athlete_profile_id = luke_athlete_id;
    INSERT INTO meet_results (athlete_profile_id, meet_name, meet_date, location, event, performance, place, points, is_pr)
    VALUES
      (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Triple Jump', '48''6"', '1st', 10, false),
      (luke_athlete_id, 'Region Championships', '2024-04-20', 'Charleston, SC', 'Long Jump', '21''10"', '1st', 10, false),
      (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Triple Jump', '49''1.75"', '1st', 10, true),
      (luke_athlete_id, 'State Championships', '2024-05-15', 'Columbia, SC', 'Long Jump', '22''1.75"', '2nd', 8, true);

    RAISE NOTICE 'Luke Busateri profile complete!';
    RAISE NOTICE 'Login with the email shown above and password: Test123';
  END IF;
END $$;
