#!/usr/bin/env python3
"""
Test suite for Nigerian Tax Reform Acts RAG System.
Tests retrieval quality and answer generation.
"""

import sys
from pathlib import Path

# Add parent and src to path
sys.path.insert(0, str(Path(__file__).parent.parent))
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

try:
    from retriever import TaxActRetriever
    from generator import AnswerGenerator, RAGPipeline
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    print("Make sure you've run the setup scripts first.")
    sys.exit(1)

# Test queries based on requirements
TEST_QUERIES = [
    {
        "id": "commencement_date",
        "question": "What is the commencement date?",
        "expected_keywords": ["commencement", "date", "2025", "2026"],
        "description": "Test retrieval of commencement date"
    },
    {
        "id": "taxable_income_companies",
        "question": "Define taxable income for companies.",
        "expected_keywords": ["taxable", "income", "companies", "corporation"],
        "description": "Test definition retrieval for companies"
    },
    {
        "id": "taxable_income_individuals",
        "question": "Define taxable income for individuals.",
        "expected_keywords": ["taxable", "income", "individuals", "personal"],
        "description": "Test definition retrieval for individuals"
    },
    {
        "id": "digital_assets",
        "question": "Are digital or virtual assets covered?",
        "expected_keywords": ["digital", "virtual", "assets", "cryptocurrency"],
        "description": "Test coverage of digital assets"
    },
    {
        "id": "firs_replacement",
        "question": "Who replaces FIRS in the 2026 regime?",
        "expected_keywords": ["FIRS", "replace", "2026", "revenue", "service"],
        "description": "Test institutional changes"
    },
    {
        "id": "dividend_treatment",
        "question": "What is the treatment of dividends paid out of untaxed profits?",
        "expected_keywords": ["dividend", "untaxed", "profit", "treatment"],
        "description": "Test specific tax treatment rules"
    },
    {
        "id": "vat_rate",
        "question": "What is the VAT rate?",
        "expected_keywords": ["VAT", "rate", "percent", "%"],
        "description": "Test rate retrieval"
    },
    {
        "id": "freelancer_vat",
        "question": "Do freelancers need to charge VAT under 2026 Nigerian tax law?",
        "expected_keywords": ["freelance", "VAT", "charge", "requirement"],
        "description": "Test practical application questions"
    }
]

def print_test_header(test_num: int, total: int, test: dict):
    """Print test header."""
    print("\n" + "=" * 80)
    print(f"TEST {test_num}/{total}: {test['id']}")
    print("=" * 80)
    print(f"Question: {test['question']}")
    print(f"Description: {test['description']}")
    print()

def print_chunks(chunks: list):
    """Print retrieved chunks."""
    print("─" * 80)
    print("RETRIEVED CHUNKS:")
    print("─" * 80)

    for i, chunk in enumerate(chunks, 1):
        metadata = chunk.get("metadata", {})
        print(f"\n[Chunk {i}]")
        print(f"Document: {metadata.get('document_name', 'N/A')}")
        print(f"Section: {metadata.get('section_number', 'N/A')} - {metadata.get('section_title', 'N/A')}")
        print(f"Pages: {metadata.get('page_start', 'N/A')}-{metadata.get('page_end', 'N/A')}")
        print(f"Distance: {chunk.get('distance', 'N/A'):.4f}" if chunk.get('distance') else "Distance: N/A")
        print(f"\nText preview: {chunk.get('text', '')[:200]}...")

    print("\n" + "─" * 80)

def print_answer(result: dict):
    """Print generated answer."""
    print("\n" + "─" * 80)
    print("GENERATED ANSWER:")
    print("─" * 80)
    print(result.get("answer", "No answer generated."))
    print()

    if result.get("sources"):
        print("─" * 80)
        print(result["sources"])
        print("─" * 80)

def check_keywords(text: str, keywords: list) -> dict:
    """
    Check if keywords appear in text.

    Args:
        text: Text to search
        keywords: Keywords to find

    Returns:
        Dictionary with results
    """
    text_lower = text.lower()
    found = []
    missing = []

    for keyword in keywords:
        if keyword.lower() in text_lower:
            found.append(keyword)
        else:
            missing.append(keyword)

    return {
        "found": found,
        "missing": missing,
        "score": len(found) / len(keywords) if keywords else 0
    }

def run_test(pipeline: RAGPipeline, test: dict, test_num: int, total: int) -> dict:
    """
    Run a single test.

    Args:
        pipeline: RAGPipeline instance
        test: Test dictionary
        test_num: Test number
        total: Total number of tests

    Returns:
        Test result dictionary
    """
    print_test_header(test_num, total, test)

    try:
        # Retrieve chunks
        print("⏳ Retrieving chunks...")
        chunks = pipeline.retriever.retrieve(test["question"])

        print(f"✓ Retrieved {len(chunks)} chunks")

        # Print chunks
        print_chunks(chunks)

        # Generate answer
        print("\n⏳ Generating answer...")
        result = pipeline.query(test["question"])

        print("✓ Answer generated")

        # Print answer and sources
        print_answer(result)

        # Check keywords in answer
        keyword_check = check_keywords(
            result.get("answer", ""),
            test["expected_keywords"]
        )

        print("\n" + "─" * 80)
        print("KEYWORD ANALYSIS:")
        print("─" * 80)
        print(f"Score: {keyword_check['score']:.1%}")
        print(f"Found: {', '.join(keyword_check['found']) if keyword_check['found'] else 'None'}")
        print(f"Missing: {', '.join(keyword_check['missing']) if keyword_check['missing'] else 'None'}")
        print("─" * 80)

        return {
            "test_id": test["id"],
            "question": test["question"],
            "status": "success",
            "chunks_retrieved": len(chunks),
            "answer_length": len(result.get("answer", "")),
            "keyword_score": keyword_check["score"],
            "keywords_found": keyword_check["found"],
            "keywords_missing": keyword_check["missing"],
            "tokens_used": result.get("tokens_used"),
            "sources_count": len(result.get("source_list", []))
        }

    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")

        if sys.argv and "--debug" in sys.argv:
            import traceback
            traceback.print_exc()

        return {
            "test_id": test["id"],
            "question": test["question"],
            "status": "error",
            "error": str(e)
        }

def print_summary(results: list):
    """Print test summary."""
    print("\n\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)

    successful = [r for r in results if r["status"] == "success"]
    failed = [r for r in results if r["status"] == "error"]

    print(f"\nTotal tests: {len(results)}")
    print(f"Successful: {len(successful)}")
    print(f"Failed: {len(failed)}")

    if successful:
        avg_keyword_score = sum(r["keyword_score"] for r in successful) / len(successful)
        avg_chunks = sum(r["chunks_retrieved"] for r in successful) / len(successful)
        avg_sources = sum(r["sources_count"] for r in successful) / len(successful)

        print(f"\nAverage keyword score: {avg_keyword_score:.1%}")
        print(f"Average chunks retrieved: {avg_chunks:.1f}")
        print(f"Average sources cited: {avg_sources:.1f}")

    # Token usage summary
    if successful:
        total_tokens = sum(
            r["tokens_used"]["total"]
            for r in successful
            if r.get("tokens_used")
        )
        print(f"\nTotal tokens used: {total_tokens:,}")

    # Individual test scores
    print("\n" + "─" * 80)
    print("INDIVIDUAL TEST SCORES:")
    print("─" * 80)

    for result in results:
        status_symbol = "✓" if result["status"] == "success" else "✗"
        score = f"{result['keyword_score']:.0%}" if result["status"] == "success" else "N/A"
        print(f"{status_symbol} {result['test_id']}: {score}")

    # Failed tests details
    if failed:
        print("\n" + "─" * 80)
        print("FAILED TESTS:")
        print("─" * 80)
        for result in failed:
            print(f"- {result['test_id']}: {result.get('error', 'Unknown error')}")

    print("\n" + "=" * 80)

def main():
    """Main test execution."""
    print("=" * 80)
    print("Nigerian Tax Reform Acts RAG System - Test Suite")
    print("=" * 80)

    # Initialize system
    try:
        print("\n🔧 Initializing RAG system...")
        retriever = TaxActRetriever(top_k=5)
        generator = AnswerGenerator()
        pipeline = RAGPipeline(retriever, generator)
        print("✓ System initialized\n")

    except Exception as e:
        print(f"\n❌ Error initializing system: {e}")
        print("\nMake sure you've run all setup scripts:")
        print("  1. python scripts/01_fetch_sources.py")
        print("  2. python scripts/02_parse_pdf.py")
        print("  3. python scripts/03_make_chunks.py")
        print("  4. python scripts/04_embed_and_index.py")
        return 1

    # Run tests
    results = []

    for i, test in enumerate(TEST_QUERIES, 1):
        result = run_test(pipeline, test, i, len(TEST_QUERIES))
        results.append(result)

    # Print summary
    print_summary(results)

    # Save results
    import json
    from datetime import datetime

    output_file = Path(__file__).parent / "test_results.json"
    output_data = {
        "timestamp": datetime.now().isoformat(),
        "timezone": "Africa/Lagos",
        "total_tests": len(results),
        "successful": len([r for r in results if r["status"] == "success"]),
        "failed": len([r for r in results if r["status"] == "error"]),
        "results": results
    }

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"\n📁 Results saved to: {output_file}")

    # Return exit code
    failed_count = len([r for r in results if r["status"] == "error"])
    return 0 if failed_count == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
