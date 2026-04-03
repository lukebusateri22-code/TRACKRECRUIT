# Bulk Conference Scraping Setup

## Overview
This system allows you to scrape TFFRS conferences offline and display the data cleanly on your website.

## Setup Instructions

### 1. Start the Flask Scraper
```bash
cd tfrrs-scraper
python3 app.py
```
The scraper should run on `http://localhost:8080`

### 2. Install Python Dependencies
```bash
cd scripts
pip install -r requirements.txt
```

### 3. Set Environment Variables
Create a `.env` file in the scripts directory:
```bash
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Add Conference URLs
Edit `scripts/bulk-scrape-conferences.py` and add your conference URLs to the `CONFERENCE_URLS` list.

### 5. Run Bulk Scraping
```bash
cd scripts
python3 bulk-scrape-conferences.py
```

## What It Does

1. **Scrapes each conference** using the Flask scraper
2. **Saves exact raw data** to Supabase database
3. **Shows progress** and results
4. **Handles errors** gracefully

## Frontend Display

After scraping:
- Go to `http://localhost:3000/coaches/conference-list`
- See all conferences in alphabetical order
- Click any conference to see:
  - Team rankings (Men & Women)
  - Conference statistics
  - Complete raw data

## Adding More Conferences

Simply add URLs to the `CONFERENCE_URLS` list in the Python script:

```python
CONFERENCE_URLS = [
    "https://www.tfrrs.org/lists/2835.html",
    "https://www.tfrrs.org/lists/5655/Big_12_Outdoor_Performance_List",
    "https://www.tfrrs.org/lists/2288.html",
    # Add your conference URLs here
]
```

## Weekly Updates

You can run the script weekly to refresh all conference data:
```bash
python3 bulk-scrape-conferences.py
```

## Benefits

✅ **No frontend scraping** - All scraping happens offline
✅ **Clean data display** - Professional frontend presentation
✅ **Exact scraped data** - No data transformation
✅ **Easy to update** - Just run the script
✅ **Scalable** - Add unlimited conferences
