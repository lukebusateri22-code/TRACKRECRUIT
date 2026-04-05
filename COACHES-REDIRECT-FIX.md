# Coaches Page Redirect Issue - Investigation

## Problem
Coaches are getting redirected to the home page when clicking buttons on the coaches dashboard.

## Root Cause
The `RoleGuard` component is checking authentication via the `useAuth()` context. When auth state is unclear or there's an auth lock conflict, it redirects users.

**Specific Issues:**
1. **Auth Context Lock Conflicts** - Multiple Supabase clients competing for auth token
2. **Profile Fetch Failures** - If `fetchProfile()` fails, `profile` is null, triggering redirect
3. **Master Login Bypass** - Uses localStorage which can be cleared

## Current Flow
```
Coach Dashboard Page
  ↓
RoleGuard (allowedRole="coach")
  ↓
useAuth() - checks profile.role
  ↓
If profile is null or wrong role → REDIRECT
```

## Fix Options

### Option 1: Disable Auth Lock Issues (Quick Fix)
Create unauthenticated Supabase client for coaches pages like we did for athletes:

```tsx
// In coaches dashboard
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
)
```

### Option 2: Fix RoleGuard (Better Fix)
Add better error handling and logging to RoleGuard:

```tsx
useEffect(() => {
  console.log('🔍 RoleGuard Check:', { 
    profile, 
    authLoading, 
    allowedRole,
    userRole: profile?.role 
  })
  
  // Add timeout to prevent infinite checking
  const timeout = setTimeout(() => {
    if (isChecking) {
      console.error('RoleGuard timeout - forcing authorization')
      setIsAuthorized(true)
      setIsChecking(false)
    }
  }, 5000)
  
  return () => clearTimeout(timeout)
}, [profile, authLoading])
```

### Option 3: Use Master Login for Development
Set localStorage values to bypass auth:

```javascript
localStorage.setItem('masterLogin', 'true')
localStorage.setItem('userRole', 'coach')
```

## Recommended Solution
Combine Option 1 + Option 2:
1. Fix auth lock issues in auth context
2. Add timeout to RoleGuard
3. Add detailed logging to debug redirects
4. Consider removing RoleGuard for development

## Testing Steps
1. Open browser console
2. Navigate to `/coaches/dashboard`
3. Check console logs for RoleGuard checks
4. Click any button/link
5. Watch for redirect triggers in console
