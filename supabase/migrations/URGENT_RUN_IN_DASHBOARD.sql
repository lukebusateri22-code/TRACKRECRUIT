-- ============================================
-- URGENT: Run this in Supabase SQL Editor
-- ============================================

-- 1. Add missing high_school column to athlete_profiles
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS high_school TEXT;

CREATE INDEX IF NOT EXISTS idx_athlete_profiles_high_school 
ON athlete_profiles(high_school);

-- 2. Set lukebusateri22@gmail.com as admin
-- First, let's see the user
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID for lukebusateri22@gmail.com
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'lukebusateri22@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Update or insert profile with admin role
        INSERT INTO profiles (user_id, email, role)
        VALUES (
            admin_user_id,
            'lukebusateri22@gmail.com',
            'admin'
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'admin';
        
        RAISE NOTICE 'Admin role set for lukebusateri22@gmail.com';
    ELSE
        RAISE NOTICE 'User lukebusateri22@gmail.com not found - they need to sign up first';
    END IF;
END $$;

-- 3. Clean up old test profiles (CAREFUL - this deletes data!)
-- Uncomment the section below ONLY if you want to delete test data

/*
-- Delete athlete profiles for non-admin users
DELETE FROM athlete_profiles 
WHERE profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id IN (
        SELECT id FROM auth.users 
        WHERE email != 'lukebusateri22@gmail.com'
    )
);

-- Delete coach profiles for non-admin users
DELETE FROM coach_profiles 
WHERE profile_id IN (
    SELECT id FROM profiles 
    WHERE user_id IN (
        SELECT id FROM auth.users 
        WHERE email != 'lukebusateri22@gmail.com'
    )
);

-- Delete profiles for non-admin users
DELETE FROM profiles 
WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email != 'lukebusateri22@gmail.com'
);
*/

-- 4. Verify the changes
SELECT 
    'athlete_profiles columns' as check_type,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'athlete_profiles'
AND column_name = 'high_school';

SELECT 
    'admin user' as check_type,
    u.email,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'lukebusateri22@gmail.com';
