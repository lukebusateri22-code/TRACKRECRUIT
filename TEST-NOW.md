# SERVER RESTARTED - TEST BOTH NOW

## Changes Applied

1. **Onboarding:** Added detailed logging (server now has the new code)
2. **TFFRS:** Removed slow networkidle wait, now waits for tables directly (faster)

---

## Test 1: Onboarding

1. **Refresh** `http://localhost:3000/athletes/onboarding`
2. **Click "Complete Setup"**
3. **Watch console** - should now see:
   ```
   Starting onboarding save...
   User: [id]
   Checking for athlete profile with profile_id: [id]
   Athlete profile check result: {...}
   ```

If it hangs, you'll see exactly where it stops.

---

## Test 2: TFFRS Scraper

1. **Go to** `http://localhost:3000/test-tffrs`
2. **Click "Load Conference Data"**
3. **Wait 10-15 seconds** (faster now)
4. Should either:
   - ✅ Show team rankings and events
   - ❌ Show error (check server terminal for logs)

---

## What to Check

**Onboarding Console:**
- If you see "Checking for athlete profile..." then it's working
- If it stops before that, copy the last log you see

**TFFRS:**
- Should load faster (30s max instead of 60s)
- Check server terminal for:
  - "Navigating to page..."
  - "Tables loaded, extracting data..."
  - "Scraped conference data: { name: '...', events: X }"

---

Test both and tell me what happens. The new logging will show exactly where each is failing.
