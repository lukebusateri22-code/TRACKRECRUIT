#!/usr/bin/env python3
"""
Bulk TFFRS Conference Scraper
Scrapes multiple conferences and saves to database
"""

import requests
import json
import time
import sys
from datetime import datetime
import os
from supabase import create_client

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://your-project-url.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY', 'your-service-role-key')

# Conference URLs to scrape
CONFERENCE_URLS = [
    "https://www.tfrrs.org/lists/2835.html",
    "https://www.tfrrs.org/lists/5655/Big_12_Outdoor_Performance_List",
    "https://www.tfrrs.org/lists/2288.html",
    "https://www.tfrrs.org/lists/5675/Ohio_Valley_OVC_Outdoor_Performance_List",
    # Add more conference URLs here
]

def scrape_conference(url):
    """Scrape a single conference using the Flask scraper"""
    try:
        response = requests.post('http://localhost:8080/analyze', 
                              json={'url': url}, 
                              timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
        return None

def save_to_supabase(url, data):
    """Save scraped data to Supabase"""
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        conference_name = data.get('conference_name', 'Unknown Conference')
        
        # Save or update conference
        result = supabase.table('tffrs_conferences').upsert({
            'url': url,
            'conference_name': conference_name,
            'data': data,  # Save the exact raw data
            'scraped_at': datetime.now().isoformat()
        }, on_conflict='url').execute()
        
        print(f"✅ Saved: {conference_name}")
        return True
        
    except Exception as e:
        print(f"❌ Error saving to Supabase: {e}")
        return False

def main():
    print("🚀 Starting bulk conference scraping...")
    print(f"📋 Found {len(CONFERENCE_URLS)} conferences to scrape")
    
    # Check if Flask scraper is running
    try:
        response = requests.get('http://localhost:8080/', timeout=5)
        print("✅ Flask scraper is running")
    except:
        print("❌ Flask scraper is not running on port 8080")
        print("Please start it with: cd tfrrs-scraper && python3 app.py")
        sys.exit(1)
    
    success_count = 0
    error_count = 0
    
    for i, url in enumerate(CONFERENCE_URLS, 1):
        print(f"\n📊 [{i}/{len(CONFERENCE_URLS)}] Scraping: {url}")
        
        # Scrape the conference
        data = scrape_conference(url)
        if not data:
            error_count += 1
            continue
        
        # Check if scraping was successful
        if not data.get('success'):
            print(f"❌ Scraper returned error for {url}")
            error_count += 1
            continue
        
        # Save to database
        if save_to_supabase(url, data):
            success_count += 1
        else:
            error_count += 1
        
        # Small delay to be respectful
        time.sleep(1)
    
    print(f"\n🏁 Scraping complete!")
    print(f"✅ Successfully scraped: {success_count} conferences")
    print(f"❌ Failed: {error_count} conferences")
    
    if success_count > 0:
        print(f"\n🎉 View your data at: http://localhost:3000/coaches/conference-list")

if __name__ == "__main__":
    main()
