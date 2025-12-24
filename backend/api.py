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

# Import Supabase and email validation
try:
    from backend.supabase_client import get_supabase_manager
    from backend.email_validator import validate_email, sanitize_email
    SUPABASE_ENABLED = True
except Exception as e:
    print(f"Supabase not configured: {e}")
    SUPABASE_ENABLED = False

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

class EmailVerifyRequest(BaseModel):
    email: str

class EmailVerifyResponse(BaseModel):
    valid: bool
    message: str
    user_email: Optional[str] = None
    queries_remaining_today: Optional[int] = None
    queries_remaining_month: Optional[int] = None

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
    """Redirect to marketing landing page."""
    frontend_path = Path(__file__).parent.parent / "web-landing" / "index.html"
    if frontend_path.exists():
        return FileResponse(frontend_path)
    return {"message": "Welcome to Legal AI.d RAG API", "docs": "/docs"}

@app.get("/index.html", include_in_schema=False)
async def index_html():
    """Serve index.html (same as root)."""
    frontend_path = Path(__file__).parent.parent / "web-landing" / "index.html"
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

@app.get("/app.html", include_in_schema=False)
async def app_page():
    """Serve app tools page."""
    app_path = Path(__file__).parent.parent / "web-landing" / "app.html"
    return FileResponse(app_path)

@app.get("/privacy-policy.html", include_in_schema=False)
async def privacy_policy():
    """Serve privacy policy page."""
    privacy_path = Path(__file__).parent.parent / "web-landing" / "privacy-policy.html"
    return FileResponse(privacy_path)

@app.get("/terms-of-service.html", include_in_schema=False)
async def terms_of_service():
    """Serve terms of service page."""
    terms_path = Path(__file__).parent.parent / "web-landing" / "terms-of-service.html"
    return FileResponse(terms_path)

@app.get("/disclaimer.html", include_in_schema=False)
async def disclaimer():
    """Serve disclaimer page."""
    disclaimer_path = Path(__file__).parent.parent / "web-landing" / "disclaimer.html"
    return FileResponse(disclaimer_path)

@app.get("/help-center.html", include_in_schema=False)
async def help_center():
    """Serve help center page."""
    help_path = Path(__file__).parent.parent / "web-landing" / "help-center.html"
    return FileResponse(help_path)

@app.get("/contact-us.html", include_in_schema=False)
async def contact_us():
    """Serve contact us page."""
    contact_path = Path(__file__).parent.parent / "web-landing" / "contact-us.html"
    return FileResponse(contact_path)

@app.get("/faq.html", include_in_schema=False)
async def faq():
    """Serve FAQ page."""
    faq_path = Path(__file__).parent.parent / "web-landing" / "faq.html"
    return FileResponse(faq_path)

@app.get("/styles.css", include_in_schema=False)
async def serve_styles():
    """Serve CSS file."""
    css_path = Path(__file__).parent.parent / "web-landing" / "styles.css"
    return FileResponse(css_path, media_type="text/css")

@app.get("/script.js", include_in_schema=False)
async def serve_script():
    """Serve JS file."""
    js_path = Path(__file__).parent.parent / "web-landing" / "script.js"
    return FileResponse(js_path, media_type="application/javascript")

@app.get("/logo/{file_path:path}", include_in_schema=False)
async def serve_logo(file_path: str):
    """Serve logo files."""
    logo_file = Path(__file__).parent.parent / "web-landing" / "logo" / file_path
    if logo_file.exists() and logo_file.is_file():
        return FileResponse(logo_file)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/blog/{file_path:path}", include_in_schema=False)
async def serve_blog(file_path: str):
    """Serve blog files."""
    blog_file = Path(__file__).parent.parent / "web-landing" / "blog" / file_path
    if blog_file.exists() and blog_file.is_file():
        return FileResponse(blog_file)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/blog-images/{file_path:path}", include_in_schema=False)
async def serve_blog_images(file_path: str):
    """Serve blog image files."""
    image_file = Path(__file__).parent.parent / "web-landing" / "blog-images" / file_path
    if image_file.exists() and image_file.is_file():
        return FileResponse(image_file)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/hero.png", include_in_schema=False)
async def serve_hero():
    """Serve hero image."""
    hero_path = Path(__file__).parent.parent / "web-landing" / "hero.png"
    return FileResponse(hero_path)

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

@app.post("/api/verify-email", response_model=EmailVerifyResponse)
async def verify_email(request: Request, email_request: EmailVerifyRequest):
    """
    Verify user email and check rate limits.

    This endpoint:
    1. Validates email format
    2. Checks for disposable emails
    3. Creates or gets user from Supabase
    4. Checks rate limits
    5. Returns remaining queries

    Args:
        request: FastAPI request object
        email_request: Email verification request

    Returns:
        Email verification response with rate limit info
    """
    if not SUPABASE_ENABLED:
        return {
            "valid": True,
            "message": "Email verification disabled (Supabase not configured)",
            "user_email": email_request.email,
            "queries_remaining_today": 20,
            "queries_remaining_month": 100
        }

    try:
        # Sanitize email
        email = sanitize_email(email_request.email)

        # Validate email
        is_valid, validation_message = validate_email(email)
        if not is_valid:
            return {
                "valid": False,
                "message": validation_message
            }

        # Get Supabase manager
        supabase = get_supabase_manager()

        # Get client IP
        client_ip = request.client.host if request.client else "unknown"

        # Check rate limits
        allowed, reason, user = await supabase.check_rate_limit(email, client_ip)

        if not allowed:
            return {
                "valid": False,
                "message": reason,
                "user_email": email,
                "queries_remaining_today": 0,
                "queries_remaining_month": 0
            }

        # Calculate remaining queries
        queries_today = user.get("query_count_today", 0)
        queries_month = user.get("query_count_month", 0)
        remaining_today = max(0, 20 - queries_today)
        remaining_month = max(0, 100 - queries_month)

        return {
            "valid": True,
            "message": "Email verified successfully",
            "user_email": email,
            "queries_remaining_today": remaining_today,
            "queries_remaining_month": remaining_month
        }

    except Exception as e:
        print(f"Error verifying email: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error verifying email: {str(e)}"
        )

@app.post("/chat", response_model=ChatResponse)
@limiter.limit("10/minute")
async def chat(request: Request, chat_request: ChatRequest):
    """
    Main chat endpoint with RAG integration.

    This endpoint:
    1. Verifies user email and checks rate limits
    2. Checks if the query is tax-related
    3. If yes, uses RAG to retrieve relevant context
    4. Returns answer with sources and citations
    5. Increments user query count
    """
    try:
        # Check for email in headers
        user_email = request.headers.get("X-User-Email")

        if not user_email and SUPABASE_ENABLED:
            raise HTTPException(
                status_code=401,
                detail="Email required. Please provide your email to use this service."
            )

        # Verify email and check rate limits (if Supabase enabled)
        if SUPABASE_ENABLED and user_email:
            supabase = get_supabase_manager()
            client_ip = request.client.host if request.client else "unknown"

            allowed, reason, user = await supabase.check_rate_limit(user_email, client_ip)

            if not allowed:
                raise HTTPException(
                    status_code=429,
                    detail=reason
                )

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

        # Increment usage count (if Supabase enabled)
        if SUPABASE_ENABLED and user_email:
            try:
                await supabase.increment_usage(user_email)
            except Exception as e:
                print(f"Error incrementing usage: {e}")

        # Format response
        response = {
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

        return response

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
