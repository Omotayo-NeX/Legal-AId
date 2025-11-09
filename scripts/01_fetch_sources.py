#!/usr/bin/env python3
"""
Script to fetch official Nigerian Tax Reform Act 2025 PDF sources.
Fetches from National Assembly and other official government sources.
"""

import os
import sys
import requests
from pathlib import Path
from datetime import datetime
import json

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

# Output directory
DATA_DIR = Path(__file__).parent.parent / "data" / "raw"
DATA_DIR.mkdir(parents=True, exist_ok=True)

# Official sources for Nigerian Tax Reform Acts 2025-2026
SOURCES = [
    {
        "name": "Nigeria Tax Bill 2024",
        "url": "https://nass.gov.ng/wp-content/uploads/2024/10/Nigeria-Tax-Bill-2024.pdf",
        "filename": "nigeria_tax_bill_2024.pdf",
        "description": "Main Nigeria Tax Bill 2024 from National Assembly",
        "type": "primary_legislation"
    },
    {
        "name": "Tax Administration Bill 2024",
        "url": "https://nass.gov.ng/wp-content/uploads/2024/10/Nigeria-Tax-Administration-Bill-2024.pdf",
        "filename": "tax_administration_bill_2024.pdf",
        "description": "Tax Administration Bill 2024",
        "type": "primary_legislation"
    },
    {
        "name": "Nigeria Revenue Service Bill 2024",
        "url": "https://nass.gov.ng/wp-content/uploads/2024/10/Nigeria-Revenue-Service-Establishment-Bill-2024.pdf",
        "filename": "revenue_service_bill_2024.pdf",
        "description": "Nigeria Revenue Service Establishment Bill",
        "type": "primary_legislation"
    },
    {
        "name": "Joint Revenue Board Bill 2024",
        "url": "https://nass.gov.ng/wp-content/uploads/2024/10/Joint-Revenue-Board-Establishment-Bill-2024.pdf",
        "filename": "joint_revenue_board_bill_2024.pdf",
        "description": "Joint Revenue Board Establishment Bill",
        "type": "primary_legislation"
    }
]

def download_file(url: str, output_path: Path, description: str) -> bool:
    """
    Download a file from URL with progress indication.

    Args:
        url: URL to download from
        output_path: Path to save the file
        description: Description for logging

    Returns:
        True if successful, False otherwise
    """
    try:
        print(f"\n📥 Downloading: {description}")
        print(f"   URL: {url}")

        # Set headers to mimic a browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/pdf,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }

        response = requests.get(url, headers=headers, stream=True, timeout=30)
        response.raise_for_status()

        # Check if content is actually PDF
        content_type = response.headers.get('Content-Type', '')
        if 'pdf' not in content_type.lower() and 'application/octet-stream' not in content_type.lower():
            print(f"   ⚠️  Warning: Content-Type is {content_type}, expected PDF")

        total_size = int(response.headers.get('content-length', 0))

        with open(output_path, 'wb') as f:
            if total_size == 0:
                f.write(response.content)
            else:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
                        percent = (downloaded / total_size) * 100
                        print(f"\r   Progress: {percent:.1f}%", end='', flush=True)

        print(f"\n   ✅ Saved to: {output_path}")
        print(f"   Size: {output_path.stat().st_size / 1024:.2f} KB")
        return True

    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error downloading: {e}")
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

def save_metadata(sources: list, output_dir: Path):
    """Save metadata about downloaded sources."""
    metadata = {
        "download_timestamp": datetime.now().isoformat(),
        "timezone": "Africa/Lagos",
        "sources": []
    }

    for source in sources:
        file_path = output_dir / source["filename"]
        source_meta = {
            **source,
            "downloaded": file_path.exists(),
            "file_size_bytes": file_path.stat().st_size if file_path.exists() else 0,
            "local_path": str(file_path)
        }
        metadata["sources"].append(source_meta)

    metadata_path = output_dir / "sources_metadata.json"
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"\n📋 Metadata saved to: {metadata_path}")

def main():
    """Main execution function."""
    print("=" * 70)
    print("Nigerian Tax Reform Acts 2025-2026 - Source Fetcher")
    print("=" * 70)

    success_count = 0
    total_count = len(SOURCES)

    for source in SOURCES:
        output_path = DATA_DIR / source["filename"]

        # Skip if already downloaded
        if output_path.exists():
            print(f"\n⏭️  Skipping (already exists): {source['name']}")
            print(f"   Path: {output_path}")
            success_count += 1
            continue

        # Download the file
        if download_file(source["url"], output_path, source["name"]):
            success_count += 1

    # Save metadata
    save_metadata(SOURCES, DATA_DIR)

    # Summary
    print("\n" + "=" * 70)
    print(f"Download Summary: {success_count}/{total_count} successful")
    print("=" * 70)

    if success_count == total_count:
        print("✅ All sources downloaded successfully!")
        return 0
    else:
        print(f"⚠️  {total_count - success_count} source(s) failed to download")
        return 1

if __name__ == "__main__":
    sys.exit(main())
