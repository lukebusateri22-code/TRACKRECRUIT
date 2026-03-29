-- Manually create profile for user who just signed up
-- Replace the user_id with the actual ID from console logs

-- First, find the user ID from recent signup
SELECT id, email, raw_user_meta_data 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Then create profile (replace USER_ID_HERE with actual ID)
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
VALUES (
  'fff7b693-bc1f-4ba1-b40d-c08f84de15f9', -- Replace with actual user ID
  'lukebusateri225@gmail.com',
  'Luke',
  'Busateri',
  'athlete'::user_role,
  false
)
ON CONFLICT (user_id) DO NOTHING;

-- Verify profile was created
SELECT * FROM public.profiles WHERE user_id = 'fff7b693-bc1f-4ba1-b40d-c08f84de15f9';
