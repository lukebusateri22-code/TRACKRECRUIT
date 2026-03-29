# Role Guard Implementation Guide

## Pages That Need RoleGuard

### Athlete Pages (require 'athlete' role):
1. /app/athletes/page.tsx
2. /app/athletes/edit/page.tsx
3. /app/athletes/profile/page.tsx
4. /app/athletes/meets/page.tsx
5. /app/athletes/rankings/page.tsx
6. /app/athletes/videos/page.tsx
7. /app/athletes/recruiting-timeline/page.tsx
8. /app/athletes/scholarship-calculator/page.tsx
9. /app/athletes/eligible-schools/page.tsx
10. /app/athletes/compare-schools/page.tsx
11. /app/athletes/network/page.tsx
12. /app/athletes/feed/page.tsx
13. /app/athletes/goals/page.tsx
14. /app/athletes/import-meet/page.tsx

### Coach Pages (require 'coach' role):
1. /app/coaches/dashboard/page.tsx
2. /app/coaches/page.tsx
3. /app/coaches/preferences/page.tsx
4. /app/coaches/search/page.tsx

## Implementation Pattern

For each page, wrap the return statement with RoleGuard:

```tsx
import RoleGuard from '@/components/RoleGuard'

export default function PageName() {
  // ... existing code ...
  
  return (
    <RoleGuard allowedRole="athlete"> {/* or "coach" */}
      <div className="min-h-screen bg-gray-50">
        {/* ... existing JSX ... */}
      </div>
    </RoleGuard>
  )
}
```

## Status
- [ ] All athlete pages protected
- [ ] All coach pages protected
- [ ] Verification flow tested
- [ ] Cross-access prevention verified
