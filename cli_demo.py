#!/usr/bin/env python3
"""
CLI Demo for Nigerian Tax Reform Acts RAG System.
Interactive command-line interface for querying tax legislation.
"""

import os
import sys
import argparse
from pathlib import Path
from datetime import datetime

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

try:
    from retriever import TaxActRetriever
    from generator import AnswerGenerator, RAGPipeline
except ImportError as e:
    print(f"❌ Error importing modules: {e}")
    print("Make sure you've run the setup scripts first.")
    sys.exit(1)

from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent / ".env.backend")

def print_header():
    """Print CLI header."""
    print("=" * 80)
    print("Nigerian Tax Reform Acts 2025-2026 - RAG System")
    print("=" * 80)
    print("Timezone: Africa/Lagos")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 80)
    print()

def print_result(result: dict, verbose: bool = False):
    """
    Print query result in formatted way.

    Args:
        result: Result dictionary from RAG pipeline
        verbose: Whether to show detailed information
    """
    print("\n" + "─" * 80)
    print("ANSWER:")
    print("─" * 80)
    print(result.get("answer", "No answer generated."))
    print()

    # Print sources
    if result.get("sources"):
        print("─" * 80)
        print(result["sources"])
        print("─" * 80)

    # Print metadata if verbose
    if verbose:
        print("\n" + "─" * 80)
        print("METADATA:")
        print("─" * 80)
        print(f"Retrieved chunks: {result.get('retrieved_chunks', 0)}")
        print(f"Model: {result.get('model', 'N/A')}")

        if result.get("tokens_used"):
            tokens = result["tokens_used"]
            print(f"Tokens used: {tokens.get('total', 0)} "
                  f"(prompt: {tokens.get('prompt', 0)}, "
                  f"completion: {tokens.get('completion', 0)})")

        print(f"Finish reason: {result.get('finish_reason', 'N/A')}")
        print("─" * 80)

def interactive_mode(pipeline: RAGPipeline):
    """
    Run in interactive mode.

    Args:
        pipeline: RAGPipeline instance
    """
    print_header()
    print("Interactive Mode")
    print("Type your questions about Nigerian tax law. Type 'exit' or 'quit' to end.")
    print()

    while True:
        try:
            # Get query
            query = input("\n🔍 Question: ").strip()

            if not query:
                continue

            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Goodbye!")
                break

            # Special commands
            if query.lower() == 'help':
                print("\nAvailable commands:")
                print("  help     - Show this help message")
                print("  exit     - Exit the program")
                print("  clear    - Clear screen")
                print("\nOr type any question about Nigerian tax law.")
                continue

            if query.lower() == 'clear':
                os.system('clear' if os.name != 'nt' else 'cls')
                print_header()
                continue

            # Execute query
            print("\n⏳ Retrieving information...")
            result = pipeline.query(query)

            # Print result
            print_result(result, verbose=False)

        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            if os.getenv("DEBUG"):
                import traceback
                traceback.print_exc()

def single_query_mode(pipeline: RAGPipeline, query: str, verbose: bool = False):
    """
    Run a single query.

    Args:
        pipeline: RAGPipeline instance
        query: Query string
        verbose: Show detailed metadata
    """
    print_header()
    print(f"Query: {query}")
    print()

    try:
        print("⏳ Retrieving information...")
        result = pipeline.query(query)
        print_result(result, verbose=verbose)

        return 0

    except Exception as e:
        print(f"❌ Error: {e}")
        if os.getenv("DEBUG") or verbose:
            import traceback
            traceback.print_exc()
        return 1

def batch_mode(pipeline: RAGPipeline, queries_file: Path, output_file: Path):
    """
    Process queries from a file.

    Args:
        pipeline: RAGPipeline instance
        queries_file: File containing queries (one per line)
        output_file: Output file for results
    """
    print_header()
    print(f"Batch Mode")
    print(f"Input: {queries_file}")
    print(f"Output: {output_file}")
    print()

    try:
        # Read queries
        with open(queries_file, 'r', encoding='utf-8') as f:
            queries = [line.strip() for line in f if line.strip()]

        print(f"Processing {len(queries)} queries...")

        results = []

        for i, query in enumerate(queries, 1):
            print(f"\n[{i}/{len(queries)}] {query}")

            try:
                result = pipeline.query(query)
                results.append({
                    "query": query,
                    "answer": result.get("answer"),
                    "sources": result.get("source_list"),
                    "metadata": {
                        "retrieved_chunks": result.get("retrieved_chunks"),
                        "tokens_used": result.get("tokens_used")
                    }
                })
                print("  ✓ Done")

            except Exception as e:
                print(f"  ✗ Error: {e}")
                results.append({
                    "query": query,
                    "error": str(e)
                })

        # Save results
        import json
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Results saved to: {output_file}")
        return 0

    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

def main():
    """Main CLI function."""
    parser = argparse.ArgumentParser(
        description="Nigerian Tax Reform Acts RAG System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Interactive mode
  python cli_demo.py

  # Single query
  python cli_demo.py "What is the commencement date?"

  # Verbose output
  python cli_demo.py "Define taxable income" --verbose

  # Batch processing
  python cli_demo.py --batch queries.txt --output results.json

  # Use FAISS instead of ChromaDB
  python cli_demo.py "VAT rate?" --use-faiss
        """
    )

    parser.add_argument(
        "query",
        nargs="?",
        help="Question to ask (interactive mode if omitted)"
    )

    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Show detailed metadata"
    )

    parser.add_argument(
        "-k", "--top-k",
        type=int,
        help="Number of chunks to retrieve (default: 5)"
    )

    parser.add_argument(
        "-t", "--temperature",
        type=float,
        default=0.1,
        help="Model temperature (default: 0.1)"
    )

    parser.add_argument(
        "--use-faiss",
        action="store_true",
        help="Use FAISS instead of ChromaDB"
    )

    parser.add_argument(
        "--batch",
        type=Path,
        help="Batch mode: process queries from file"
    )

    parser.add_argument(
        "--output",
        type=Path,
        help="Output file for batch mode results"
    )

    args = parser.parse_args()

    # Validate batch mode arguments
    if args.batch and not args.output:
        parser.error("--output is required when using --batch")

    # Initialize retriever
    try:
        print("🔧 Initializing retriever...")
        retriever = TaxActRetriever(
            top_k=args.top_k,
            use_chromadb=not args.use_faiss
        )
        print("✓ Retriever initialized")

        print("🔧 Initializing generator...")
        generator = AnswerGenerator()
        print("✓ Generator initialized")

        print("🔧 Building RAG pipeline...")
        pipeline = RAGPipeline(retriever, generator)
        print("✓ Pipeline ready\n")

    except Exception as e:
        print(f"❌ Error initializing system: {e}")
        print("\nMake sure you've run the setup scripts:")
        print("  1. python scripts/01_fetch_sources.py")
        print("  2. python scripts/02_parse_pdf.py")
        print("  3. python scripts/03_make_chunks.py")
        print("  4. python scripts/04_embed_and_index.py")
        return 1

    # Run appropriate mode
    if args.batch:
        return batch_mode(pipeline, args.batch, args.output)
    elif args.query:
        return single_query_mode(pipeline, args.query, args.verbose)
    else:
        interactive_mode(pipeline)
        return 0

if __name__ == "__main__":
    sys.exit(main())
