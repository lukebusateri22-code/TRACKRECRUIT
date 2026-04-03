#!/usr/bin/env python3
"""
Test Supabase connection and table setup
"""

import os
from supabase import create_client

# Load credentials from .env
with open('.env', 'r') as f:
    lines = f.readlines()
    for line in lines:
        if line.startswith('SUPABASE_URL='):
            SUPABASE_URL = line.split('=')[1].strip()
        elif line.startswith('SUPABASE_SERVICE_ROLE_KEY='):
            SUPABASE_KEY = line.split('=')[1].strip()

print(f"🔍 Testing connection to: {SUPABASE_URL}")

try:
    # Create Supabase client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Supabase client created")
    
    # Test basic connection
    result = supabase.table('tffrs_conferences').select('count').execute()
    print(f"✅ Connection successful! Found tables")
    
    # Check if we can write
    test_data = {
        'url': 'https://test.com',
        'conference_name': 'Test Conference',
        'data': {'test': True},
        'scraped_at': '2026-04-03T12:00:00Z'
    }
    
    result = supabase.table('tffrs_conferences').insert(test_data).execute()
    print("✅ Write test successful!")
    
    # Clean up test data
    supabase.table('tffrs_conferences').delete().eq('url', 'https://test.com').execute()
    print("✅ Cleanup successful!")
    
    print("\n🎉 Connection is working! Ready to scrape conferences.")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\n🔧 Possible issues:")
    print("1. Tables don't exist - Run the SQL script from supabase/RUN-THIS-TFFRS-TABLES.sql")
    print("2. API key is incorrect - Double-check the service_role key")
    print("3. URL is wrong - Verify your Supabase project URL")
