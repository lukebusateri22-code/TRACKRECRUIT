# Implementation Notes - Remaining Tasks

## Completed ✅
1. Renamed conference-context to conference-info ("Conference Info")
2. Updated national rankings section to "College Track Ranking"
3. Redesigned athlete onboarding with 4-step process
4. Added MileSplit link field for PR verification
5. Implemented "Unverified PRs" system
6. Added academic verification via document upload
7. Created Supabase migrations for new athlete fields

## In Progress 🚧

### High Priority
1. **Fix Coach Signup Timeout** - Need to investigate and fix
2. **Fix View Messages Button** - Match styling with top Messages button
3. **Add Back Buttons** - Systematically add to all pages
4. **Create Coach Onboarding** - School name, conference selection

### Medium Priority
5. **MileSplit Scraper** - For PR verification
6. **National Rankings Scraper** - Without puppeteer if possible
7. **Move Preferences to Search Athletes Page** - Combine with filters

## Database Changes Needed

### Supabase Migrations to Run:
1. `create_national_rankings_table.sql` - Already created
2. `update_athlete_profiles_onboarding.sql` - Already created, needs to be run

### Storage Buckets Needed:
- `athlete-documents` - For academic verification documents

### Coach Profiles Table Updates:
- Add `school_name` field
- Add `conference` field
- Consider how coach accounts are created (admin vs self-signup)

## Next Steps
1. Fix coach signup timeout
2. Add back buttons to all pages
3. Fix View Messages button styling
4. Test athlete onboarding flow
5. Run database migrations
6. Deploy and test
