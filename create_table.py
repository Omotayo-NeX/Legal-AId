#!/usr/bin/env python3
"""
Automated script to create Supabase users table.
"""

import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env.backend"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("🔧 Creating Supabase Users Table")
print("=" * 60)

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"✅ Connected to Supabase: {SUPABASE_URL}")

    # Test if table already exists
    try:
        result = supabase.table("legal_aid_users").select("id").limit(1).execute()
        print("✅ legal_aid_users table already exists!")
        print(f"   Current records: {len(result.data)}")
        print("\n✨ Database is ready to use!")
        sys.exit(0)
    except Exception as e:
        print(f"⚠️  legal_aid_users table doesn't exist yet: {str(e)[:100]}")
        print("\n📋 Creating legal_aid_users table...")

    # The Python client can't create tables, need to use SQL Editor
    print("\n" + "=" * 60)
    print("⚠️  MANUAL STEP REQUIRED")
    print("=" * 60)
    print("\nThe Supabase Python client cannot create tables directly.")
    print("Please run the SQL manually:")
    print()
    print("1. Visit: https://supabase.com/dashboard/project/gxthnrdeuhiykybpfrae/sql/new")
    print("2. Copy ALL contents from 'supabase_schema.sql'")
    print("3. Paste into SQL Editor")
    print("4. Click 'Run' button")
    print("5. Run this script again to verify")
    print()
    print("=" * 60)

except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
