-- Fix Dillon Mitchell profile after signup
-- The auth user was created but profile wasn't

DO $$
DECLARE
  dillon_user_id UUID;
  dillon_profile_id UUID;
  dillon_athlete_id UUID;
BEGIN
  -- Get the auth user ID
  SELECT id INTO dillon_user_id
  FROM auth.users
  WHERE email = 'lukebusateri@gmail.com'
  ORDER BY created_at DESC
  LIMIT 1;

  IF dillon_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found for lukebusateri@gmail.com';
  END IF;

  RAISE NOTICE 'Found auth user! ID: %', dillon_user_id;

  -- Check if profile already exists
  SELECT id INTO dillon_profile_id
  FROM profiles
  WHERE user_id = dillon_user_id;

  IF dillon_profile_id IS NOT NULL THEN
    RAISE NOTICE 'Profile already exists! ID: %', dillon_profile_id;
  ELSE
    -- Create profile
    INSERT INTO profiles (user_id, email, first_name, last_name, role, is_verified)
    VALUES (dillon_user_id, 'lukebusateri@gmail.com', 'Dillon', 'Mitchell', 'athlete', true)
    RETURNING id INTO dillon_profile_id;

    RAISE NOTICE 'Created profile! ID: %', dillon_profile_id;
  END IF;

  -- Check if athlete profile exists
  SELECT id INTO dillon_athlete_id
  FROM athlete_profiles
  WHERE profile_id = dillon_profile_id;

  IF dillon_athlete_id IS NOT NULL THEN
    RAISE NOTICE 'Athlete profile already exists! ID: %', dillon_athlete_id;
  ELSE
    -- Create athlete profile with MileSplit URL
    INSERT INTO athlete_profiles (
      profile_id,
      school_name,
      graduation_year,
      location,
      state,
      height,
      weight,
      gpa,
      milesplit_url
    ) VALUES (
      dillon_profile_id,
      'Sheldon King High School',
      2028,
      'Houston',
      'TX',
      '5''10"',
      '160',
      3.5,
      'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'
    ) RETURNING id INTO dillon_athlete_id;

    RAISE NOTICE 'Created athlete profile! ID: %', dillon_athlete_id;
  END IF;

  -- Delete any existing PRs first to avoid duplicates
  DELETE FROM personal_records WHERE athlete_profile_id = dillon_athlete_id;

  -- Add his PRs from MileSplit (2026 season - best times)
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best, verification_status, source_url)
  VALUES
    (dillon_athlete_id, '100m', '9.88s', '2026-06-01', '2026 Outdoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '200m', '20.22s', '2026-06-01', '2026 Outdoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '400m', '49.82s', '2026-06-01', '2026 Outdoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '55m', '6.17s', '2026-02-01', '2026 Indoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '60m', '6.59s', '2026-02-01', '2026 Indoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell');

  RAISE NOTICE 'Added 5 PRs!';

  RAISE NOTICE '=== Dillon Mitchell Account Fixed ===';
  RAISE NOTICE 'Email: lukebusateri@gmail.com';
  RAISE NOTICE 'Password: Test321';
  RAISE NOTICE 'Profile ID: %', dillon_profile_id;
  RAISE NOTICE 'Athlete ID: %', dillon_athlete_id;
  RAISE NOTICE 'PRs: 100m (9.88s), 200m (20.22s), 400m (49.82s), 55m (6.17s), 60m (6.59s)';
  RAISE NOTICE 'MileSplit: https://tx.milesplit.com/athletes/15635072-dillon-mitchell';

END $$;
