#!/usr/bin/env python3
"""
Setup script to initialize Supabase database with users table.
Run this once to create the required database schema.
"""

import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env.backend"
load_dotenv(env_path)

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("🔧 Supabase Database Setup")
print("=" * 50)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: SUPABASE_URL and SUPABASE_KEY must be set in .env.backend")
    exit(1)

if SUPABASE_URL == "your_supabase_url_here":
    print("❌ Error: Please update SUPABASE_URL in .env.backend with your actual Supabase URL")
    exit(1)

print(f"✅ Supabase URL: {SUPABASE_URL}")
print(f"✅ API Key: {SUPABASE_KEY[:20]}...")

# Create Supabase client
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Connected to Supabase successfully!")
except Exception as e:
    print(f"❌ Error connecting to Supabase: {e}")
    exit(1)

# Read SQL schema
sql_file = Path(__file__).parent / "supabase_schema.sql"
if not sql_file.exists():
    print(f"❌ Error: {sql_file} not found")
    exit(1)

with open(sql_file, 'r') as f:
    sql_schema = f.read()

print("\n📋 SQL Schema loaded successfully")
print("=" * 50)

# Note: The Supabase Python client doesn't directly execute arbitrary SQL
# You need to run the SQL manually in Supabase SQL Editor

print("\n⚠️  MANUAL STEP REQUIRED:")
print("=" * 50)
print("The Supabase Python client cannot execute the SQL schema directly.")
print("Please follow these steps:")
print()
print("1. Go to: https://supabase.com/dashboard")
print(f"2. Open your project: {SUPABASE_URL}")
print("3. Click 'SQL Editor' in the left sidebar")
print("4. Click 'New Query'")
print("5. Copy and paste the contents of 'supabase_schema.sql'")
print("6. Click 'Run' (bottom right)")
print()
print("After running the SQL, come back and press Enter to test the connection...")

input()

# Test the connection by trying to query the legal_aid_users table
try:
    result = supabase.table("legal_aid_users").select("*").limit(1).execute()
    print("\n✅ legal_aid_users table exists and is accessible!")
    print(f"   Table has {len(result.data)} test record(s)")
    print("\n🎉 Supabase setup complete!")
    print("=" * 50)
    print("You can now run the server and test the email gate!")
except Exception as e:
    print(f"\n❌ Error: legal_aid_users table not found or not accessible")
    print(f"   Error details: {e}")
    print("\n   Please make sure you ran the SQL schema in Supabase SQL Editor")
    exit(1)
