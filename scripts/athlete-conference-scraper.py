#!/usr/bin/env python3
"""
Athlete Conference Scraper - Top 8 Per Event
Scrapes all 31 NCAA conferences and extracts top 8 athletes per event
Populates tffrs_teams and tffrs_performances tables for athlete-facing pages
"""

import requests
import json
import time
import sys
from datetime import datetime

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

# All 31 NCAA Conference URLs
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

def extract_conference_name(url):
    """Extract conference name from URL"""
    name_part = url.split('/')[-1].replace('_Outdoor_Performance_List', '')
    return name_part.replace('_', ' ').title()

def scrape_conference(url):
    """Scrape conference using Flask scraper"""
    try:
        response = requests.post('http://localhost:8080/analyze', 
                              json={'url': url}, 
                              timeout=90)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"  ❌ Scraping error: {e}")
        return None

def get_or_create_conference(url, conference_name, data):
    """Get existing or create new conference"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Check if exists
    check_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?url=eq.{url}&select=id"
    response = requests.get(check_url, headers=headers)
    
    if response.json():
        return response.json()[0]['id']
    
    # Create new
    insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences"
    conf_data = {
        'url': url,
        'conference_name': conference_name,
        'data': data,
        'scraped_at': datetime.now().isoformat()
    }
    response = requests.post(insert_url, headers={**headers, 'Prefer': 'return=representation'}, json=conf_data)
    
    if response.status_code in [200, 201]:
        return response.json()[0]['id']
    
    return None

def get_or_create_team(conference_id, team_name, gender):
    """Get existing or create new team"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Check if exists
    check_url = f"{SUPABASE_URL}/rest/v1/tffrs_teams?conference_id=eq.{conference_id}&team_name=eq.{team_name}&gender=eq.{gender}&select=id"
    response = requests.get(check_url, headers=headers)
    
    if response.json():
        return response.json()[0]['id']
    
    # Create new
    insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_teams"
    team_data = {
        'conference_id': conference_id,
        'team_name': team_name,
        'gender': gender,
        'total_points': 0
    }
    response = requests.post(insert_url, headers={**headers, 'Prefer': 'return=representation'}, json=team_data)
    
    if response.status_code in [200, 201]:
        return response.json()[0]['id']
    
    return None

def insert_performance(team_id, athlete_name, event_name, event_category, mark, rank, points):
    """Insert a performance record"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json'
    }
    
    insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_performances"
    perf_data = {
        'team_id': team_id,
        'athlete_name': athlete_name,
        'event_name': event_name,
        'event_category': event_category,
        'mark': mark,
        'rank': rank,
        'points': points
    }
    
    response = requests.post(insert_url, headers=headers, json=perf_data)
    return response.status_code in [200, 201]

def process_conference(url, index, total):
    """Process a single conference"""
    conference_name = extract_conference_name(url)
    print(f"\n[{index}/{total}] {conference_name}")
    print(f"  📊 Scraping...")
    
    # Scrape the data
    data = scrape_conference(url)
    if not data or not data.get('success'):
        print(f"  ❌ Failed to scrape")
        return 0
    
    # Get or create conference
    conference_id = get_or_create_conference(url, conference_name, data)
    if not conference_id:
        print(f"  ❌ Failed to create conference")
        return 0
    
    # Extract event_breakdown
    event_breakdown = data.get('event_breakdown', {})
    if not event_breakdown:
        print(f"  ⚠️  No event data")
        return 0
    
    print(f"  ✅ Processing events...")
    
    team_cache = {}
    performance_count = 0
    
    # Process each event
    for event_name, team_performances in event_breakdown.items():
        # Determine gender from event name
        gender = 'Women' if '(Women)' in event_name else 'Men'
        
        # Process each team's performances in this event
        for team_name, categories in team_performances.items():
            team_key = f"{team_name}-{gender}"
            
            # Get or create team
            if team_key not in team_cache:
                team_id = get_or_create_team(conference_id, team_name, gender)
                if team_id:
                    team_cache[team_key] = team_id
                else:
                    continue
            
            team_id = team_cache[team_key]
            
            # Process performances by category
            for category, performances in categories.items():
                if not isinstance(performances, list):
                    continue
                
                for perf in performances:
                    # Only top 8 with valid athlete name and mark
                    if (perf.get('rank', 99) <= 8 and 
                        perf.get('athlete') and 
                        perf.get('mark')):
                        
                        if insert_performance(
                            team_id,
                            perf['athlete'],
                            perf.get('event', event_name),
                            category,
                            perf['mark'],
                            perf['rank'],
                            perf.get('points', 0)
                        ):
                            performance_count += 1
    
    print(f"  ✅ Saved {len(team_cache)} teams, {performance_count} performances")
    return performance_count

def main():
    print("🏃 ATHLETE CONFERENCE SCRAPER - TOP 8 PER EVENT")
    print(f"📋 Scraping {len(CONFERENCE_URLS)} conferences\n")
    
    # Check Flask scraper
    try:
        requests.get('http://localhost:8080/', timeout=5)
        print("✅ Flask scraper is running\n")
    except:
        print("❌ Flask scraper not running on port 8080")
        print("Start it with: cd tfrrs-scraper && python3 app.py\n")
        sys.exit(1)
    
    total_performances = 0
    success_count = 0
    
    for i, url in enumerate(CONFERENCE_URLS, 1):
        perf_count = process_conference(url, i, len(CONFERENCE_URLS))
        if perf_count > 0:
            total_performances += perf_count
            success_count += 1
        
        # Small delay between requests
        time.sleep(2)
    
    print(f"\n\n🎉 COMPLETE!")
    print(f"✅ Successfully processed: {success_count}/{len(CONFERENCE_URLS)} conferences")
    print(f"✅ Total performances: {total_performances}")
    print(f"\n🏆 Athletes can now view conference rankings!")

if __name__ == "__main__":
    main()
