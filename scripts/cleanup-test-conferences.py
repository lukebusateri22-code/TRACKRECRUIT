#!/usr/bin/env python3
"""
Clean up test conferences from the database
"""

import os
import sys
from supabase import create_client

# Load environment variables
load_dotenv()

supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
supabase_key = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not supabase_url or not supabase_key:
    print("❌ Missing Supabase credentials")
    sys.exit(1)

# Initialize Supabase client
supabase = create_client(supabase_url, supabase_key)

def cleanup_test_conferences():
    """Remove test conferences"""
    print("🧹 Cleaning up test conferences...")
    
    # Find test conferences
    test_conferences = ['Test.Com', 'Unknown Conference']
    
    for conference_name in test_conferences:
        print(f"\n🗑️  Removing conference: {conference_name}")
        
        try:
            # Delete the conference
            result = supabase.table('tffrs_conferences').delete().eq('conference_name', conference_name).execute()
            
            if result.data:
                print(f"✅ Successfully removed {conference_name}")
                print(f"   Deleted {len(result.data)} records")
            else:
                print(f"ℹ️  No records found for {conference_name}")
                
        except Exception as e:
            print(f"❌ Error removing {conference_name}: {e}")
    
    print("\n📊 Checking remaining conferences...")
    
    # Show remaining conferences
    try:
        result = supabase.table('tffrs_conferences').select('conference_name, scraped_at').execute()
        
        if result.data:
            print(f"\n📋 Remaining conferences ({len(result.data)}):")
            for conf in result.data:
                print(f"   • {conf['conference_name']} (scraped: {conf['scraped_at']})")
        else:
            print("ℹ️  No conferences found")
            
    except Exception as e:
        print(f"❌ Error checking conferences: {e}")

if __name__ == "__main__":
    cleanup_test_conferences()
