#!/usr/bin/env python3
"""
Embedding and indexing pipeline for Nigerian Tax Reform Acts.
Creates vector embeddings using OpenAI and indexes with FAISS and ChromaDB.
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
import numpy as np
from tqdm import tqdm

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env.backend")

# Import libraries
try:
    from openai import OpenAI
    import faiss
    import chromadb
except ImportError as e:
    print(f"❌ Error: Missing required library: {e}")
    print("Run: pip install -r requirements.txt")
    sys.exit(1)

# Directories
PROCESSED_DIR = Path(__file__).parent.parent / "data" / "processed"
EMBEDDINGS_DIR = Path(__file__).parent.parent / "data" / "embeddings"
EMBEDDINGS_DIR.mkdir(parents=True, exist_ok=True)

# Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
BATCH_SIZE = 100

if not OPENAI_API_KEY:
    print("❌ Error: OPENAI_API_KEY not set in .env.backend")
    sys.exit(1)

client = OpenAI(api_key=OPENAI_API_KEY)

class EmbeddingIndexer:
    """Creates and manages vector embeddings and indices."""

    def __init__(self, model: str = EMBEDDING_MODEL):
        """
        Initialize indexer.

        Args:
            model: OpenAI embedding model to use
        """
        self.model = model
        self.embeddings = []
        self.chunks = []
        self.dimension = None

    def create_embeddings(self, chunks: List[Dict[str, Any]]) -> List[np.ndarray]:
        """
        Create embeddings for chunks using OpenAI API.

        Args:
            chunks: List of chunk dictionaries

        Returns:
            List of embedding vectors
        """
        embeddings = []
        texts = [chunk["text"] for chunk in chunks]

        print(f"   Creating embeddings for {len(texts)} chunks...")

        # Process in batches
        for i in tqdm(range(0, len(texts), BATCH_SIZE), desc="   Embedding"):
            batch = texts[i:i + BATCH_SIZE]

            try:
                response = client.embeddings.create(
                    model=self.model,
                    input=batch
                )

                batch_embeddings = [np.array(item.embedding) for item in response.data]
                embeddings.extend(batch_embeddings)

            except Exception as e:
                print(f"\n   ❌ Error creating embeddings for batch {i}: {e}")
                # Create zero vectors as fallback
                if embeddings:
                    dim = len(embeddings[0])
                else:
                    dim = 1536  # Default for text-embedding-3-small

                for _ in batch:
                    embeddings.append(np.zeros(dim))

        # Set dimension
        if embeddings:
            self.dimension = len(embeddings[0])

        return embeddings

    def build_faiss_index(self, embeddings: List[np.ndarray]) -> faiss.IndexFlatL2:
        """
        Build FAISS index for fast similarity search.

        Args:
            embeddings: List of embedding vectors

        Returns:
            FAISS index
        """
        print("   Building FAISS index...")

        # Convert to numpy array
        embeddings_array = np.array(embeddings).astype('float32')

        # Create FAISS index (L2 distance)
        dimension = embeddings_array.shape[1]
        index = faiss.IndexFlatL2(dimension)

        # Add vectors
        index.add(embeddings_array)

        print(f"   ✅ FAISS index created with {index.ntotal} vectors")

        return index

    def build_chromadb_collection(
        self,
        chunks: List[Dict[str, Any]],
        embeddings: List[np.ndarray]
    ) -> chromadb.Collection:
        """
        Build ChromaDB collection.

        Args:
            chunks: List of chunk dictionaries
            embeddings: List of embedding vectors

        Returns:
            ChromaDB collection
        """
        print("   Building ChromaDB collection...")

        # Initialize ChromaDB client
        chroma_client = chromadb.PersistentClient(
            path=str(EMBEDDINGS_DIR / "chromadb")
        )

        # Delete existing collection if it exists
        try:
            chroma_client.delete_collection(name="nigerian_tax_acts")
        except:
            pass

        # Create collection
        collection = chroma_client.create_collection(
            name="nigerian_tax_acts",
            metadata={"description": "Nigerian Tax Reform Acts 2025-2026"}
        )

        # Prepare data for ChromaDB
        ids = [f"chunk_{i}" for i in range(len(chunks))]
        documents = [chunk["text"] for chunk in chunks]
        metadatas = []

        for chunk in chunks:
            metadata = {
                "document_name": chunk.get("document_name", ""),
                "section_number": chunk.get("section_number", ""),
                "section_title": chunk.get("section_title", ""),
                "section_type": chunk.get("section_type", ""),
                "page_start": chunk.get("page_start", 0),
                "page_end": chunk.get("page_end", 0),
                "contains_definition": chunk.get("contains_definition", False),
                "contains_rate": chunk.get("contains_rate", False),
                "contains_date": chunk.get("contains_date", False),
                "contains_amount": chunk.get("contains_amount", False)
            }
            metadatas.append(metadata)

        # Convert embeddings to list format
        embeddings_list = [emb.tolist() for emb in embeddings]

        # Add to collection in batches
        for i in tqdm(range(0, len(chunks), BATCH_SIZE), desc="   Indexing"):
            end_idx = min(i + BATCH_SIZE, len(chunks))

            collection.add(
                ids=ids[i:end_idx],
                documents=documents[i:end_idx],
                metadatas=metadatas[i:end_idx],
                embeddings=embeddings_list[i:end_idx]
            )

        print(f"   ✅ ChromaDB collection created with {len(chunks)} documents")

        return collection

    def save_embeddings(
        self,
        embeddings: List[np.ndarray],
        chunks: List[Dict[str, Any]],
        faiss_index: faiss.IndexFlatL2
    ):
        """
        Save embeddings and metadata to disk.

        Args:
            embeddings: List of embedding vectors
            chunks: List of chunk dictionaries
            faiss_index: FAISS index
        """
        print("   Saving embeddings and index...")

        # Save FAISS index
        faiss_path = EMBEDDINGS_DIR / "faiss_index.bin"
        faiss.write_index(faiss_index, str(faiss_path))
        print(f"   ✅ FAISS index saved to: {faiss_path}")

        # Save embeddings as numpy array
        embeddings_array = np.array(embeddings).astype('float32')
        embeddings_path = EMBEDDINGS_DIR / "embeddings.npy"
        np.save(embeddings_path, embeddings_array)
        print(f"   ✅ Embeddings saved to: {embeddings_path}")

        # Save chunk metadata (without text to save space)
        chunk_metadata = []
        for i, chunk in enumerate(chunks):
            metadata = {
                "chunk_id": i,
                "document_name": chunk.get("document_name", ""),
                "section_type": chunk.get("section_type", ""),
                "section_number": chunk.get("section_number", ""),
                "section_title": chunk.get("section_title", ""),
                "page_start": chunk.get("page_start", 0),
                "page_end": chunk.get("page_end", 0),
                "char_count": chunk.get("char_count", 0),
                "word_count": chunk.get("word_count", 0),
                "contains_definition": chunk.get("contains_definition", False),
                "contains_rate": chunk.get("contains_rate", False),
                "contains_date": chunk.get("contains_date", False),
                "contains_amount": chunk.get("contains_amount", False),
                "uncertainty_notes": chunk.get("uncertainty_notes", [])
            }
            chunk_metadata.append(metadata)

        metadata_path = EMBEDDINGS_DIR / "chunk_metadata.json"
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(chunk_metadata, f, indent=2, ensure_ascii=False)
        print(f"   ✅ Metadata saved to: {metadata_path}")

        # Save index metadata
        index_metadata = {
            "timestamp": datetime.now().isoformat(),
            "timezone": "Africa/Lagos",
            "model": self.model,
            "dimension": self.dimension,
            "total_chunks": len(chunks),
            "faiss_index_path": str(faiss_path),
            "embeddings_path": str(embeddings_path),
            "chromadb_path": str(EMBEDDINGS_DIR / "chromadb")
        }

        index_metadata_path = EMBEDDINGS_DIR / "index_metadata.json"
        with open(index_metadata_path, 'w', encoding='utf-8') as f:
            json.dump(index_metadata, f, indent=2, ensure_ascii=False)
        print(f"   ✅ Index metadata saved to: {index_metadata_path}")

def load_chunks() -> List[Dict[str, Any]]:
    """
    Load chunks from JSONL file.

    Returns:
        List of chunk dictionaries
    """
    chunks_file = PROCESSED_DIR / "chunks.jsonl"

    if not chunks_file.exists():
        print(f"❌ Error: {chunks_file} not found. Run 03_make_chunks.py first.")
        sys.exit(1)

    chunks = []
    with open(chunks_file, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                chunks.append(json.loads(line))

    return chunks

def main():
    """Main execution function."""
    print("=" * 70)
    print("Nigerian Tax Reform Acts - Embedding & Indexing")
    print("=" * 70)
    print(f"Model: {EMBEDDING_MODEL}")

    # Load chunks
    print("\n📥 Loading chunks...")
    chunks = load_chunks()
    print(f"   Loaded {len(chunks)} chunks")

    # Initialize indexer
    indexer = EmbeddingIndexer(model=EMBEDDING_MODEL)

    # Create embeddings
    print("\n🔮 Creating embeddings...")
    embeddings = indexer.create_embeddings(chunks)
    print(f"   ✅ Created {len(embeddings)} embeddings (dimension: {indexer.dimension})")

    # Build FAISS index
    print("\n📊 Building FAISS index...")
    faiss_index = indexer.build_faiss_index(embeddings)

    # Build ChromaDB collection
    print("\n💾 Building ChromaDB collection...")
    collection = indexer.build_chromadb_collection(chunks, embeddings)

    # Save everything
    print("\n💾 Saving embeddings and indices...")
    indexer.save_embeddings(embeddings, chunks, faiss_index)

    # Summary
    print("\n" + "=" * 70)
    print("✅ Embedding and indexing completed successfully!")
    print("=" * 70)
    print(f"Total embeddings: {len(embeddings)}")
    print(f"Embedding dimension: {indexer.dimension}")
    print(f"FAISS index size: {faiss_index.ntotal}")
    print(f"ChromaDB collection: nigerian_tax_acts")

    return 0

if __name__ == "__main__":
    sys.exit(main())
