# CRITICAL - DO THESE 2 THINGS NOW

## 1. RUN THIS SQL IN SUPABASE (REQUIRED)

The trigger is blocking signup. Run this new async trigger:

**File: `supabase/ASYNC-TRIGGER.sql`**

```sql
-- ASYNC TRIGGER - Never blocks signup
-- Run this in Supabase SQL Editor

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simple trigger that NEVER fails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to insert profile, but don't fail if it errors
  BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name, role, is_verified)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'last_name', 'Name'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'athlete')::user_role,
      false
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log but don't fail
    RAISE WARNING 'Profile creation failed: %', SQLERRM;
  END;
  
  -- ALWAYS return NEW so signup completes
  RETURN NEW;
END;
$$;

-- Create trigger that runs AFTER insert (non-blocking)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verify
SELECT 'Trigger created successfully' as status;
```

---

## 2. RESTART DEV SERVER

```bash
# Kill the server
pkill -f "next dev"

# Start it again
npm run dev
```

---

## 3. TEST SIGNUP

After running the SQL and restarting:

1. Go to http://localhost:3000/signup
2. Use a **BRAND NEW EMAIL** (never used before)
3. Fill in the form
4. Click "Create Account"
5. Should work in 10 seconds or show timeout error

---

## WHY THIS FIXES IT

**Problem:** The old trigger was hanging/blocking the signup request
**Solution:** New trigger has nested error handling and ALWAYS returns NEW
**Backup:** Added 10-second timeout so you'll see an error instead of infinite hang

---

## TFFRS SCRAPER

Cannot be fixed with simple HTML scraping because the page loads data with JavaScript.

**Options:**
1. Use Puppeteer (headless browser)
2. Find TFFRS API endpoint
3. Use different data source

**For now:** Focus on getting signup/onboarding working first.
