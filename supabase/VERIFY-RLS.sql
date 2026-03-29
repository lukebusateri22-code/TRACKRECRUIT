-- Verify RLS policies are actually applied
-- Run this to see what policies exist

-- Check profiles policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('profiles', 'athlete_profiles', 'personal_records')
ORDER BY tablename, policyname;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename IN ('profiles', 'athlete_profiles', 'personal_records')
AND schemaname = 'public';

-- Try to select as current user
SELECT 'Testing profile access...' as test;
SELECT id, email, role FROM profiles WHERE user_id = auth.uid();
