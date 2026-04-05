# Weekly Auto-Scraper Setup Guide

## Overview
Automatically scrape all NCAA conference data every week to keep rankings up-to-date.

## Prerequisites
- Flask scraper running on `http://localhost:8080`
- Python 3 installed
- Supabase credentials in `.env.local`

## Setup Options

### Option 1: Manual Run (Recommended for Testing)
```bash
# Run the scraper manually
./scripts/weekly-auto-scraper.sh
```

### Option 2: Cron Job (Automated Weekly)

#### Step 1: Edit crontab
```bash
crontab -e
```

#### Step 2: Add this line (runs every Sunday at 2 AM)
```bash
0 2 * * 0 cd /Users/cn424694/Trackre && ./scripts/weekly-auto-scraper.sh >> /tmp/trackrecruit-scraper.log 2>&1
```

**Cron Schedule Breakdown:**
- `0 2 * * 0` = Every Sunday at 2:00 AM
- Change to `0 2 * * 1` for Monday, `0 2 * * 2` for Tuesday, etc.

#### Step 3: Verify cron job
```bash
crontab -l
```

### Option 3: GitHub Actions (Cloud-Based)

Create `.github/workflows/weekly-scraper.yml`:

```yaml
name: Weekly Conference Scraper

on:
  schedule:
    # Runs every Sunday at 2 AM UTC
    - cron: '0 2 * * 0'
  workflow_dispatch: # Allows manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          cd tfrrs-scraper
          pip install -r requirements.txt
      
      - name: Start Flask scraper
        run: |
          cd tfrrs-scraper
          python app.py &
          sleep 5
      
      - name: Run scraper
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          python3 scripts/athlete-conference-scraper.py
```

**Note:** You'll need to add Supabase secrets to GitHub repository settings.

## What Gets Scraped

The scraper processes **all 31 NCAA conferences** and extracts:
- Top 8 athletes per event
- All track & field events (sprints, distance, jumps, throws)
- Both men's and women's teams
- ~6,800+ total performances

## Monitoring

### Check Last Run
```bash
tail -f /tmp/trackrecruit-scraper.log
```

### Verify Data in Database
```bash
node scripts/check-all-conference-data.js
```

## Troubleshooting

### Flask Scraper Not Running
```bash
cd tfrrs-scraper
python3 app.py
```

### Scraper Fails
1. Check Flask scraper is running: `curl http://localhost:8080/health`
2. Check Supabase credentials in `.env.local`
3. Check logs: `tail -f /tmp/trackrecruit-scraper.log`

### Duplicate Data
The scraper automatically handles duplicates. If you need to clean up:
```bash
node scripts/remove-duplicate-performances.js
```

## Manual Re-Scrape

To re-scrape specific conferences:

```bash
# Edit scripts/athlete-conference-scraper.py
# Add conference names to skip_conferences list
skip_conferences = ['Acc', 'Big Ten', 'Sec']  # Skip these

# Then run
python3 scripts/athlete-conference-scraper.py
```

## Performance

- **Duration:** ~45-60 minutes for all 31 conferences
- **Data Volume:** ~6,800 performances
- **API Calls:** ~31 TFRRS scrapes + ~6,800 Supabase inserts

## Next Steps

1. Test manual run: `./scripts/weekly-auto-scraper.sh`
2. Set up cron job for automation
3. Monitor first automated run
4. Consider GitHub Actions for cloud-based scraping
