# 🚨 CRITICAL FIX - RUN THIS SQL NOW

## Problem Identified

**Onboarding Error:** `406 (Not Acceptable)` when trying to read profiles

**Root Cause:** RLS (Row Level Security) policies are blocking users from reading their own profiles

---

## ✅ SOLUTION - Run This SQL

Copy and paste this into Supabase SQL Editor and click "Run":

```sql
-- Fix RLS policies - users can't read their own profiles (406 error)

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies that actually work
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also fix athlete_profiles
DROP POLICY IF EXISTS "Users can view own athlete profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Users can update own athlete profile" ON athlete_profiles;
DROP POLICY IF EXISTS "Users can insert own athlete profile" ON athlete_profiles;

CREATE POLICY "Users can view own athlete profile"
  ON athlete_profiles FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own athlete profile"
  ON athlete_profiles FOR UPDATE
  USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own athlete profile"
  ON athlete_profiles FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

SELECT 'RLS policies fixed' as status;
```

---

## After Running SQL

1. **Refresh onboarding page**
2. **Click "Complete Setup"**
3. Should now work - profile query will succeed

---

## TFFRS Fix

Increased wait time to 15 seconds for tables to load. Test at `http://localhost:3000/test-tffrs` after fixing onboarding.

---

**Run the SQL above first.** This is the critical blocker for onboarding.
