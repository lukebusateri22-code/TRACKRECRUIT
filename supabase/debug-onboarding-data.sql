-- Debug onboarding data persistence
-- Run this to see if data is actually being saved

-- 1. Check all profiles
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.role,
  ap.school_name,
  ap.graduation_year,
  ap.location,
  ap.state,
  COUNT(pr.id) as pr_count
FROM public.profiles p
LEFT JOIN public.athlete_profiles ap ON ap.profile_id = p.id
LEFT JOIN public.personal_records pr ON pr.athlete_profile_id = ap.id
WHERE p.role = 'athlete'
GROUP BY p.id, p.email, p.first_name, p.last_name, p.role, ap.school_name, ap.graduation_year, ap.location, ap.state
ORDER BY p.created_at DESC
LIMIT 10;

-- 2. Check recent athlete profiles
SELECT * FROM public.athlete_profiles
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check recent PRs
SELECT 
  pr.*,
  ap.school_name
FROM public.personal_records pr
JOIN public.athlete_profiles ap ON ap.id = pr.athlete_profile_id
ORDER BY pr.created_at DESC
LIMIT 20;
