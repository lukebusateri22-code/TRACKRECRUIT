# IMMEDIATE ACTIONS - BOTH ISSUES

## Issue 1: Signup Timing Out

**The trigger is hanging Supabase.** Let's test without it first.

### Run this SQL in Supabase:

```sql
-- TEMPORARILY DISABLE TRIGGER TO TEST SIGNUP
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

SELECT 'Trigger disabled - test signup now' as status;
```

### Then test signup:
1. Refresh signup page
2. Try creating account
3. Should work immediately without trigger

**If signup works**, we know the trigger is the problem. Then we'll manually create profiles after signup.

---

## Issue 2: TFFRS Scraper

**You're right - the tables ARE there!** I can see them in your screenshot. My debug endpoint was wrong because it only fetched static HTML, but the page loads tables dynamically.

### Fixed the scraper:
- Now looks for h3 tags with event names
- Finds the table after each h3
- Parses the tbody rows

### Test it:
1. Restart dev server: `npm run dev`
2. Go to `http://localhost:3000/test-tffrs`
3. Click "Load Conference Data"
4. Should now show team rankings and athlete data

---

## DO THIS NOW:

1. **Run the SQL above** (disable trigger)
2. **Test signup** - should work
3. **Restart server** - `npm run dev`
4. **Test TFFRS** - should show data

Both should work now. The trigger was blocking signup, and the TFFRS scraper now uses the correct pattern to find tables.
