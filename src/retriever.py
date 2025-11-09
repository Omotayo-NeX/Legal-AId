"""
RAG Retriever for Nigerian Tax Reform Acts.
Handles vector similarity search and context retrieval.
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np

try:
    from openai import OpenAI
    import faiss
    import chromadb
except ImportError as e:
    raise ImportError(f"Missing required library: {e}. Run: pip install -r requirements.txt")

from dotenv import load_dotenv

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env.backend")

EMBEDDINGS_DIR = Path(__file__).parent.parent / "data" / "embeddings"
PROCESSED_DIR = Path(__file__).parent.parent / "data" / "processed"

class TaxActRetriever:
    """Retriever for Nigerian Tax Reform Acts."""

    def __init__(
        self,
        embedding_model: str = None,
        top_k: int = None,
        use_chromadb: bool = True
    ):
        """
        Initialize retriever.

        Args:
            embedding_model: OpenAI embedding model
            top_k: Number of results to return
            use_chromadb: Whether to use ChromaDB (True) or FAISS (False)
        """
        self.embedding_model = embedding_model or os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
        self.top_k = top_k or int(os.getenv("TOP_K_RESULTS", "5"))
        self.use_chromadb = use_chromadb

        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set in environment")
        self.client = OpenAI(api_key=api_key)

        # Load indices and metadata
        self._load_index()
        self._load_chunks()
        self._load_metadata()

    def _load_index(self):
        """Load FAISS or ChromaDB index."""
        if self.use_chromadb:
            # Load ChromaDB
            chroma_path = EMBEDDINGS_DIR / "chromadb"
            if not chroma_path.exists():
                raise FileNotFoundError(f"ChromaDB not found at {chroma_path}")

            self.chroma_client = chromadb.PersistentClient(path=str(chroma_path))
            self.collection = self.chroma_client.get_collection(name="nigerian_tax_acts")
            self.faiss_index = None
            self.embeddings = None

        else:
            # Load FAISS
            faiss_path = EMBEDDINGS_DIR / "faiss_index.bin"
            if not faiss_path.exists():
                raise FileNotFoundError(f"FAISS index not found at {faiss_path}")

            self.faiss_index = faiss.read_index(str(faiss_path))

            # Load embeddings
            embeddings_path = EMBEDDINGS_DIR / "embeddings.npy"
            self.embeddings = np.load(embeddings_path)

            self.chroma_client = None
            self.collection = None

    def _load_chunks(self):
        """Load chunk texts from JSONL."""
        chunks_file = PROCESSED_DIR / "chunks.jsonl"
        if not chunks_file.exists():
            raise FileNotFoundError(f"Chunks file not found at {chunks_file}")

        self.chunks = []
        with open(chunks_file, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    self.chunks.append(json.loads(line))

    def _load_metadata(self):
        """Load chunk metadata."""
        metadata_path = EMBEDDINGS_DIR / "chunk_metadata.json"
        if metadata_path.exists():
            with open(metadata_path, 'r', encoding='utf-8') as f:
                self.chunk_metadata = json.load(f)
        else:
            self.chunk_metadata = []

    def embed_query(self, query: str) -> np.ndarray:
        """
        Create embedding for query.

        Args:
            query: Query text

        Returns:
            Embedding vector
        """
        response = self.client.embeddings.create(
            model=self.embedding_model,
            input=query
        )
        return np.array(response.data[0].embedding)

    def search_chromadb(
        self,
        query: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search using ChromaDB.

        Args:
            query: Query text
            filters: Optional metadata filters

        Returns:
            List of results
        """
        # Build where clause from filters
        where = None
        if filters:
            where = {}
            for key, value in filters.items():
                if value is not None:
                    where[key] = value

        # Query ChromaDB
        results = self.collection.query(
            query_texts=[query],
            n_results=self.top_k,
            where=where if where else None
        )

        # Format results
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                result = {
                    "text": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                    "distance": results['distances'][0][i] if results['distances'] else 0.0,
                    "id": results['ids'][0][i]
                }
                formatted_results.append(result)

        return formatted_results

    def search_faiss(self, query: str) -> List[Dict[str, Any]]:
        """
        Search using FAISS.

        Args:
            query: Query text

        Returns:
            List of results
        """
        # Embed query
        query_embedding = self.embed_query(query).astype('float32').reshape(1, -1)

        # Search FAISS index
        distances, indices = self.faiss_index.search(query_embedding, self.top_k)

        # Format results
        results = []
        for i, idx in enumerate(indices[0]):
            if idx < len(self.chunks):
                result = {
                    "text": self.chunks[idx]["text"],
                    "metadata": self.chunks[idx],
                    "distance": float(distances[0][i]),
                    "chunk_id": int(idx)
                }
                results.append(result)

        return results

    def retrieve(
        self,
        query: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve relevant chunks for a query.

        Args:
            query: Query text
            filters: Optional metadata filters (only for ChromaDB)

        Returns:
            List of relevant chunks with metadata
        """
        if self.use_chromadb:
            return self.search_chromadb(query, filters)
        else:
            if filters:
                print("Warning: Filters only supported with ChromaDB")
            return self.search_faiss(query)

    def format_context(self, results: List[Dict[str, Any]]) -> str:
        """
        Format retrieved results into context string.

        Args:
            results: List of retrieval results

        Returns:
            Formatted context string
        """
        context_parts = []

        for i, result in enumerate(results, 1):
            metadata = result.get("metadata", {})

            # Build source reference
            source_parts = []
            if metadata.get("document_name"):
                source_parts.append(metadata["document_name"])
            if metadata.get("section_number"):
                source_parts.append(f"Section {metadata['section_number']}")
            if metadata.get("section_title"):
                source_parts.append(f"({metadata['section_title']})")
            if metadata.get("page_start"):
                source_parts.append(f"Page {metadata['page_start']}")

            source = " - ".join(source_parts) if source_parts else "Unknown source"

            # Add chunk with source
            context_parts.append(f"[Source {i}] {source}\n{result['text']}")

        return "\n\n" + "\n\n---\n\n".join(context_parts)

    def get_sources(self, results: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """
        Extract source citations from results.

        Args:
            results: List of retrieval results

        Returns:
            List of source dictionaries
        """
        sources = []

        for result in results:
            metadata = result.get("metadata", {})

            source = {
                "document": metadata.get("document_name", "Unknown"),
                "section": metadata.get("section_number", ""),
                "title": metadata.get("section_title", ""),
                "pages": f"{metadata.get('page_start', '')}-{metadata.get('page_end', '')}" if metadata.get('page_start') else "",
                "type": metadata.get("section_type", "")
            }

            sources.append(source)

        return sources
