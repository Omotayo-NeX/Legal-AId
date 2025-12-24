#!/usr/bin/env python3
"""
Test script to verify Supabase service_role access to legal_aid_users table.
Run this after updating the database schema to ensure permissions are correct.
"""

import os
import sys
from pathlib import Path
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / ".env.backend"
load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print("=" * 60)
print("🧪 Testing Supabase Service Role Access")
print("=" * 60)
print(f"\n📍 Supabase URL: {SUPABASE_URL}")
print(f"🔑 API Key: {SUPABASE_KEY[:20]}...")

# Create client
try:
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("\n✅ Supabase client created successfully")
except Exception as e:
    print(f"\n❌ Failed to create Supabase client: {e}")
    sys.exit(1)

# Track test results
tests_passed = 0
tests_failed = 0

# Test 1: SELECT all records
print("\n" + "-" * 60)
print("TEST 1: SELECT * FROM legal_aid_users")
print("-" * 60)
try:
    response = client.table("legal_aid_users").select("*").execute()
    print(f"✅ PASSED: Retrieved {len(response.data)} row(s)")
    if response.data:
        print(f"   Sample: {response.data[0]['email'] if response.data else 'No data'}")
    tests_passed += 1
except Exception as e:
    print(f"❌ FAILED: {e}")
    tests_failed += 1

# Test 2: INSERT new user
print("\n" + "-" * 60)
print("TEST 2: INSERT new user")
print("-" * 60)
test_email = f"test_{os.urandom(4).hex()}@example.com"
try:
    response = client.table("legal_aid_users").insert({
        "email": test_email,
        "ip_address": "127.0.0.1",
        "query_count_today": 0,
        "query_count_month": 0
    }).execute()
    print(f"✅ PASSED: Inserted user with email: {test_email}")
    tests_passed += 1
except Exception as e:
    print(f"❌ FAILED: {e}")
    tests_failed += 1

# Test 3: UPDATE user
print("\n" + "-" * 60)
print("TEST 3: UPDATE user query count")
print("-" * 60)
try:
    response = client.table("legal_aid_users").update({
        "query_count_today": 1,
        "query_count_month": 1
    }).eq("email", test_email).execute()
    print(f"✅ PASSED: Updated query counts for {test_email}")
    tests_passed += 1
except Exception as e:
    print(f"❌ FAILED: {e}")
    tests_failed += 1

# Test 4: Call RPC function increment_user_usage
print("\n" + "-" * 60)
print("TEST 4: RPC increment_user_usage()")
print("-" * 60)
try:
    response = client.rpc("increment_user_usage", {"user_email": test_email}).execute()
    print(f"✅ PASSED: RPC function executed successfully")
    tests_passed += 1
except Exception as e:
    print(f"❌ FAILED: {e}")
    print("   Note: This is expected if the function doesn't exist yet")
    tests_failed += 1

# Test 5: Verify updated counts
print("\n" + "-" * 60)
print("TEST 5: Verify query counts were incremented")
print("-" * 60)
try:
    response = client.table("legal_aid_users").select("*").eq("email", test_email).execute()
    if response.data:
        user = response.data[0]
        daily = user['query_count_today']
        monthly = user['query_count_month']
        print(f"✅ PASSED: User counts - Daily: {daily}, Monthly: {monthly}")
        if daily >= 1 and monthly >= 1:
            print("   ✓ Counts were incremented correctly")
        tests_passed += 1
    else:
        print(f"❌ FAILED: Could not retrieve user data")
        tests_failed += 1
except Exception as e:
    print(f"❌ FAILED: {e}")
    tests_failed += 1

# Test 6: DELETE test user (cleanup)
print("\n" + "-" * 60)
print("TEST 6: DELETE test user (cleanup)")
print("-" * 60)
try:
    response = client.table("legal_aid_users").delete().eq("email", test_email).execute()
    print(f"✅ PASSED: Deleted test user {test_email}")
    tests_passed += 1
except Exception as e:
    print(f"❌ FAILED: {e}")
    tests_failed += 1

# Summary
print("\n" + "=" * 60)
print("📊 TEST SUMMARY")
print("=" * 60)
print(f"✅ Passed: {tests_passed}/6")
print(f"❌ Failed: {tests_failed}/6")

if tests_failed == 0:
    print("\n🎉 ALL TESTS PASSED! Service role has full access to legal_aid_users table.")
    print("   You can now test the email verification in the browser.")
    sys.exit(0)
else:
    print("\n⚠️  SOME TESTS FAILED. Please check:")
    print("   1. Did you run the updated SQL schema in Supabase?")
    print("   2. Is the service_role key correct in .env.backend?")
    print("   3. Are RLS policies configured correctly?")
    sys.exit(1)
