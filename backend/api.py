#!/usr/bin/env python3
"""
FastAPI Backend for Legal AI.d - Nigerian Tax Reform Acts RAG Integration
This API provides endpoints for the React Native mobile app to query the RAG system.
"""

import sys
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent.parent / ".env.backend")

# Import RAG components
try:
    from retriever import TaxActRetriever
    from generator import RAGPipeline
except ImportError as e:
    print(f"Error importing RAG modules: {e}")
    print("Make sure you're running from the correct directory")
    sys.exit(1)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(
    title="Legal AI.d - Nigerian Tax RAG API",
    description="RAG-powered API for Nigerian Tax Reform Acts 2025-2026",
    version="1.0.0"
)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global RAG pipeline instance (initialized once)
rag_pipeline = None

# Mount static files for frontends
frontend_path = Path(__file__).parent.parent / "frontend"
if frontend_path.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")

# Request/Response models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, str]]
    retrieved_chunks: int
    timestamp: str
    has_rag_context: bool
    metadata: Optional[Dict[str, Any]] = None

class HealthResponse(BaseModel):
    status: str
    rag_initialized: bool
    timestamp: str

# Initialize RAG pipeline on startup
@app.on_event("startup")
async def startup_event():
    """Initialize RAG pipeline when API starts."""
    global rag_pipeline

    print("🔧 Initializing RAG pipeline...")
    try:
        # Use FAISS backend (ChromaDB has dimension issues)
        retriever = TaxActRetriever(top_k=5, use_chromadb=False)
        rag_pipeline = RAGPipeline(retriever)
        print("✅ RAG pipeline initialized successfully!")
    except Exception as e:
        print(f"❌ Error initializing RAG pipeline: {e}")
        print("API will run but RAG features will be disabled")

@app.get("/", include_in_schema=False)
async def root_redirect():
    """Redirect to simple frontend."""
    frontend_path = Path(__file__).parent.parent / "frontend" / "simple" / "index.html"
    if frontend_path.exists():
        return FileResponse(frontend_path)
    return {"message": "Welcome to Legal AI.d RAG API", "docs": "/docs"}

@app.get("/api", response_model=HealthResponse)
async def api_root():
    """Health check endpoint."""
    return {
        "status": "online",
        "rag_initialized": rag_pipeline is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/simple", include_in_schema=False)
async def simple_frontend():
    """Serve simple HTML frontend."""
    frontend_path = Path(__file__).parent.parent / "frontend" / "simple" / "index.html"
    return FileResponse(frontend_path)

@app.get("/react", include_in_schema=False)
async def react_frontend():
    """Serve React frontend."""
    frontend_path = Path(__file__).parent.parent / "frontend" / "react" / "index.html"
    return FileResponse(frontend_path)

@app.get("/search", include_in_schema=False)
async def web_enhanced_frontend():
    """Serve enhanced web frontend."""
    frontend_path = Path(__file__).parent.parent / "frontend" / "web-enhanced" / "search.html"
    return FileResponse(frontend_path)

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy" if rag_pipeline is not None else "degraded",
        "rag_initialized": rag_pipeline is not None,
        "timestamp": datetime.now().isoformat()
    }

def is_tax_related_query(message: str) -> bool:
    """
    Determine if a query is related to Nigerian tax law.

    Args:
        message: User's message

    Returns:
        True if tax-related
    """
    tax_keywords = [
        "tax", "vat", "firs", "revenue", "income", "corporation",
        "paye", "withholding", "capital gains", "dividend",
        "deduction", "exemption", "relief", "assessment",
        "digital asset", "cryptocurrency", "nft", "blockchain",
        "freelancer", "company", "individual", "taxable",
        "commencement", "2025", "2026", "reform", "act",
        "nigeria revenue service", "nrs", "duty", "levy",
        "tin", "tax identification number", "cac", "registration",
        "compliance", "business registration", "filing"
    ]

    message_lower = message.lower()
    return any(keyword in message_lower for keyword in tax_keywords)

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, chat_request: ChatRequest):
    """
    Main chat endpoint with RAG integration.

    This endpoint:
    1. Checks if the query is tax-related
    2. If yes, uses RAG to retrieve relevant context
    3. Returns answer with sources and citations
    4. If no, returns a message directing to tax-related queries
    """
    try:
        if not rag_pipeline:
            raise HTTPException(
                status_code=503,
                detail="RAG service not available. Please try again later."
            )

        message = chat_request.message.strip()

        if not message:
            raise HTTPException(
                status_code=400,
                detail="Message cannot be empty"
            )

        # Check if query is tax-related
        if not is_tax_related_query(message):
            return {
                "answer": (
                    "I specialize in Nigerian tax law, particularly the Tax Reform Acts 2025-2026. "
                    "Your question doesn't seem to be about tax law. Could you ask me about:\n\n"
                    "• Tax rates and calculations\n"
                    "• VAT requirements\n"
                    "• Digital asset taxation\n"
                    "• Company or individual tax obligations\n"
                    "• The Nigeria Revenue Service (NRS)\n"
                    "• Tax deductions and exemptions\n\n"
                    "Or any other Nigerian tax-related questions!"
                ),
                "sources": [],
                "retrieved_chunks": 0,
                "timestamp": datetime.now().isoformat(),
                "has_rag_context": False,
                "metadata": {
                    "query_type": "non_tax_related"
                }
            }

        # Use RAG pipeline to answer
        result = rag_pipeline.query(message, temperature=0.1)

        # Format response
        return {
            "answer": result["answer"],
            "sources": result.get("source_list", []),
            "retrieved_chunks": result.get("retrieved_chunks", 0),
            "timestamp": datetime.now().isoformat(),
            "has_rag_context": True,
            "metadata": {
                "model": result.get("model"),
                "tokens_used": result.get("tokens_used"),
                "query_type": "tax_related"
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.post("/search")
@limiter.limit("20/minute")
async def search_documents(request: Request, query: str, top_k: int = 5):
    """
    Search endpoint - returns relevant chunks without generating an answer.
    Useful for displaying source documents.
    """
    try:
        if not rag_pipeline:
            raise HTTPException(
                status_code=503,
                detail="RAG service not available"
            )

        # Retrieve relevant chunks
        results = rag_pipeline.retriever.retrieve(query)

        # Format results
        chunks = []
        for result in results[:top_k]:
            chunks.append({
                "text": result.get("text", ""),
                "document": result.get("metadata", {}).get("document_name", ""),
                "section": result.get("metadata", {}).get("section_number", ""),
                "title": result.get("metadata", {}).get("section_title", ""),
                "page": result.get("metadata", {}).get("page_start", ""),
                "relevance_score": float(result.get("distance", 0.0))
            })

        return {
            "query": query,
            "results": chunks,
            "total_results": len(chunks),
            "timestamp": datetime.now().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing search request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )

@app.get("/stats")
async def get_stats():
    """Get RAG system statistics."""
    try:
        if not rag_pipeline:
            return {
                "status": "offline",
                "message": "RAG system not initialized"
            }

        # Get index metadata
        embeddings_dir = Path(__file__).parent.parent / "data" / "embeddings"
        metadata_file = embeddings_dir / "index_metadata.json"

        if metadata_file.exists():
            import json
            with open(metadata_file, 'r') as f:
                metadata = json.load(f)

            return {
                "status": "online",
                "total_chunks": metadata.get("total_chunks", 0),
                "embedding_model": metadata.get("model", "unknown"),
                "embedding_dimension": metadata.get("dimension", 0),
                "last_updated": metadata.get("timestamp", "unknown"),
                "timezone": metadata.get("timezone", "Africa/Lagos")
            }

        return {
            "status": "online",
            "message": "Metadata not available"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return {
        "error": "Endpoint not found",
        "path": request.url.path,
        "available_endpoints": [
            "/",
            "/health",
            "/chat",
            "/search",
            "/stats"
        ]
    }

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))

    print("=" * 70)
    print("Legal AI.d - Nigerian Tax RAG API")
    print("=" * 70)
    print("\nStarting server...")
    print(f"API will be available at: http://localhost:{port}")
    print(f"Docs available at: http://localhost:{port}/docs")
    print("\nEndpoints:")
    print("  POST /chat       - Main chat endpoint with RAG")
    print("  POST /search     - Search documents")
    print("  GET  /health     - Health check")
    print("  GET  /stats      - System statistics")
    print("\n" + "=" * 70)

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )
