-- Cleanup Script - Remove All Test Data
-- This will delete ALL data from your database so you can start fresh
-- WARNING: This cannot be undone!

-- Delete in correct order to respect foreign key constraints

-- 1. Delete favorite schools
DELETE FROM favorite_schools;

-- 2. Delete unlocked schools
DELETE FROM unlocked_schools;

-- 3. Delete recruiting standards
DELETE FROM recruiting_standards;

-- 4. Delete schools
DELETE FROM schools;

-- 5. Delete messages
DELETE FROM messages;

-- 6. Delete watchlist
DELETE FROM watchlist;

-- 7. Delete videos
DELETE FROM videos;

-- 8. Delete meet results
DELETE FROM meet_results;

-- 9. Delete personal records
DELETE FROM personal_records;

-- 10. Delete verification requests
DELETE FROM verification_requests;

-- 11. Delete coach profiles
DELETE FROM coach_profiles;

-- 12. Delete athlete profiles
DELETE FROM athlete_profiles;

-- 13. Delete profiles (but NOT from auth.users - those need to be deleted manually)
DELETE FROM profiles;

-- Note: To delete auth users, go to Supabase Dashboard > Authentication > Users
-- and manually delete users there, OR run this if you have permission:
-- DELETE FROM auth.users;

SELECT 'All data cleaned successfully!' as message;
SELECT 'Go to Authentication > Users to delete auth users manually' as next_step;
