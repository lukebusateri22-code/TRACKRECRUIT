# Critical Fixes Required

## 1. Add Missing Database Column

Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql):

```sql
-- Add missing high_school column to athlete_profiles
ALTER TABLE athlete_profiles 
ADD COLUMN IF NOT EXISTS high_school TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_athlete_profiles_high_school 
ON athlete_profiles(high_school);
```

## 2. Set Up Admin Access

Run this SQL to make lukebusateri22@gmail.com an admin:

```sql
-- First, find the user ID
SELECT id, email FROM auth.users WHERE email = 'lukebusateri22@gmail.com';

-- Then update the profile (replace USER_ID with the actual ID from above)
UPDATE profiles 
SET role = 'admin' 
WHERE user_id = 'USER_ID';
```

## 3. Clear Old Test Profiles

Run this SQL to clear test data:

```sql
-- Delete all profiles except lukebusateri22@gmail.com
DELETE FROM athlete_profiles 
WHERE profile_id IN (
  SELECT id FROM profiles 
  WHERE user_id NOT IN (
    SELECT id FROM auth.users WHERE email = 'lukebusateri22@gmail.com'
  )
);

DELETE FROM coach_profiles 
WHERE profile_id IN (
  SELECT id FROM profiles 
  WHERE user_id NOT IN (
    SELECT id FROM auth.users WHERE email = 'lukebusateri22@gmail.com'
  )
);

DELETE FROM profiles 
WHERE user_id NOT IN (
  SELECT id FROM auth.users WHERE email = 'lukebusateri22@gmail.com'
);

-- Delete auth users except lukebusateri22@gmail.com
-- Note: This requires admin access in Supabase dashboard
-- Go to Authentication > Users and manually delete test users
```

## 4. After Running SQL

1. Restart the frontend dev server
2. Clear browser cache
3. Try signing up as athlete again
4. Login as admin with lukebusateri22@gmail.com
