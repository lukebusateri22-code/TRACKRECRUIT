#!/usr/bin/env python3
"""
Simple test with requests to verify Supabase connection
"""

import requests
import json
import os

# Load credentials from .env
with open('.env', 'r') as f:
    lines = f.readlines()
    for line in lines:
        if line.startswith('SUPABASE_URL='):
            SUPABASE_URL = line.split('=')[1].strip()
        elif line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
            SUPABASE_KEY = line.split('=')[1].strip()

print(f"🔍 Testing connection to: {SUPABASE_URL}")

headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

try:
    # Test if tables exist
    url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?select=count"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        print("✅ Tables exist and connection works!")
        
        # Test write
        test_data = {
            'url': 'https://test.com',
            'conference_name': 'Test Conference',
            'data': {'test': True},
            'scraped_at': '2026-04-03T12:00:00Z'
        }
        
        insert_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences"
        response = requests.post(insert_url, headers=headers, json=test_data)
        
        if response.status_code in [200, 201]:
            print("✅ Write test successful!")
            
            # Clean up
            delete_url = f"{SUPABASE_URL}/rest/v1/tffrs_conferences?url=eq.test.com"
            requests.delete(delete_url, headers=headers)
            print("✅ Cleanup successful!")
            
            print("\n🎉 Everything is working! Ready to scrape conferences.")
        else:
            print(f"❌ Write failed: {response.status_code} - {response.text}")
            
    elif response.status_code == 404:
        print("❌ Tables don't exist!")
        print("🔧 Solution: Run the SQL script from supabase/RUN-THIS-TFFRS-TABLES.sql")
        
    elif response.status_code == 401:
        print("❌ Authentication failed!")
        print("🔧 Solution: Check your service_role key")
        
    else:
        print(f"❌ Error: {response.status_code} - {response.text}")
        
except Exception as e:
    print(f"❌ Connection error: {e}")
