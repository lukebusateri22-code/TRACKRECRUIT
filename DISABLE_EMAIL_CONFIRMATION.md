# Disable Email Confirmation in Supabase

You're hitting the email rate limit. To fix this for development:

## Steps:

1. Go to your Supabase dashboard
2. Click **Authentication** in the left sidebar
3. Click **Providers**
4. Find **Email** provider
5. Click to expand it
6. **Uncheck** "Confirm email"
7. Click **Save**

This will allow users to sign up without needing to confirm their email during development.

## Alternative: Clear Rate Limit

If you want to keep email confirmation:
1. Wait 1 hour for the rate limit to reset
2. Or use different email addresses for testing
3. Or upgrade to a paid Supabase plan (higher limits)

For now, just disable email confirmation so you can test the signup flow.
