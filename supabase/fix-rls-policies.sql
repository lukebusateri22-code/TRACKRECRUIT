-- Fix RLS policies for onboarding saves
-- Run in Supabase SQL Editor

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ATHLETE PROFILES
ALTER TABLE public.athlete_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "athlete_profiles_select_own" ON public.athlete_profiles;
DROP POLICY IF EXISTS "athlete_profiles_insert_own" ON public.athlete_profiles;
DROP POLICY IF EXISTS "athlete_profiles_update_own" ON public.athlete_profiles;

CREATE POLICY "athlete_profiles_select_own"
ON public.athlete_profiles
FOR SELECT
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "athlete_profiles_insert_own"
ON public.athlete_profiles
FOR INSERT
TO authenticated
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "athlete_profiles_update_own"
ON public.athlete_profiles
FOR UPDATE
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- COACH PROFILES
ALTER TABLE public.coach_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "coach_profiles_select_own" ON public.coach_profiles;
DROP POLICY IF EXISTS "coach_profiles_insert_own" ON public.coach_profiles;
DROP POLICY IF EXISTS "coach_profiles_update_own" ON public.coach_profiles;

CREATE POLICY "coach_profiles_select_own"
ON public.coach_profiles
FOR SELECT
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "coach_profiles_insert_own"
ON public.coach_profiles
FOR INSERT
TO authenticated
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "coach_profiles_update_own"
ON public.coach_profiles
FOR UPDATE
TO authenticated
USING (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- PERSONAL RECORDS
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "personal_records_select_own" ON public.personal_records;
DROP POLICY IF EXISTS "personal_records_insert_own" ON public.personal_records;

CREATE POLICY "personal_records_select_own"
ON public.personal_records
FOR SELECT
TO authenticated
USING (
  athlete_profile_id IN (
    SELECT ap.id
    FROM public.athlete_profiles ap
    JOIN public.profiles p ON p.id = ap.profile_id
    WHERE p.user_id = auth.uid()
  )
);

CREATE POLICY "personal_records_insert_own"
ON public.personal_records
FOR INSERT
TO authenticated
WITH CHECK (
  athlete_profile_id IN (
    SELECT ap.id
    FROM public.athlete_profiles ap
    JOIN public.profiles p ON p.id = ap.profile_id
    WHERE p.user_id = auth.uid()
  )
);
