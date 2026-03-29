# Weekly TFFRS Conference Scraper Setup

This guide explains how to set up automatic weekly scraping for TFFRS conference data.

## 📋 Overview

The system automatically scrapes saved conferences weekly and stores the data in your Supabase database. Coaches can then view historical data and trends through the dashboard.

## 🗄️ Database Setup

### Step 1: Run the SQL Scripts

1. **Go to your Supabase Dashboard** → SQL Editor
2. **Run the main tables script** (if not already done):
   - Copy contents from `supabase/RUN-THIS-TFFRS-TABLES.sql`
   - Paste and execute in SQL Editor

3. **Run the conference management script**:
   - Copy contents from `supabase/ADD-CONFERENCE-MANAGEMENT.sql`
   - Paste and execute in SQL Editor

This creates:
- `tffrs_conferences` - Stores all scraped conference data
- `tffrs_teams` - Stores team rankings and points
- `tffrs_performances` - Stores individual athlete performances
- `tffrs_conference_watchlist` - Manages which conferences to auto-scrape

## 🔄 How It Works

### 1. **Add Conferences to Watchlist**

When you scrape a conference for the first time, it's automatically added to the watchlist. You can also manually add conferences via the API:

```bash
curl -X POST http://localhost:3000/api/conferences \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.tfrrs.org/lists/3674/Ohio_Valley_OVC_Outdoor_Performance_List",
    "conference_name": "Ohio Valley Conference"
  }'
```

### 2. **Weekly Scraping**

The system checks the `tffrs_conference_watchlist` table for conferences that need scraping (where `next_scrape_at` is in the past) and automatically scrapes them.

### 3. **Data Storage**

All scraped data is saved to:
- Conference details and raw data → `tffrs_conferences`
- Team rankings → `tffrs_teams`
- Athlete performances → `tffrs_performances`

## ⚙️ Setting Up the Cron Job

You have several options for running the weekly scraper:

### Option 1: Vercel Cron Jobs (Recommended for Production)

If you're deploying to Vercel:

1. Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/scrape-weekly",
      "schedule": "0 2 * * 0"
    }
  ]
}
```

This runs every Sunday at 2 AM UTC.

### Option 2: GitHub Actions (Free)

Create `.github/workflows/weekly-scraper.yml`:

```yaml
name: Weekly TFFRS Scraper

on:
  schedule:
    - cron: '0 2 * * 0'  # Every Sunday at 2 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger scraper
        run: |
          curl -X GET https://your-app.vercel.app/api/scrape-weekly \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### Option 3: External Cron Service

Use services like:
- **Cron-job.org** (free)
- **EasyCron** (free tier available)
- **UptimeRobot** (can ping URLs on schedule)

Configure them to call:
```
GET https://your-app.vercel.app/api/scrape-weekly
```

### Option 4: Local Cron (Development)

On Mac/Linux, add to crontab:

```bash
# Edit crontab
crontab -e

# Add this line (runs every Sunday at 2 AM)
0 2 * * 0 curl -X GET http://localhost:3000/api/scrape-weekly
```

## 🔐 Security Setup

### Add Cron Secret (Optional but Recommended)

1. Generate a random secret:
```bash
openssl rand -base64 32
```

2. Add to your `.env.local`:
```
CRON_SECRET=your-generated-secret-here
```

3. Update your cron job to include the secret:
```bash
curl -X GET https://your-app.vercel.app/api/scrape-weekly \
  -H "Authorization: Bearer your-generated-secret-here"
```

## 📊 Using the System

### View Saved Conferences

1. Go to `/coaches/tffrs-analytics`
2. You'll see a "Saved Conferences" section at the top
3. Click any saved conference to instantly load its data

### Manual Scraping

You can still manually scrape any conference by:
1. Entering the TFFRS URL
2. Clicking "Analyze"
3. The data will be saved to the database automatically

### Check Scraper Status

To manually trigger the weekly scraper:
```bash
curl -X GET http://localhost:3000/api/scrape-weekly
```

Response will show which conferences were scraped and their status.

## 📈 Features

### Automatic Features:
- ✅ Weekly auto-scraping of saved conferences
- ✅ Historical data tracking
- ✅ Trend analysis over time
- ✅ Quick access to previously scraped conferences
- ✅ No need to re-scrape for recent data

### Coach Dashboard Features:
- 📊 View all saved conferences in one place
- 🔍 Deep dive into any conference with one click
- 📈 Compare team performance over time
- 🎯 Track recruiting targets across conferences

## 🛠️ Troubleshooting

### Scraper Not Running?

1. Check the watchlist table:
```sql
SELECT * FROM tffrs_conference_watchlist WHERE active = true;
```

2. Verify `next_scrape_at` dates are in the past
3. Check your cron job is configured correctly
4. Look at server logs for errors

### Data Not Saving?

1. Verify Supabase environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Check RLS policies are enabled
3. Look at API logs: `/api/tffrs-proxy` and `/api/scrape-weekly`

### Manual Database Check

```sql
-- Check recent conferences
SELECT conference_name, scraped_at 
FROM tffrs_conferences 
ORDER BY scraped_at DESC 
LIMIT 10;

-- Check watchlist status
SELECT conference_name, last_scraped_at, next_scrape_at, active
FROM tffrs_conference_watchlist;
```

## 🎯 Next Steps

1. ✅ Run the SQL scripts to create tables
2. ✅ Scrape your first conference to test
3. ✅ Set up your preferred cron method
4. ✅ Add more conferences to the watchlist
5. ✅ Monitor the weekly scraping

## 📝 Notes

- Scraping happens in the background and doesn't block the UI
- Data is cached in sessionStorage for instant page loads
- Database serves as the source of truth for historical data
- You can manually trigger scraping anytime via the UI
