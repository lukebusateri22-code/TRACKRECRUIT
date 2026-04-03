-- ============================================
-- RUN THESE ONE AT A TIME IN SUPABASE SQL EDITOR
-- Copy and paste each section separately
-- ============================================

-- STEP 1: Add high_school column
-- Copy and run this first:
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS high_school TEXT;

-- STEP 2: Add index (run after step 1)
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_high_school ON athlete_profiles(high_school);

-- STEP 3: Check if your user exists (run this to see your user ID)
SELECT id, email FROM auth.users WHERE email = 'lukebusateri22@gmail.com';

-- STEP 4: If you see your user ID above, copy it and use it below
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from step 3
-- Then run this:
/*
INSERT INTO profiles (user_id, email, role)
VALUES (
    'YOUR_USER_ID_HERE',
    'lukebusateri22@gmail.com',
    'admin'
)
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin';
*/

-- STEP 5: Verify it worked
SELECT 
    u.id,
    u.email,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'lukebusateri22@gmail.com';

-- STEP 6: Verify high_school column exists
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'athlete_profiles' 
AND column_name = 'high_school';
