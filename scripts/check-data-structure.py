#!/usr/bin/env python3
"""
Check the actual data structure in the database
"""

import requests
import os
import json

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

def check_data_structure():
    """Check the actual data structure in database"""
    headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': f'Bearer {SUPABASE_KEY}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    # Get a sample conference
    response = requests.get(f"{SUPABASE_URL}/rest/v1/tffrs_conferences?limit=1", headers=headers)
    
    if response.status_code == 200:
        conferences = response.json()
        if conferences:
            conf = conferences[0]
            print(f"🔍 Conference: {conf['conference_name']}")
            print(f"🔍 URL: {conf['url']}")
            print(f"🔍 Data structure keys: {list(conf['data'].keys())}")
            
            # Show the actual data structure
            data = conf['data']
            print(f"\n📊 Data type: {type(data)}")
            print(f"📊 Success: {data.get('success')}")
            
            if 'rankings' in data:
                print(f"📊 Rankings keys: {list(data['rankings'].keys())}")
                if 'Men' in data['rankings']:
                    print(f"📊 Men teams: {len(data['rankings']['Men'])}")
                    if data['rankings']['Men']:
                        print(f"📊 First men team: {data['rankings']['Men'][0]}")
                if 'Women' in data['rankings']:
                    print(f"📊 Women teams: {len(data['rankings']['Women'])}")
                    if data['rankings']['Women']:
                        print(f"📊 First women team: {data['rankings']['Women'][0]}")
            
            if 'summary' in data:
                print(f"📊 Summary: {data['summary']}")
            
            # Show a sample of the raw data
            print(f"\n📄 Raw data sample:")
            print(json.dumps(data, indent=2)[:1000] + "..." if len(json.dumps(data, indent=2)) > 1000 else json.dumps(data, indent=2))
        else:
            print("❌ No conferences found")
    else:
        print(f"❌ Error fetching conferences: {response.status_code}")

if __name__ == "__main__":
    check_data_structure()
