#!/usr/bin/env python3
"""
Semantic chunking system for Nigerian Tax Reform Acts.
Creates semantically meaningful chunks with context preservation and deduplication.
"""

import os
import sys
import json
import re
import hashlib
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Set
from collections import defaultdict

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env.backend")

# Directories
PROCESSED_DIR = Path(__file__).parent.parent / "data" / "processed"
OUTPUT_FILE = PROCESSED_DIR / "chunks.jsonl"

# Configuration
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "800"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "200"))
MIN_CHUNK_SIZE = 100

class SemanticChunker:
    """Creates semantic chunks from parsed tax documents."""

    def __init__(self, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
        """
        Initialize chunker.

        Args:
            chunk_size: Target chunk size in characters
            overlap: Overlap between chunks in characters
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
        self.seen_hashes: Set[str] = set()

    def normalize_text(self, text: str) -> str:
        """
        Normalize text for deduplication.

        Args:
            text: Input text

        Returns:
            Normalized text
        """
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,;:!?\-()]', '', text)
        return text.strip().lower()

    def compute_hash(self, text: str) -> str:
        """
        Compute hash of normalized text for deduplication.

        Args:
            text: Input text

        Returns:
            Hash string
        """
        normalized = self.normalize_text(text)
        return hashlib.md5(normalized.encode()).hexdigest()

    def is_duplicate(self, text: str, threshold: float = 0.95) -> bool:
        """
        Check if chunk is a near-duplicate.

        Args:
            text: Text to check
            threshold: Similarity threshold (not used in simple hash method)

        Returns:
            True if duplicate
        """
        chunk_hash = self.compute_hash(text)

        if chunk_hash in self.seen_hashes:
            return True

        self.seen_hashes.add(chunk_hash)
        return False

    def split_by_sentences(self, text: str) -> List[str]:
        """
        Split text by sentences.

        Args:
            text: Input text

        Returns:
            List of sentences
        """
        # Split on sentence boundaries
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
        return [s.strip() for s in sentences if s.strip()]

    def create_chunks_from_section(
        self,
        section: Dict[str, Any],
        document_context: Dict[str, str]
    ) -> List[Dict[str, Any]]:
        """
        Create chunks from a section with context preservation.

        Args:
            section: Section dictionary
            document_context: Document-level context

        Returns:
            List of chunk dictionaries
        """
        chunks = []
        content = section.get("content", "")

        if not content or len(content) < MIN_CHUNK_SIZE:
            return chunks

        # Split into sentences
        sentences = self.split_by_sentences(content)

        if not sentences:
            return chunks

        # Build chunks with overlap
        current_chunk = []
        current_size = 0

        for sentence in sentences:
            sentence_size = len(sentence)

            # If adding this sentence exceeds chunk size and we have content
            if current_size + sentence_size > self.chunk_size and current_chunk:
                # Create chunk
                chunk_text = " ".join(current_chunk)

                # Skip if duplicate
                if not self.is_duplicate(chunk_text):
                    chunk = self.create_chunk_metadata(
                        chunk_text,
                        section,
                        document_context
                    )
                    chunks.append(chunk)

                # Start new chunk with overlap
                # Keep last few sentences for context
                overlap_size = 0
                overlap_sentences = []

                for sent in reversed(current_chunk):
                    if overlap_size + len(sent) <= self.overlap:
                        overlap_sentences.insert(0, sent)
                        overlap_size += len(sent)
                    else:
                        break

                current_chunk = overlap_sentences
                current_size = overlap_size

            current_chunk.append(sentence)
            current_size += sentence_size

        # Add final chunk
        if current_chunk:
            chunk_text = " ".join(current_chunk)
            if not self.is_duplicate(chunk_text):
                chunk = self.create_chunk_metadata(
                    chunk_text,
                    section,
                    document_context
                )
                chunks.append(chunk)

        return chunks

    def create_chunk_metadata(
        self,
        text: str,
        section: Dict[str, Any],
        document_context: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Create chunk with rich metadata.

        Args:
            text: Chunk text
            section: Source section
            document_context: Document context

        Returns:
            Chunk dictionary
        """
        # Detect if this chunk contains specific types of information
        uncertainty_notes = self.detect_uncertainties(text)

        chunk = {
            "text": text.strip(),
            "document_name": document_context["document_name"],
            "document_type": document_context["document_type"],
            "section_type": section.get("type", ""),
            "section_number": str(section.get("number", "")),
            "section_title": section.get("title", ""),
            "page_start": section.get("page_start", 0),
            "page_end": section.get("page_end", 0),
            "char_count": len(text),
            "word_count": len(text.split()),
            "hash": self.compute_hash(text),
            "contains_definition": self.contains_definition(text),
            "contains_rate": self.contains_rate(text),
            "contains_date": self.contains_date(text),
            "contains_amount": self.contains_amount(text),
            "uncertainty_notes": uncertainty_notes
        }

        return chunk

    def contains_definition(self, text: str) -> bool:
        """Check if text contains a definition."""
        patterns = [
            r'means\s+',
            r'refers to\s+',
            r'includes\s+',
            r'["""].*?["""].*?(?:means|refers|includes)'
        ]
        return any(re.search(pattern, text, re.IGNORECASE) for pattern in patterns)

    def contains_rate(self, text: str) -> bool:
        """Check if text contains tax rates or percentages."""
        return bool(re.search(r'\d+(?:\.\d+)?%|\d+\s*per\s*cent', text, re.IGNORECASE))

    def contains_date(self, text: str) -> bool:
        """Check if text contains dates."""
        patterns = [
            r'\d{1,2}[-/]\d{1,2}[-/]\d{2,4}',
            r'\d{4}[-/]\d{1,2}[-/]\d{1,2}',
            r'(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}',
            r'\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}'
        ]
        return any(re.search(pattern, text, re.IGNORECASE) for pattern in patterns)

    def contains_amount(self, text: str) -> bool:
        """Check if text contains monetary amounts."""
        patterns = [
            r'₦\s*\d+(?:,\d{3})*(?:\.\d{2})?',
            r'NGN\s*\d+(?:,\d{3})*(?:\.\d{2})?',
            r'Naira\s+\d+(?:,\d{3})*(?:\.\d{2})?'
        ]
        return any(re.search(pattern, text, re.IGNORECASE) for pattern in patterns)

    def detect_uncertainties(self, text: str) -> List[str]:
        """
        Detect conflicting or uncertain information.

        Args:
            text: Text to analyze

        Returns:
            List of uncertainty notes
        """
        notes = []

        # Check for conditional language
        if re.search(r'(?:may|might|could|should|would|uncertain|unclear|subject to)', text, re.IGNORECASE):
            notes.append("Contains conditional or uncertain language")

        # Check for conflicting rates (multiple percentages)
        rates = re.findall(r'(\d+(?:\.\d+)?%)', text)
        if len(rates) > 2:
            notes.append(f"Multiple rates mentioned: {', '.join(set(rates))}")

        # Check for amendments or changes
        if re.search(r'(?:amend|repeal|replace|substitute|modify|change)', text, re.IGNORECASE):
            notes.append("Contains amendments or changes to existing law")

        # Check for exceptions
        if re.search(r'(?:except|unless|provided that|save|notwithstanding)', text, re.IGNORECASE):
            notes.append("Contains exceptions or special conditions")

        return notes

def process_document(parsed_file: Path, chunker: SemanticChunker) -> List[Dict[str, Any]]:
    """
    Process a parsed document and create chunks.

    Args:
        parsed_file: Path to parsed JSON file
        chunker: SemanticChunker instance

    Returns:
        List of chunks
    """
    print(f"\n📄 Processing: {parsed_file.name}")

    with open(parsed_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    document_context = {
        "document_name": data.get("filename", ""),
        "document_type": "primary_legislation"
    }

    all_chunks = []

    sections = data.get("sections", [])
    print(f"   Found {len(sections)} sections")

    if sections:
        # Process documents with section structure
        for section in sections:
            chunks = chunker.create_chunks_from_section(section, document_context)
            all_chunks.extend(chunks)
    else:
        # Process documents without sections - chunk the full text from pages
        pages = data.get("pages", [])
        if pages:
            # Extract text from all pages
            full_text = "\n\n".join(page.get("text", "") for page in pages if page.get("text"))
            if full_text:
                print(f"   No sections found, chunking full text from {len(pages)} pages ({len(full_text)} characters)")
                # Create a pseudo-section for the full document
                pseudo_section = {
                    "type": "full_document",
                    "number": "",
                    "title": data.get("metadata", {}).get("title", "Document"),
                    "content": full_text,  # Changed from "text" to "content"
                    "page_start": 1,
                    "page_end": len(pages)
                }
                chunks = chunker.create_chunks_from_section(pseudo_section, document_context)
                all_chunks.extend(chunks)

    print(f"   ✅ Created {len(all_chunks)} chunks")

    return all_chunks

def validate_chunks(chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validate chunks and generate quality report.

    Args:
        chunks: List of chunks

    Returns:
        Validation report
    """
    report = {
        "total_chunks": len(chunks),
        "valid_chunks": 0,
        "invalid_chunks": 0,
        "issues": []
    }

    for i, chunk in enumerate(chunks):
        # Check required fields
        required_fields = ["text", "document_name", "section_number", "section_title"]
        missing_fields = [f for f in required_fields if not chunk.get(f)]

        if missing_fields:
            report["invalid_chunks"] += 1
            report["issues"].append({
                "chunk_index": i,
                "issue": "Missing required fields",
                "fields": missing_fields
            })
        else:
            report["valid_chunks"] += 1

        # Check text length
        if len(chunk.get("text", "")) < MIN_CHUNK_SIZE:
            report["issues"].append({
                "chunk_index": i,
                "issue": "Text too short",
                "length": len(chunk.get("text", ""))
            })

    return report

def main():
    """Main execution function."""
    print("=" * 70)
    print("Nigerian Tax Reform Acts - Semantic Chunker")
    print("=" * 70)
    print(f"Chunk size: {CHUNK_SIZE}")
    print(f"Overlap: {CHUNK_OVERLAP}")

    # Find all parsed files
    parsed_files = list(PROCESSED_DIR.glob("*_parsed.json"))

    if not parsed_files:
        print("❌ Error: No parsed files found. Run 02_parse_pdf.py first.")
        return 1

    print(f"\nFound {len(parsed_files)} parsed documents")

    chunker = SemanticChunker(chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP)
    all_chunks = []

    # Process each document
    for parsed_file in parsed_files:
        chunks = process_document(parsed_file, chunker)
        all_chunks.extend(chunks)

    print(f"\n" + "=" * 70)
    print(f"Total chunks created: {len(all_chunks)}")
    print(f"Duplicates removed: {len(chunker.seen_hashes) - len(all_chunks)}")

    # Validate chunks
    print("\n🔍 Validating chunks...")
    validation_report = validate_chunks(all_chunks)

    print(f"   Valid: {validation_report['valid_chunks']}")
    print(f"   Invalid: {validation_report['invalid_chunks']}")

    if validation_report['issues']:
        print(f"   ⚠️  Issues found: {len(validation_report['issues'])}")
        # Show first few issues
        for issue in validation_report['issues'][:3]:
            print(f"      - Chunk {issue['chunk_index']}: {issue['issue']}")

    # Save chunks as JSONL
    print(f"\n💾 Saving chunks to: {OUTPUT_FILE}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        for chunk in all_chunks:
            f.write(json.dumps(chunk, ensure_ascii=False) + '\n')

    # Save metadata
    metadata = {
        "timestamp": datetime.now().isoformat(),
        "timezone": "Africa/Lagos",
        "chunk_count": len(all_chunks),
        "chunk_size": CHUNK_SIZE,
        "chunk_overlap": CHUNK_OVERLAP,
        "validation_report": validation_report,
        "statistics": {
            "with_definitions": sum(1 for c in all_chunks if c.get("contains_definition")),
            "with_rates": sum(1 for c in all_chunks if c.get("contains_rate")),
            "with_dates": sum(1 for c in all_chunks if c.get("contains_date")),
            "with_amounts": sum(1 for c in all_chunks if c.get("contains_amount")),
            "with_uncertainties": sum(1 for c in all_chunks if c.get("uncertainty_notes"))
        }
    }

    metadata_file = PROCESSED_DIR / "chunks_metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"   ✅ Saved {len(all_chunks)} chunks")
    print(f"   📊 Statistics:")
    print(f"      - With definitions: {metadata['statistics']['with_definitions']}")
    print(f"      - With rates: {metadata['statistics']['with_rates']}")
    print(f"      - With dates: {metadata['statistics']['with_dates']}")
    print(f"      - With amounts: {metadata['statistics']['with_amounts']}")
    print(f"      - With uncertainties: {metadata['statistics']['with_uncertainties']}")

    print("\n✅ Chunking completed successfully!")
    return 0

if __name__ == "__main__":
    sys.exit(main())
