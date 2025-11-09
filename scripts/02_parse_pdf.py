#!/usr/bin/env python3
"""
PDF Parser for Nigerian Tax Reform Acts.
Uses PyMuPDF (fitz) to extract text, tables, and structure from PDF documents.
"""

import os
import sys
import json
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
import fitz  # PyMuPDF

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Directories
RAW_DIR = Path(__file__).parent.parent / "data" / "raw"
PROCESSED_DIR = Path(__file__).parent.parent / "data" / "processed"
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

class TaxActParser:
    """Parser for Nigerian Tax Reform Act PDFs."""

    def __init__(self, pdf_path: Path):
        """
        Initialize parser with PDF path.

        Args:
            pdf_path: Path to the PDF file
        """
        self.pdf_path = pdf_path
        self.doc = None
        self.metadata = {}
        self.toc = []
        self.sections = []

    def open_document(self) -> bool:
        """Open the PDF document."""
        try:
            self.doc = fitz.open(self.pdf_path)
            self.metadata = self.doc.metadata
            self.toc = self.doc.get_toc()  # Table of Contents
            print(f"   📄 Opened: {self.pdf_path.name}")
            print(f"   Pages: {len(self.doc)}")
            print(f"   Title: {self.metadata.get('title', 'N/A')}")
            return True
        except Exception as e:
            print(f"   ❌ Error opening PDF: {e}")
            return False

    def extract_text_with_structure(self) -> List[Dict[str, Any]]:
        """
        Extract text with hierarchical structure preservation.

        Returns:
            List of page dictionaries with extracted content
        """
        pages = []

        for page_num in range(len(self.doc)):
            page = self.doc[page_num]

            # Extract text with layout preservation
            text = page.get_text("text")

            # Extract text blocks with position info
            blocks = page.get_text("dict")["blocks"]

            # Filter text blocks
            text_blocks = []
            for block in blocks:
                if block["type"] == 0:  # Text block
                    block_text = ""
                    for line in block.get("lines", []):
                        for span in line.get("spans", []):
                            block_text += span.get("text", "")
                        block_text += "\n"

                    text_blocks.append({
                        "text": block_text.strip(),
                        "bbox": block["bbox"],
                        "page": page_num + 1
                    })

            page_data = {
                "page_number": page_num + 1,
                "text": text,
                "blocks": text_blocks,
                "width": page.rect.width,
                "height": page.rect.height
            }

            pages.append(page_data)

        return pages

    def identify_sections(self, pages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identify sections, parts, and articles from the document.

        Args:
            pages: List of page data

        Returns:
            List of section dictionaries
        """
        sections = []
        current_section = None

        # Regex patterns for Nigerian legal documents
        patterns = {
            "part": re.compile(r'^PART\s+([IVXLCDM]+|[0-9]+)[:\s\-]+(.+?)$', re.IGNORECASE | re.MULTILINE),
            "section": re.compile(r'^(?:Section\s+)?(\d+)[.\s\-]+(.+?)$', re.MULTILINE),
            "article": re.compile(r'^(?:Article\s+)?(\d+)[.\s\-]+(.+?)$', re.MULTILINE),
            "chapter": re.compile(r'^CHAPTER\s+([IVXLCDM]+|[0-9]+)[:\s\-]+(.+?)$', re.IGNORECASE | re.MULTILINE),
            "schedule": re.compile(r'^SCHEDULE\s+([IVXLCDM]+|[0-9]+)?[:\s\-]*(.+?)$', re.IGNORECASE | re.MULTILINE)
        }

        for page_data in pages:
            text = page_data["text"]
            page_num = page_data["page_number"]

            # Split into lines for processing
            lines = text.split('\n')

            for i, line in enumerate(lines):
                line = line.strip()
                if not line:
                    continue

                # Check for section patterns
                for section_type, pattern in patterns.items():
                    match = pattern.match(line)
                    if match:
                        # Save previous section
                        if current_section:
                            sections.append(current_section)

                        # Create new section
                        if section_type in ["part", "chapter", "schedule"]:
                            number = match.group(1) if match.group(1) else ""
                            title = match.group(2).strip()
                        else:
                            number = match.group(1)
                            title = match.group(2).strip()

                        current_section = {
                            "type": section_type,
                            "number": number,
                            "title": title,
                            "page_start": page_num,
                            "page_end": page_num,
                            "content": ""
                        }
                        break
                else:
                    # Add content to current section
                    if current_section:
                        current_section["content"] += line + "\n"
                        current_section["page_end"] = page_num

        # Add last section
        if current_section:
            sections.append(current_section)

        return sections

    def parse_toc(self) -> List[Dict[str, Any]]:
        """
        Parse table of contents.

        Returns:
            List of TOC entries
        """
        toc_entries = []

        for level, title, page in self.toc:
            toc_entries.append({
                "level": level,
                "title": title.strip(),
                "page": page
            })

        return toc_entries

    def extract_definitions(self, pages: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """
        Extract definitions section.

        Args:
            pages: List of page data

        Returns:
            List of definition dictionaries
        """
        definitions = []
        in_definitions = False

        for page_data in pages:
            text = page_data["text"]

            # Look for definitions section
            if re.search(r'(?:interpretation|definitions?|meaning)', text, re.IGNORECASE):
                in_definitions = True

            if in_definitions:
                # Pattern: "term" means ...
                pattern = r'["""]([^"""]+)["""](?:\s+means|\s+refers to|\s+includes)'
                matches = re.finditer(pattern, text, re.IGNORECASE)

                for match in matches:
                    term = match.group(1).strip()
                    # Get context around the definition
                    start = max(0, match.start() - 50)
                    end = min(len(text), match.end() + 200)
                    context = text[start:end].strip()

                    definitions.append({
                        "term": term,
                        "context": context,
                        "page": page_data["page_number"]
                    })

        return definitions

    def parse(self) -> Dict[str, Any]:
        """
        Main parsing method.

        Returns:
            Dictionary containing all extracted data
        """
        if not self.open_document():
            return None

        print("   🔍 Extracting text and structure...")
        pages = self.extract_text_with_structure()

        print("   📑 Identifying sections...")
        sections = self.identify_sections(pages)

        print("   📋 Parsing table of contents...")
        toc = self.parse_toc()

        print("   📖 Extracting definitions...")
        definitions = self.extract_definitions(pages)

        result = {
            "source_file": str(self.pdf_path),
            "filename": self.pdf_path.name,
            "parse_timestamp": datetime.now().isoformat(),
            "timezone": "Africa/Lagos",
            "metadata": self.metadata,
            "page_count": len(self.doc),
            "toc": toc,
            "sections": sections,
            "definitions": definitions,
            "pages": pages
        }

        self.doc.close()

        print(f"   ✅ Found {len(sections)} sections")
        print(f"   ✅ Found {len(definitions)} definitions")

        return result

def main():
    """Main execution function."""
    print("=" * 70)
    print("Nigerian Tax Reform Acts - PDF Parser")
    print("=" * 70)

    # Load metadata to find PDFs
    metadata_path = RAW_DIR / "sources_metadata.json"

    if not metadata_path.exists():
        print("❌ Error: sources_metadata.json not found. Run 01_fetch_sources.py first.")
        return 1

    with open(metadata_path, 'r') as f:
        metadata = json.load(f)

    parsed_count = 0
    total_count = len(metadata["sources"])

    for source in metadata["sources"]:
        if not source["downloaded"]:
            print(f"\n⏭️  Skipping {source['name']} (not downloaded)")
            continue

        pdf_path = Path(source["local_path"])

        print(f"\n📄 Parsing: {source['name']}")

        # Parse PDF
        parser = TaxActParser(pdf_path)
        result = parser.parse()

        if result:
            # Save parsed result
            output_filename = pdf_path.stem + "_parsed.json"
            output_path = PROCESSED_DIR / output_filename

            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)

            print(f"   💾 Saved to: {output_path}")
            parsed_count += 1

    # Summary
    print("\n" + "=" * 70)
    print(f"Parsing Summary: {parsed_count}/{total_count} successful")
    print("=" * 70)

    if parsed_count > 0:
        print("✅ Parsing completed!")
        return 0
    else:
        print("❌ No files were parsed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
