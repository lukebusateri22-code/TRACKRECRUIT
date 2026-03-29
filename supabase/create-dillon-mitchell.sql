-- Create Dillon Mitchell test account
-- Email: lukebusateri@gmail.com
-- Password: Test321

DO $$
DECLARE
  dillon_user_id UUID;
  dillon_profile_id UUID;
  dillon_athlete_id UUID;
BEGIN
  -- Check if there's an auth user for lukebusateri@gmail.com
  SELECT id INTO dillon_user_id
  FROM auth.users
  WHERE email = 'lukebusateri@gmail.com';

  IF dillon_user_id IS NULL THEN
    RAISE EXCEPTION 'No auth user found. Please sign up at /signup first with email: lukebusateri@gmail.com';
  END IF;

  RAISE NOTICE 'Found auth user! ID: %', dillon_user_id;

  -- Create profile
  INSERT INTO profiles (user_id, email, first_name, last_name, role, is_verified)
  VALUES (dillon_user_id, 'lukebusateri@gmail.com', 'Dillon', 'Mitchell', 'athlete', true)
  RETURNING id INTO dillon_profile_id;

  RAISE NOTICE 'Created profile! ID: %', dillon_profile_id;

  -- Create athlete profile with MileSplit URL
  INSERT INTO athlete_profiles (
    profile_id,
    school_name,
    graduation_year,
    location,
    state,
    height,
    weight,
    milesplit_url
  ) VALUES (
    dillon_profile_id,
    'Sheldon King High School',
    2028,
    'Houston',
    'TX',
    '5''10"',
    '160',
    'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'
  ) RETURNING id INTO dillon_athlete_id;

  RAISE NOTICE 'Created athlete profile! ID: %', dillon_athlete_id;

  -- Add his PRs from MileSplit (2026 season - best times)
  INSERT INTO personal_records (athlete_profile_id, event, performance, date, meet_name, location, is_personal_best, verification_status, source_url)
  VALUES
    (dillon_athlete_id, '100m', '9.88s', '2026-06-01', '2026 Outdoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '200m', '20.22s', '2026-06-01', '2026 Outdoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '400m', '49.82s', '2026-06-01', '2026 Outdoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '55m', '6.17s', '2026-02-01', '2026 Indoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell'),
    (dillon_athlete_id, '60m', '6.59s', '2026-02-01', '2026 Indoor Season PR', 'Houston, TX', true, 'verified', 'https://tx.milesplit.com/athletes/15635072-dillon-mitchell');

  RAISE NOTICE 'Added 5 PRs!';

  RAISE NOTICE '=== Dillon Mitchell Account Created ===';
  RAISE NOTICE 'Email: lukebusateri@gmail.com';
  RAISE NOTICE 'Password: Test321';
  RAISE NOTICE 'PRs: 100m (9.88s), 200m (20.22s), 400m (49.82s), 55m (6.17s), 60m (6.59s)';
  RAISE NOTICE 'MileSplit: https://tx.milesplit.com/athletes/15635072-dillon-mitchell';

END $$;
