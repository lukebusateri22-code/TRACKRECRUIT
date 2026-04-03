#!/usr/bin/env python3
"""
Update existing conferences with proper names
"""

import requests
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

def extract_conference_name(url):
    """Extract conference name from URL"""
    name_part = url.split('/')[-1].replace('.html', '').replace('_Outdoor_Performance_List', '')
    return name_part.replace('_', ' ').replace(' ', ' ').title()

def update_conference_names():
    """Update all conferences with proper names"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
    }
    
    # Get all conferences
    response = requests.get(f"{SUPABASE_URL}/rest/v1/tffrs_conferences", headers=headers)
    
    if response.status_code == 200:
        conferences = response.json()
        print(f"📊 Found {len(conferences)} conferences to update")
        
        for conf in conferences:
            proper_name = extract_conference_name(conf['url'])
            
            # Update the conference name
            update_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?id=eq.{conf['id']}"
            update_data = {'conference_name': proper_name}
            
            response = requests.patch(update_url, headers=headers, json=update_data)
            
            if response.status_code in [200, 204]:
                print(f"✅ Updated: {proper_name}")
            else:
                print(f"❌ Failed to update {conf['url']}: {response.status_code}")
        
        print("🎉 Conference names updated!")
    else:
        print(f"❌ Error fetching conferences: {response.status_code}")

if __name__ == "__main__":
    update_conference_names()
