-- Create profiles for all users who signed up
-- Run this in Supabase SQL Editor

-- First, see all users without profiles
SELECT 
  u.id as user_id,
  u.email,
  u.raw_user_meta_data->>'first_name' as first_name,
  u.raw_user_meta_data->>'last_name' as last_name,
  u.raw_user_meta_data->>'role' as role,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;

-- Create profiles for ALL users who don't have one
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'first_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'last_name', 'Name'),
  COALESCE(u.raw_user_meta_data->>'role', 'athlete')::user_role,
  false
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Verify all users now have profiles
SELECT 
  u.id as user_id,
  u.email,
  p.id as profile_id,
  p.role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- Show the result
SELECT 'Profiles created successfully. All users now have profiles.' as status;
