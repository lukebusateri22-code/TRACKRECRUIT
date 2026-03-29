-- Add Master Users for Testing
-- These users will bypass normal authentication and have direct access

-- First, clean up any existing test users
DELETE FROM profiles WHERE email IN ('testathlete@gmail.com', 'testcoach@gmail.com');

-- Create Master Athlete User
INSERT INTO profiles (
  id,
  user_id,
  email,
  role,
  is_verified,
  created_at,
  updated_at,
  first_name,
  last_name,
  full_name
) VALUES (
  gen_random_uuid(),
  'master-athlete-id',
  'testathlete@gmail.com',
  'athlete',
  true,
  NOW(),
  NOW(),
  'Test',
  'Athlete',
  'Test Athlete'
);

-- Create Master Coach User
INSERT INTO profiles (
  id,
  user_id,
  email,
  role,
  is_verified,
  created_at,
  updated_at,
  first_name,
  last_name,
  full_name
) VALUES (
  gen_random_uuid(),
  'master-coach-id',
  'testcoach@gmail.com',
  'coach',
  true,
  NOW(),
  NOW(),
  'Test',
  'Coach',
  'Test Coach'
);

-- Create athlete profile for master athlete
INSERT INTO athlete_profiles (
  id,
  profile_id,
  graduation_year,
  GPA,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'testathlete@gmail.com'),
  2025,
  3.5,
  NOW(),
  NOW()
);

-- Create coach profile for master coach
INSERT INTO coach_profiles (
  id,
  profile_id,
  school_name,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM profiles WHERE email = 'testcoach@gmail.com'),
  'Test University',
  NOW(),
  NOW()
);

-- Verify the users were created
SELECT 
  p.email,
  p.role,
  p.is_verified,
  CASE 
    WHEN ap.id IS NOT NULL THEN 'Athlete Profile Created'
    WHEN cp.id IS NOT NULL THEN 'Coach Profile Created'
    ELSE 'No Profile'
  END as profile_status
FROM profiles p
LEFT JOIN athlete_profiles ap ON p.id = ap.profile_id
LEFT JOIN coach_profiles cp ON p.id = cp.profile_id
WHERE p.email IN ('testathlete@gmail.com', 'testcoach@gmail.com');
