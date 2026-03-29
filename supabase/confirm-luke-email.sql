-- Confirm Luke's email so he can login
-- This marks the email as confirmed in auth.users

UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'lukebusateri22@gmail.com';

SELECT 'Email confirmed! You can now login.' as message;
