-- TEMPORARILY DISABLE TRIGGER TO TEST SIGNUP
-- Run this to see if signup works without trigger

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

SELECT 'Trigger disabled - test signup now' as status;
