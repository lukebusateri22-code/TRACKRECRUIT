# Athlete Signup Flow - Deep Dive Analysis

## Complete Signup Flow

### 1. Signup Page (`/signup`)
**File:** `app/signup/page.tsx`

**Flow:**
```
User fills form → signUp() called → Creates auth.users entry → Triggers database function → Creates profile → Redirects to onboarding
```

**Key Code:**
```tsx
const result = await signUp(formData.email, formData.password, {
  first_name: formData.firstName,
  last_name: formData.lastName,
  role: userType  // 'athlete' or 'coach'
})

// Redirects to:
if (userType === 'athlete') {
  router.push('/athletes/onboarding')
} else {
  router.push('/coaches/complete-profile')
}
```

**Current Issues:**
- ❌ Auth lock timeout during signup (NavigatorLockAcquireTimeoutError)
- ❌ Redirect fails due to auth lock conflicts
- ⚠️ User account is created but redirect doesn't work

**Workaround:**
1. Sign up (will timeout)
2. Manually navigate to `/athletes/onboarding`
3. Complete onboarding

---

### 2. Onboarding Page (`/athletes/onboarding`)
**File:** `app/athletes/onboarding/page.tsx`

**4-Step Process:**

#### Step 1: Basic Information
- First Name, Last Name
- High School
- Graduation Year
- Email, Phone

#### Step 2: Academic Information
- GPA
- ACT Score
- SAT Score
- Academic Documents Upload (optional)

#### Step 3: Athletic Information
- Event Specialties (checkboxes)
- Personal Records (JSON format)
- MileSplit Profile Link

#### Step 4: Bio & Preferences
- Bio/About Me
- Preferred Contact Method

**Database Insert:**
```tsx
const athleteData = {
  profile_id: profileId,
  high_school: formData.highSchool,
  graduation_year: parseInt(formData.graduationYear),
  event_specialties: formData.eventSpecialties,
  personal_records: formData.personalRecords,
  gpa: parseFloat(formData.gpa),
  act_score: parseInt(formData.act),
  sat_score: parseInt(formData.sat),
  has_verified_academics: !!formData.academicDocuments,
  phone_number: formData.phoneNumber,
  contact_email: formData.email,
  preferred_contact: formData.preferredContact,
  bio: formData.bio,
  onboarding_completed: true
}

await supabase
  .from('athlete_profiles')
  .upsert(athleteData, { onConflict: 'profile_id' })
```

**Required Database Columns:**
All columns exist after running `ADD_MISSING_ATHLETE_COLUMNS.sql`:
- ✅ profile_id
- ✅ high_school
- ✅ graduation_year
- ✅ event_specialties (TEXT[])
- ✅ personal_records (JSONB)
- ✅ gpa (DECIMAL)
- ✅ act_score (INTEGER)
- ✅ sat_score (INTEGER)
- ✅ has_verified_academics (BOOLEAN)
- ✅ phone_number (TEXT)
- ✅ contact_email (TEXT)
- ✅ preferred_contact (TEXT)
- ✅ bio (TEXT)
- ✅ onboarding_completed (BOOLEAN)

---

### 3. Database Triggers
**File:** `supabase/migrations/create_profiles_on_signup.sql` (assumed)

**Trigger Flow:**
```sql
-- When user signs up in auth.users
-- Trigger creates entry in profiles table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function extracts metadata and creates profile
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Issues & Fixes

### Issue 1: Auth Lock Timeout ❌
**Problem:** Multiple Supabase clients competing for auth token lock

**Root Cause:**
```tsx
// In auth-context.tsx
const supabase = createClient() // Created on every render
```

**Fix:** Use singleton Supabase client or disable auth for public pages

**Status:** Workaround available (close other tabs before signup)

---

### Issue 2: Missing Database Columns ✅ FIXED
**Problem:** `event_specialties` and other columns didn't exist

**Fix:** Run SQL migration:
```sql
-- File: supabase/migrations/ADD_MISSING_ATHLETE_COLUMNS.sql
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS event_specialties TEXT[];
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS personal_records JSONB;
-- ... (11 total columns)
```

**Status:** ✅ SQL provided, user needs to run in Supabase dashboard

---

### Issue 3: Redirect After Signup ❌
**Problem:** After signup, redirect to onboarding fails

**Root Cause:** Auth lock timeout prevents navigation

**Workaround:**
1. Sign up (ignore timeout error)
2. Manually go to `/athletes/onboarding`
3. Complete onboarding

---

## Testing Checklist

### Test Signup Flow
- [ ] Navigate to `/signup`
- [ ] Select "I'm an Athlete"
- [ ] Fill in all fields
- [ ] Click "Create Account"
- [ ] Check for timeout error
- [ ] Manually navigate to `/athletes/onboarding`

### Test Onboarding Flow
- [ ] Step 1: Fill basic info
- [ ] Step 2: Fill academic info
- [ ] Step 3: Select events, add PRs
- [ ] Step 4: Write bio
- [ ] Click "Complete Setup"
- [ ] Verify redirect to `/athletes` dashboard

### Verify Database
```sql
-- Check profile was created
SELECT * FROM profiles WHERE email = 'test@example.com';

-- Check athlete profile was created
SELECT * FROM athlete_profiles WHERE profile_id = 'USER_ID_HERE';

-- Verify onboarding_completed = true
SELECT onboarding_completed FROM athlete_profiles WHERE profile_id = 'USER_ID_HERE';
```

---

## Recommendations

### Short Term
1. ✅ Run `ADD_MISSING_ATHLETE_COLUMNS.sql` in Supabase
2. ⚠️ Use workaround for signup (manual navigation)
3. ✅ Test onboarding flow end-to-end

### Long Term
1. Fix auth lock issue by refactoring auth context
2. Add better error handling in signup
3. Add loading states during onboarding
4. Add validation for personal records JSON
5. Add image upload for profile picture
6. Add email verification flow

---

## SQL to Run

**File:** `supabase/migrations/ADD_MISSING_ATHLETE_COLUMNS.sql`

```sql
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS event_specialties TEXT[];
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS personal_records JSONB;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS gpa DECIMAL(3,2);
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS act_score INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS sat_score INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS has_verified_academics BOOLEAN DEFAULT false;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS preferred_contact TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE athlete_profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
```

**Status:** Ready to run in Supabase SQL Editor
