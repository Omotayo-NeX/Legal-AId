#!/usr/bin/env python3
"""
Test script to verify Railway deployment is working correctly.
Usage: python test_deployment.py <your-railway-url>
Example: python test_deployment.py https://legal-aid-production.up.railway.app
"""

import sys
import json
import requests
from datetime import datetime

def test_health(base_url):
    """Test the health endpoint."""
    print("\n" + "="*70)
    print("1. Testing Health Endpoint")
    print("="*70)

    try:
        response = requests.get(f"{base_url}/health", timeout=10)

        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed!")
            print(f"   Status: {data.get('status')}")
            print(f"   RAG Initialized: {data.get('rag_initialized')}")
            print(f"   Timestamp: {data.get('timestamp')}")
            return True
        else:
            print(f"❌ Health check failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error connecting to health endpoint: {e}")
        return False

def test_stats(base_url):
    """Test the stats endpoint."""
    print("\n" + "="*70)
    print("2. Testing Stats Endpoint")
    print("="*70)

    try:
        response = requests.get(f"{base_url}/stats", timeout=10)

        if response.status_code == 200:
            data = response.json()
            print("✅ Stats endpoint working!")
            print(f"   Status: {data.get('status')}")

            if data.get('total_chunks'):
                print(f"   Total Chunks: {data.get('total_chunks')}")
                print(f"   Embedding Model: {data.get('embedding_model')}")
                print(f"   Dimension: {data.get('embedding_dimension')}")
                print(f"   Last Updated: {data.get('last_updated')}")
            else:
                print(f"   Message: {data.get('message')}")

            return True
        else:
            print(f"❌ Stats endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error connecting to stats endpoint: {e}")
        return False

def test_chat(base_url):
    """Test the chat endpoint with a sample query."""
    print("\n" + "="*70)
    print("3. Testing Chat Endpoint (RAG Query)")
    print("="*70)

    test_query = "What is the commencement date of the Nigeria Tax Reform Acts?"
    print(f"\n📝 Query: {test_query}")

    try:
        response = requests.post(
            f"{base_url}/chat",
            json={
                "message": test_query,
                "conversation_history": []
            },
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            data = response.json()
            print("\n✅ Chat endpoint working!")
            print("\n📖 Answer:")
            print("-" * 70)
            print(data.get('answer', 'No answer provided'))
            print("-" * 70)

            print(f"\n📚 Sources ({len(data.get('sources', []))} found):")
            for i, source in enumerate(data.get('sources', []), 1):
                print(f"   {i}. {source.get('document', 'Unknown')}")
                if source.get('section'):
                    print(f"      Section: {source.get('section')}")
                if source.get('title'):
                    print(f"      Title: {source.get('title')}")
                if source.get('pages'):
                    print(f"      Pages: {source.get('pages')}")

            print(f"\n📊 Metadata:")
            print(f"   Retrieved Chunks: {data.get('retrieved_chunks')}")
            print(f"   Has RAG Context: {data.get('has_rag_context')}")
            print(f"   Timestamp: {data.get('timestamp')}")

            if data.get('metadata'):
                meta = data['metadata']
                if meta.get('tokens_used'):
                    print(f"   Tokens Used: {meta['tokens_used']}")
                if meta.get('model'):
                    print(f"   Model: {meta['model']}")

            return True
        else:
            print(f"❌ Chat endpoint failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error with chat endpoint: {e}")
        return False

def test_non_tax_query(base_url):
    """Test that non-tax queries are handled correctly."""
    print("\n" + "="*70)
    print("4. Testing Non-Tax Query Handling")
    print("="*70)

    test_query = "What is the weather like today?"
    print(f"\n📝 Query: {test_query}")

    try:
        response = requests.post(
            f"{base_url}/chat",
            json={"message": test_query},
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 200:
            data = response.json()
            if not data.get('has_rag_context'):
                print("✅ Non-tax query correctly handled!")
                print(f"   Message: {data.get('answer')[:150]}...")
                return True
            else:
                print("⚠️  Non-tax query was processed as tax-related")
                return False
        else:
            print(f"❌ Request failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_search(base_url):
    """Test the search endpoint."""
    print("\n" + "="*70)
    print("5. Testing Search Endpoint")
    print("="*70)

    test_query = "VAT"
    print(f"\n🔍 Search Query: {test_query}")

    try:
        response = requests.post(
            f"{base_url}/search",
            params={"query": test_query, "top_k": 3},
            timeout=30
        )

        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Search endpoint working!")
            print(f"   Query: {data.get('query')}")
            print(f"   Total Results: {data.get('total_results')}")

            for i, result in enumerate(data.get('results', [])[:3], 1):
                print(f"\n   Result {i}:")
                print(f"      Document: {result.get('document')}")
                print(f"      Section: {result.get('section')}")
                print(f"      Text Preview: {result.get('text', '')[:100]}...")

            return True
        else:
            print(f"❌ Search endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all deployment tests."""
    if len(sys.argv) < 2:
        print("Usage: python test_deployment.py <railway-url>")
        print("Example: python test_deployment.py https://legal-aid-production.up.railway.app")
        sys.exit(1)

    base_url = sys.argv[1].rstrip('/')

    print("\n" + "="*70)
    print("🚀 RAILWAY DEPLOYMENT TEST")
    print("="*70)
    print(f"Base URL: {base_url}")
    print(f"Test Time: {datetime.now().isoformat()}")

    # Run all tests
    results = {
        "Health Check": test_health(base_url),
        "Stats Endpoint": test_stats(base_url),
        "Chat Endpoint": test_chat(base_url),
        "Non-Tax Query": test_non_tax_query(base_url),
        "Search Endpoint": test_search(base_url)
    }

    # Summary
    print("\n" + "="*70)
    print("TEST SUMMARY")
    print("="*70)

    passed = sum(results.values())
    total = len(results)

    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:.<40} {status}")

    print("\n" + "="*70)
    print(f"Results: {passed}/{total} tests passed")
    print("="*70)

    if passed == total:
        print("\n🎉 All tests passed! Your deployment is working correctly.")
        print(f"\n📱 You can now integrate this API in your React Native app:")
        print(f"   const API_BASE_URL = '{base_url}';")
        print(f"\n📚 API Documentation: {base_url}/docs")
        return 0
    else:
        print("\n⚠️  Some tests failed. Check the logs above for details.")
        print("\nTroubleshooting:")
        print("1. Verify environment variables in Railway dashboard")
        print("2. Check Railway logs: railway logs")
        print("3. Ensure data files are committed to repository")
        print("4. Verify OPENAI_API_KEY has credits")
        return 1

if __name__ == "__main__":
    sys.exit(main())
