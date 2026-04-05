# Cron Job Setup - Weekly Scrapers

## Overview
Set up automated weekly scraping for both athlete and coach conference data every Monday at 2 AM.

## What Gets Scraped

### Athlete Scraper
- **Script:** `scripts/athlete-conference-scraper.py`
- **Data:** Top 8 athletes per event per conference
- **Tables:** `tffrs_teams`, `tffrs_performances`
- **Duration:** ~45-60 minutes
- **Output:** ~6,800 performances

### Coach Scraper
- **Script:** `scripts/bulk-scrape-conferences.py`
- **Data:** Full conference analytics data
- **Tables:** `tffrs_conferences` (raw data field)
- **Duration:** ~30-45 minutes
- **Output:** 31 conferences with complete data

## Unified Script

**File:** `scripts/weekly-scraper-all.sh`

This script runs BOTH scrapers in sequence:
1. Checks Flask scraper is running
2. Runs athlete conference scraper
3. Runs coach conference scraper
4. Reports success/failure

## Setup Instructions

### Step 1: Test Manual Run First

```bash
# Navigate to project directory
cd /Users/cn424694/Trackre

# Make sure Flask scraper is running
cd tfrrs-scraper
python3 app.py &
cd ..

# Test the unified scraper
./scripts/weekly-scraper-all.sh
```

**Expected Output:**
```
==========================================
TrackRecruit Weekly Scraper - ALL DATA
Started: [timestamp]
==========================================

1. Checking Flask scraper status...
✅ Flask scraper is running

2. Running ATHLETE conference scraper...
   This scrapes top 8 per event for athlete rankings
[Progress messages...]
✅ Athlete scraper completed

3. Running COACH conference scraper...
   This scrapes full conference data for coach analytics
[Progress messages...]
✅ Coach scraper completed

==========================================
✅ ALL SCRAPERS COMPLETED SUCCESSFULLY!
Finished: [timestamp]
==========================================
```

### Step 2: Set Up Cron Job

#### Open Crontab Editor
```bash
crontab -e
```

#### Add This Line (Runs Every Monday at 2 AM)
```bash
0 2 * * 1 cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1
```

**Cron Schedule Breakdown:**
- `0` = Minute (0 = top of the hour)
- `2` = Hour (2 AM)
- `*` = Day of month (any day)
- `*` = Month (any month)
- `1` = Day of week (1 = Monday)

**Alternative Schedules:**
```bash
# Every Sunday at 2 AM
0 2 * * 0 cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1

# Every day at 2 AM (for testing)
0 2 * * * cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1

# Every hour (for aggressive testing - NOT recommended)
0 * * * * cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1
```

#### Save and Exit
- Press `ESC`
- Type `:wq` and press `ENTER` (if using vim)
- Or press `CTRL+X`, then `Y`, then `ENTER` (if using nano)

### Step 3: Verify Cron Job

```bash
# List all cron jobs
crontab -l

# You should see your new entry
```

### Step 4: Monitor First Run

```bash
# Watch the log file in real-time
tail -f /tmp/trackrecruit-weekly-scraper.log

# Or check after it runs
cat /tmp/trackrecruit-weekly-scraper.log
```

## Testing the Cron Job

### Test Run in 5 Minutes
To test without waiting until Monday:

```bash
# Get current time
date

# Set cron to run in 5 minutes
# If it's 3:42 PM, set it to run at 3:47 PM (15:47 in 24-hour format)
crontab -e

# Add temporary test line (example for 3:47 PM)
47 15 * * * cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1

# Wait 5 minutes, then check log
tail -f /tmp/trackrecruit-weekly-scraper.log
```

After testing, remove the test line and add back the Monday 2 AM schedule.

## Troubleshooting

### Cron Job Doesn't Run

**Check cron service is running:**
```bash
# macOS
sudo launchctl list | grep cron

# If not running, start it
sudo launchctl load -w /System/Library/LaunchDaemons/com.vixie.cron.plist
```

**Check cron logs:**
```bash
# macOS
tail -f /var/log/system.log | grep cron

# Check your script log
tail -f /tmp/trackrecruit-weekly-scraper.log
```

### Flask Scraper Not Starting

**Manual start:**
```bash
cd /Users/cn424694/Trackre/tfrrs-scraper
python3 app.py &
```

**Check if already running:**
```bash
ps aux | grep app.py
curl http://localhost:8080/health
```

### Scraper Fails

**Check individual scrapers:**
```bash
# Test athlete scraper
cd /Users/cn424694/Trackre
python3 scripts/athlete-conference-scraper.py

# Test coach scraper
python3 scripts/bulk-scrape-conferences.py
```

**Check environment variables:**
```bash
cat .env.local | grep SUPABASE
```

### Permission Denied

```bash
# Make script executable
chmod +x scripts/weekly-scraper-all.sh

# Verify permissions
ls -la scripts/weekly-scraper-all.sh
```

## Monitoring & Notifications

### Check Last Run
```bash
# View last 100 lines of log
tail -100 /tmp/trackrecruit-weekly-scraper.log

# Search for errors
grep -i error /tmp/trackrecruit-weekly-scraper.log

# Check if completed successfully
grep "COMPLETED SUCCESSFULLY" /tmp/trackrecruit-weekly-scraper.log
```

### Verify Data Updated
```bash
# Check conference data
node scripts/check-all-conference-data.js

# Check database directly
# (Run in Supabase SQL Editor)
SELECT COUNT(*) FROM tffrs_performances;
SELECT COUNT(*) FROM tffrs_conferences WHERE data IS NOT NULL;
```

### Add Email Notifications (Optional)

Edit `scripts/weekly-scraper-all.sh` and uncomment the notification section at the end:

```bash
# Send email on success (requires mail setup)
echo "Weekly scrape completed successfully" | mail -s "TrackRecruit Scraper Success" your@email.com

# Or use a webhook service
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H "Content-Type: application/json" \
  -d '{"text": "TrackRecruit weekly scrape completed!"}'
```

## Summary

**To Set Up:**
1. ✅ Test manual run: `./scripts/weekly-scraper-all.sh`
2. ✅ Add to crontab: `0 2 * * 1 cd /Users/cn424694/Trackre && ./scripts/weekly-scraper-all.sh >> /tmp/trackrecruit-weekly-scraper.log 2>&1`
3. ✅ Verify: `crontab -l`
4. ✅ Monitor: `tail -f /tmp/trackrecruit-weekly-scraper.log`

**Schedule:** Every Monday at 2:00 AM

**Duration:** ~90 minutes total (both scrapers)

**Output:** 
- Athlete data: ~6,800 performances
- Coach data: 31 conferences with full analytics
