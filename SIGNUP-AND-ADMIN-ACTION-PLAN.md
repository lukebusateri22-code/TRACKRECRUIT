# Signup & Admin Page - Action Plan

## Current Status

### Athlete Signup Issues
1. ❌ **Auth lock timeout** - NavigatorLockAcquireTimeoutError during signup
2. ❌ **Redirect fails** - User stuck on signup page after account creation
3. ⚠️ **Workaround required** - Manual navigation to onboarding
4. ✅ **Onboarding page works** - All 4 steps functional
5. ✅ **Database columns exist** - ADD_MISSING_ATHLETE_COLUMNS.sql run

### Admin Page Status
1. ✅ **UI fully built** - All tabs, mock data, styling complete
2. ❌ **No real data** - Everything uses mock/placeholder data
3. ❌ **No actions work** - View, Suspend, Ban buttons don't do anything
4. ❌ **No admin role check** - Need to set admin role in database
5. ⚠️ **RoleGuard protection** - Works but needs admin role set

---

## Priority 1: Fix Athlete Signup Flow

### Issue: Auth Lock Timeout
**Root Cause:** Multiple Supabase client instances competing for auth lock

**Solution:**
1. Use single Supabase client instance
2. Add error handling for timeout
3. Improve redirect logic with session check

### Changes Needed:

#### 1. Update `lib/auth/auth-context.tsx`
```tsx
// Add timeout handling
const signUp = async (email: string, password: string, metadata: any) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    
    // Wait for session to be established
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return data
  } catch (error: any) {
    if (error.message?.includes('lock')) {
      // Retry once on lock timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      return signUp(email, password, metadata)
    }
    throw error
  }
}
```

#### 2. Update `app/signup/page.tsx`
```tsx
// Better redirect with session check
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setLoading(true)

  try {
    await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: userType
    })
    
    // Wait for profile creation trigger
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Force reload to get fresh session
    window.location.href = userType === 'athlete' 
      ? '/athletes/onboarding' 
      : '/coaches/complete-profile'
      
  } catch (err: any) {
    console.error('Signup error:', err)
    setError(err.message || 'Failed to create account')
    setLoading(false)
  }
}
```

---

## Priority 2: Complete Admin Page Functionality

### What Needs to Be Built

#### 1. Real User Data Integration
**File:** `app/admin/page.tsx`

**Changes:**
- Fetch real users from `profiles` table
- Show actual athlete/coach counts
- Display real verification status
- Show actual join dates

**API Calls:**
```tsx
// Fetch all users
const { data: users } = await supabase
  .from('profiles')
  .select('*, athlete_profiles(*), coach_profiles(*)')
  .order('created_at', { ascending: false })

// Get stats
const { count: totalUsers } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true })

const { count: athletes } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true })
  .eq('role', 'athlete')
```

#### 2. User Actions
**Implement:**
- ✅ View user profile (modal or redirect)
- ✅ Suspend user (update status in database)
- ✅ Ban user (soft delete or flag)
- ✅ Search/filter users

#### 3. Content Moderation
**Create:**
- `flagged_content` table
- Report submission system
- Review/dismiss actions
- Ban user from flagged content

#### 4. Analytics
**Implement:**
- Real activity tracking
- User engagement metrics
- Popular features tracking
- Geographic data (if available)

---

## Implementation Steps

### Step 1: Fix Signup (30 min)
1. ✅ Update auth-context with retry logic
2. ✅ Update signup page with better redirect
3. ✅ Test signup flow end-to-end
4. ✅ Verify onboarding works after signup

### Step 2: Set Admin Role (5 min)
```sql
-- Run in Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'lukebusateri22@gmail.com';
```

### Step 3: Admin User Management (45 min)
1. ✅ Fetch real users from database
2. ✅ Display in table with real data
3. ✅ Implement search functionality
4. ✅ Add view user modal
5. ✅ Add suspend user action
6. ✅ Add ban user action

### Step 4: Admin Stats Dashboard (30 min)
1. ✅ Calculate real user counts
2. ✅ Show verification stats
3. ✅ Display activity metrics
4. ✅ Add refresh button

### Step 5: Content Moderation (60 min)
1. ✅ Create flagged_content table
2. ✅ Add report system
3. ✅ Build review interface
4. ✅ Implement actions

---

## Database Changes Needed

### 1. Add Admin Role Support
```sql
-- Already exists in profiles table
-- Just need to set role = 'admin' for admin users
```

### 2. Create Flagged Content Table
```sql
CREATE TABLE flagged_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT NOT NULL, -- 'profile', 'message', 'post'
  content_id UUID NOT NULL,
  reporter_id UUID REFERENCES profiles(id),
  reported_user_id UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  severity TEXT NOT NULL, -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'dismissed'
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flagged_content_status ON flagged_content(status);
CREATE INDEX idx_flagged_content_reported_user ON flagged_content(reported_user_id);
```

### 3. Add User Status Field
```sql
-- Add status to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
-- 'active', 'suspended', 'banned'

CREATE INDEX idx_profiles_status ON profiles(status);
```

---

## Testing Checklist

### Signup Flow
- [ ] Sign up as athlete
- [ ] Verify no timeout error
- [ ] Confirm redirect to onboarding
- [ ] Complete all 4 onboarding steps
- [ ] Verify data saved to athlete_profiles
- [ ] Sign up as coach
- [ ] Verify redirect to coach profile completion

### Admin Page
- [ ] Set admin role in database
- [ ] Access /admin page
- [ ] Verify real user data loads
- [ ] Test search functionality
- [ ] View user profile
- [ ] Suspend a user
- [ ] Verify suspended user can't login
- [ ] Ban a user
- [ ] Test content moderation
- [ ] Review flagged content

---

## Files to Modify

1. `lib/auth/auth-context.tsx` - Add retry logic
2. `app/signup/page.tsx` - Better redirect
3. `app/admin/page.tsx` - Real data integration
4. `supabase/migrations/create_admin_tables.sql` - New tables
5. `app/api/admin/` - Admin API routes (if needed)

---

## Expected Timeline

- **Signup Fix:** 30 minutes
- **Admin Setup:** 5 minutes
- **Admin User Management:** 45 minutes
- **Admin Stats:** 30 minutes
- **Content Moderation:** 60 minutes

**Total:** ~3 hours

---

## Success Criteria

### Signup
✅ No timeout errors
✅ Smooth redirect to onboarding
✅ Profile created automatically
✅ Onboarding completes successfully

### Admin Page
✅ Real user data displayed
✅ Search works
✅ User actions functional
✅ Stats accurate
✅ Content moderation operational
