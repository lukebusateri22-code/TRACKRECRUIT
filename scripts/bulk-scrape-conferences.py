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

# Load environment variables from .env file
def load_env():
    with open('.env', 'r') as f:
        for line in f:
            if line.startswith('SUPABASE_URL='):
                SUPABASE_URL = line.split('=')[1].strip()
            elif line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
                SUPABASE_KEY = line.split('=')[1].strip()
    return SUPABASE_URL, SUPABASE_KEY

SUPABASE_URL, SUPABASE_KEY = load_env()

# Conference URLs to scrape
CONFERENCE_URLS = [
    "https://tf.tfrrs.org/lists/5651/ACC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5653/ASUN_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5652/America_East_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5654/Atlantic_10_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5656/BIG_EAST_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5655/Big_12_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5657/Big_Sky_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5658/Big_South_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5659/Big_Ten_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5660/Big_West_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5661/CAA_Colonial_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5662/Conference_USA_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5664/Horizon_League_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5665/IC4A_ECAC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5666/Ivy_League_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5667/MEAC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5668/Metro_Atlantic_MAAC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5670/Mid_American_MAC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5671/Missouri_Valley_MVC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5672/Mountain_West_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5674/Northeast_Conference_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5675/Ohio_Valley_OVC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5677/Patriot_League_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5678/SEC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5682/SWAC_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5679/Southern_Conference_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5680/Southland_Conference_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5681/Sun_Belt_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5683/The_American_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5684/The_Summit_League_Outdoor_Performance_List",
    "https://tf.tfrrs.org/lists/5685/WAC_Outdoor_Performance_List"
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

def extract_conference_name(url):
    """Extract conference name from URL"""
    # Extract the part after the last slash and before .html
    name_part = url.split('/')[-1].replace('.html', '').replace('_Outdoor_Performance_List', '')
    # Replace underscores with spaces and format nicely
    return name_part.replace('_', ' ').replace(' ', ' ').title()

def save_to_supabase(url, data):
    """Save scraped data to Supabase using requests"""
    try:
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        conference_name = extract_conference_name(url)
        
        # Check if conference exists
        check_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?url=eq.{url}"
        response = requests.get(check_url, headers=headers)
        
        conference_data = {
            'url': url,
            'conference_name': conference_name,
            'data': data,  # Save the exact raw data
            'scraped_at': datetime.now().isoformat()
        }
        
        if response.status_code == 200 and response.json():
            # Update existing
            update_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?url=eq.{url}"
            response = requests.patch(update_url, headers=headers, json=conference_data)
        else:
            # Insert new
            insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences"
            response = requests.post(insert_url, headers=headers, json=conference_data)
        
        if response.status_code in [200, 201, 204]:
            print(f"✅ Saved: {conference_name}")
            return True
        else:
            print(f"❌ Save failed: {response.status_code} - {response.text}")
            return False
        
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
