# Admin Dashboard - Complete Breakdown

## Overview
**File:** `app/admin/page.tsx`
**Status:** ✅ FULLY BUILT with mock data
**Access:** Protected by RoleGuard (admin role only)

## Features

### 1. Navigation & Header
- Dark theme (gray-900 background, yellow accents)
- Shield icon + "ADMIN DASHBOARD" title
- Links: Back to Site, Logout
- Logout clears localStorage and redirects to home

### 2. Tab System
Four main tabs with state management:

#### Tab 1: Overview
**Stats Cards:**
- Total Users: 2,847
- Athletes: 2,156
- Coaches: 691
- Verified Users: 2,103
- Pending Verification: 127
- Active Today: 456
- Messages (24h): 1,234
- Profile Views: 8,932

**Charts:**
- User Growth Chart (placeholder)
- Activity Metrics (placeholder)

#### Tab 2: User Management
**Features:**
- Search bar for users
- User table with columns:
  - Name
  - Role (athlete/coach)
  - Email
  - Status (verified/pending)
  - Joined date
  - Actions (View, Suspend)

**Mock Users:**
- Jordan Davis (athlete, verified)
- Coach Williams (coach, pending)
- Sarah Johnson (athlete, verified)
- Coach Martinez (coach, verified)
- Marcus Lee (athlete, pending)

#### Tab 3: Content Moderation
**Flagged Content Table:**
- Type (profile/message)
- User
- Reason
- Severity (high/medium/low)
- Date
- Actions (Review, Dismiss, Ban User)

**Mock Flags:**
- John Smith - Inappropriate content (high)
- Coach Brown - Spam (medium)
- Emily Chen - Fake credentials (high)

#### Tab 4: Analytics
**Metrics:**
- Platform activity trends
- User engagement stats
- Popular features
- Geographic distribution

**Status:** Placeholder content

## Current Implementation

### What's Built ✅
1. Complete UI/UX with tabs
2. Mock data for all sections
3. RoleGuard protection
4. Responsive design
5. Action buttons (non-functional)
6. Search functionality (UI only)

### What's NOT Built ❌
1. Real database queries
2. User management actions (suspend, ban)
3. Content moderation workflow
4. Analytics data fetching
5. Charts/graphs implementation
6. Bulk actions
7. Export functionality
8. Email notifications

## Database Requirements

### Tables Needed
```sql
-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  permissions TEXT[] DEFAULT ARRAY['read', 'write', 'moderate'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flagged content table
CREATE TABLE flagged_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT, -- 'profile', 'message', 'post'
  content_id UUID,
  user_id UUID REFERENCES auth.users(id),
  reason TEXT,
  severity TEXT, -- 'low', 'medium', 'high'
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'dismissed'
  flagged_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User actions log
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  action_type TEXT, -- 'suspend', 'ban', 'verify', 'delete'
  target_user_id UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## How to Access Admin Page

### Method 1: Set Admin Role in Database
```sql
-- Run in Supabase SQL Editor
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'lukebusateri22@gmail.com';
```

### Method 2: Master Login (Development)
```javascript
// Run in browser console
localStorage.setItem('masterLogin', 'true')
localStorage.setItem('userRole', 'admin')
// Then navigate to /admin
```

### Method 3: Run Setup SQL
```sql
-- File: supabase/migrations/URGENT_RUN_IN_DASHBOARD.sql
-- Already includes admin setup for lukebusateri22@gmail.com
```

## Testing the Admin Page

### Step 1: Set Admin Access
```sql
-- In Supabase SQL Editor
UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL';
```

### Step 2: Navigate to Admin Page
```
http://localhost:3001/admin
```

### Step 3: Test Features
- ✅ Click through all 4 tabs
- ✅ Check stats display correctly
- ✅ Search bar (UI only)
- ✅ Action buttons (non-functional)
- ✅ Logout functionality

## Next Steps to Make Functional

### Phase 1: Real Data Integration
1. Query actual user counts from database
2. Fetch real user list from profiles table
3. Display actual flagged content
4. Show real activity metrics

### Phase 2: User Management
1. Implement suspend user action
2. Implement ban user action
3. Add user verification workflow
4. Add bulk actions

### Phase 3: Content Moderation
1. Create flagging system for users
2. Implement review workflow
3. Add auto-moderation rules
4. Email notifications for actions

### Phase 4: Analytics
1. Integrate chart library (Chart.js or Recharts)
2. Query activity data from database
3. Add date range filters
4. Export reports functionality

## Code Structure

```tsx
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Mock data
  const stats = { ... }
  const recentUsers = [ ... ]
  const flaggedContent = [ ... ]
  
  return (
    <RoleGuard allowedRole="admin">
      {/* Header */}
      {/* Tab Navigation */}
      {/* Tab Content */}
    </RoleGuard>
  )
}
```

## Security Considerations

### Current Security ✅
- RoleGuard prevents non-admin access
- Role stored in database (profiles.role)
- Auth context validates user

### Additional Security Needed ⚠️
- Row Level Security (RLS) policies for admin tables
- Audit logging for all admin actions
- IP whitelisting for admin access
- Two-factor authentication
- Session timeout for admin users

## Summary

**Status:** Admin page is **fully built** with comprehensive UI but uses **mock data**

**To Make Functional:**
1. Run SQL to set your email as admin
2. Create admin-specific database tables
3. Replace mock data with real queries
4. Implement action handlers
5. Add analytics integration

**Current Capabilities:**
- ✅ View mock stats
- ✅ Browse mock users
- ✅ See mock flagged content
- ✅ Navigate between tabs
- ❌ No real actions work yet

**Recommended Priority:**
1. Set admin role for your email
2. Test page access
3. Implement real user list query
4. Add suspend/ban functionality
5. Build flagging system
