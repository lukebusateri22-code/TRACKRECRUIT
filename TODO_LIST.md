# TrackRecruit - TODO List

## 🔴 HIGH PRIORITY (Core Features)

### 1. **Add Recruiting Standards for Jumps**
- Currently only have standards for running events (1600m, 800m, 400m)
- Need to add standards for:
  - Triple Jump
  - Long Jump
  - High Jump
  - Pole Vault
- Add for all schools in database
- Then school unlock popup will work for Luke's jumps

### 2. **Fix School Unlock Detection**
- PR is saving correctly ✅
- Unlock detection not triggering
- Need to verify recruiting standards comparison logic
- Test with jump PRs

### 3. **Update Profile Tab**
- Currently shows Jordan Davis mock data
- Update to show Luke's real data:
  - Name, school, location
  - Real PRs from database
  - Real academics (GPA, SAT)
  - Real achievements

## 🟡 MEDIUM PRIORITY (Polish)

### 4. **Test Top 10 Favorites**
- Feature is built
- Need to test:
  - Search schools
  - Add to favorites
  - Reorder list
  - Add notes

### 5. **Update Other Athlete Pages**
- **Meets page** - Show real meet results from database
- **Rankings page** - Query athletes by event/state
- **Network page** - Show other athletes
- **Videos page** - Connect to Supabase Storage

### 6. **Add Profile Editing**
- Create `/athletes/edit-profile` page
- Allow editing:
  - Bio
  - Contact info
  - Social media
  - Academics

### 7. **Connect Messages System**
- Pull real messages from database
- Send/receive functionality
- Coach-athlete communication

## 🟢 LOW PRIORITY (Future)

### 8. **File Upload for Videos**
- Set up Supabase Storage buckets
- Video upload form
- Display videos on profile

### 9. **Meet Results Import**
- Manual entry form
- CSV import
- Athletic.net API integration (future)

### 10. **Coach Dashboard**
- Update to show real data
- Athlete search with filters
- Watchlist functionality

### 11. **Admin Dashboard**
- User management
- Verification system
- Analytics

### 12. **Rankings System**
- Real-time rankings by event
- Filter by state, graduation year
- National vs state rankings

## ✅ COMPLETED

- ✅ Supabase backend setup
- ✅ Authentication (signup/login)
- ✅ Profile completion flow
- ✅ Luke Busateri test account created
- ✅ Add PR page (saves to database)
- ✅ Top 10 favorites page (built, needs testing)
- ✅ School database (16 schools)
- ✅ Recruiting standards (running events only)
- ✅ Dashboard Home tab shows real data
- ✅ School unlock modal component (built, needs jump standards)

---

## 🎯 RECOMMENDED ORDER

1. **Add jump recruiting standards** (15 min) - Makes unlock system work
2. **Test Top 10 favorites** (5 min) - Already built
3. **Update Profile tab** (10 min) - Quick visual fix
4. **Add jump standards and test unlock** (10 min) - Core feature
5. **Update other pages** (30-60 min) - Polish

**Total time to complete high priority items: ~1 hour**

---

## 📝 NOTES

- Core NCAA Football-style features are built and working
- Main blocker: Need recruiting standards for jumping events
- Once jump standards added, unlock system will work perfectly
- Most pages just need database connections (straightforward)
