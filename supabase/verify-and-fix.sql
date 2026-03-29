-- Step 1: Check if trigger exists
SELECT 
  t.tgname as trigger_name,
  p.proname as function_name,
  'Trigger exists' as status
FROM pg_trigger t
JOIN pg_proc p ON p.oid = t.tgfoid
WHERE t.tgname = 'on_auth_user_created';

-- Step 2: Check if there are any auth users without profiles
SELECT 
  au.id as user_id,
  au.email,
  au.raw_user_meta_data->>'role' as role,
  p.id as profile_id,
  CASE WHEN p.id IS NULL THEN 'MISSING PROFILE' ELSE 'Has profile' END as status
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
ORDER BY au.created_at DESC
LIMIT 10;

-- Step 3: Manually create profiles for users that are missing them
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'Name'),
  COALESCE((au.raw_user_meta_data->>'role')::user_role, 'athlete'::user_role),
  false
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Step 4: Verify all users now have profiles
SELECT 
  COUNT(*) as users_without_profiles
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.id IS NULL;
