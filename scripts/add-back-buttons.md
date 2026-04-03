# Pages Needing Back Buttons

## Coach Pages
- [x] /coaches/conference-analytics - Already has back button
- [x] /coaches/conference-detail/[id] - Already has back button
- [ ] /coaches/search - Needs back button to dashboard
- [ ] /coaches/messages - Needs back button to dashboard
- [ ] /coaches/preferences - Needs back button to dashboard
- [ ] /coaches/conference-list - Needs back button to dashboard

## Athlete Pages
- [x] /athletes/conference-info - Already has back button
- [ ] /athletes/profile - Needs back button to dashboard
- [ ] /athletes/rankings - Needs back button to dashboard
- [ ] /athletes/search-colleges - Needs back button to dashboard
- [ ] /athletes/eligible-schools - Needs back button to dashboard
- [ ] /athletes/compare-schools - Needs back button to dashboard

## Implementation Pattern
```tsx
<Link
  href="/[parent-route]"
  className="mr-4 p-2 rounded-lg hover:bg-gray-900 hover:text-white transition"
>
  <ArrowLeft className="w-5 h-5" />
</Link>
```
