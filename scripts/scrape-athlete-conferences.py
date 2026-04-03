#!/usr/bin/env python3
"""
Athlete Conference Scraper
Directly scrapes and populates top 8 athletes per event for each conference
"""

import requests
import json
import time
import sys
from datetime import datetime
import re

# Load environment variables from .env.local file
def load_env():
    SUPABASE_URL = None
    SUPABASE_KEY = None
    with open('.env.local', 'r') as f:
        for line in f:
            if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
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
]

def extract_conference_name(url):
    """Extract conference name from URL"""
    name_part = url.split('/')[-1].replace('_Outdoor_Performance_List', '')
    return name_part.replace('_', ' ').title()

def scrape_and_populate_conference(url):
    """Scrape a conference and directly populate the database"""
    try:
        print(f"\n📊 Scraping: {url}")
        
        # Use the Flask scraper
        response = requests.post('http://localhost:8080/analyze', 
                              json={'url': url}, 
                              timeout=60)
        response.raise_for_status()
        data = response.json()
        
        if not data.get('success'):
            print(f"❌ Scraper failed for {url}")
            return False
        
        conference_name = extract_conference_name(url)
        
        # Get or create conference
        headers = {
            'apikey': SUPABASE_KEY,
            'Authorization': f'Bearer {SUPABASE_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Check if conference exists
        check_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?url=eq.{url}&select=id"
        conf_response = requests.get(check_url, headers=headers)
        
        if conf_response.json():
            conference_id = conf_response.json()[0]['id']
            print(f"✅ Found existing conference: {conference_name}")
        else:
            # Create conference
            insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences"
            conf_data = {
                'url': url,
                'conference_name': conference_name,
                'data': data,
                'scraped_at': datetime.now().isoformat()
            }
            conf_response = requests.post(insert_url, headers={**headers, 'Prefer': 'return=representation'}, json=conf_data)
            if conf_response.status_code in [200, 201]:
                conference_id = conf_response.json()[0]['id']
                print(f"✅ Created conference: {conference_name}")
            else:
                print(f"❌ Failed to create conference: {conf_response.text}")
                return False
        
        # Process teams and performances
        # The data structure is: data.raw_data contains the team performances
        raw_data = data.get('raw_data', {})
        total_performances = 0
        
        if not raw_data:
            print(f"  ⚠️  No raw_data found in scraped data")
            return False
        
        teams_data = raw_data
        
        for gender in ['Men', 'Women']:
            if gender not in teams_data:
                continue
            
            gender_teams = teams_data[gender]
            
            for team_name, categories in gender_teams.items():
                # Get or create team
                team_check_url = f"{SUPABASE_URL}/rest/v1/tffrs_teams?conference_id=eq.{conference_id}&team_name=eq.{team_name}&gender=eq.{gender}&select=id"
                team_response = requests.get(team_check_url, headers=headers)
                
                if team_response.json():
                    team_id = team_response.json()[0]['id']
                else:
                    # Create team
                    team_insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_teams"
                    team_data = {
                        'conference_id': conference_id,
                        'team_name': team_name,
                        'gender': gender,
                        'total_points': 0
                    }
                    team_response = requests.post(team_insert_url, headers={**headers, 'Prefer': 'return=representation'}, json=team_data)
                    if team_response.status_code in [200, 201]:
                        team_id = team_response.json()[0]['id']
                    else:
                        print(f"  ⚠️  Failed to create team {team_name}")
                        continue
                
                # Insert performances (top 8 only)
                for category, performances in categories.items():
                    if not isinstance(performances, list):
                        continue
                    
                    for perf in performances:
                        if perf.get('rank', 99) <= 8 and perf.get('athlete'):
                            perf_data = {
                                'team_id': team_id,
                                'athlete_name': perf['athlete'],
                                'event_name': perf.get('event', 'Unknown'),
                                'event_category': category,
                                'mark': perf.get('mark', ''),
                                'rank': perf['rank'],
                                'points': perf.get('points', 0)
                            }
                            
                            perf_insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_performances"
                            perf_response = requests.post(perf_insert_url, headers=headers, json=perf_data)
                            
                            if perf_response.status_code in [200, 201]:
                                total_performances += 1
        
        print(f"✅ Saved {conference_name} with {total_performances} performances")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("🚀 Starting athlete conference scraping...")
    print(f"📋 Found {len(CONFERENCE_URLS)} conferences to scrape\n")
    
    # Check if Flask scraper is running
    try:
        response = requests.get('http://localhost:8080/', timeout=5)
        print("✅ Flask scraper is running\n")
    except:
        print("❌ Flask scraper is not running on port 8080")
        print("Please start it with: cd tfrrs-scraper && python3 app.py")
        sys.exit(1)
    
    success_count = 0
    error_count = 0
    
    for i, url in enumerate(CONFERENCE_URLS, 1):
        print(f"\n[{i}/{len(CONFERENCE_URLS)}]")
        
        if scrape_and_populate_conference(url):
            success_count += 1
        else:
            error_count += 1
        
        # Small delay to be respectful
        time.sleep(2)
    
    print(f"\n\n🏁 Scraping complete!")
    print(f"✅ Successfully scraped: {success_count} conferences")
    print(f"❌ Failed: {error_count} conferences")
    
    if success_count > 0:
        print(f"\n🎉 Athletes can now view conference rankings!")

if __name__ == "__main__":
    main()
