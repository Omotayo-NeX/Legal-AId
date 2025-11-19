# Deploy Nigerian Tax RAG Server to Railway

This guide walks you through deploying your Nigerian Tax Reform Acts RAG API to Railway.

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Account**: Your code should be in a GitHub repository
3. **OpenAI API Key**: Required for embeddings and generation
4. **Processed Data**: Ensure you have run the data pipeline locally first

## Important: Data Preparation

**Before deploying**, you MUST run the data pipeline locally to generate:

```bash
# Run these scripts locally
python scripts/01_fetch_sources.py
python scripts/02_parse_pdf.py
python scripts/03_make_chunks.py
python scripts/04_embed_and_index.py
```

This generates:
- `data/processed/chunks.jsonl` (~1-5 MB)
- `data/embeddings/faiss_index.bin` (~50-200 MB)
- `data/embeddings/embeddings.npy` (~50-200 MB)
- `data/embeddings/chunk_metadata.json` (~1-5 MB)

**Railway will NOT run these scripts** - the server only handles queries using pre-built indices.

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare RAG server for Railway deployment"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/legal-aid.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Python project

### Step 3: Configure Environment Variables

In the Railway dashboard, go to **Variables** and add:

```
OPENAI_API_KEY=sk-your-openai-api-key-here
EMBEDDING_MODEL=text-embedding-3-small
CHAT_MODEL=gpt-4o-mini
CHUNK_SIZE=800
CHUNK_OVERLAP=200
TOP_K_RESULTS=5
PORT=8000
```

**Optional** (if using Supabase):
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

### Step 4: Verify Deployment Files

Ensure these files exist in your repository:

- ✅ `Procfile` - Tells Railway how to start the server
- ✅ `railway.json` - Railway configuration
- ✅ `runtime.txt` - Python version specification
- ✅ `requirements.txt` - Python dependencies
- ✅ `.railwayignore` - Files to exclude from deployment

### Step 5: Deploy

Railway will automatically:
1. Detect Python project
2. Install dependencies from `requirements.txt`
3. Build the project
4. Start the server using the `Procfile` command

**Build time**: 3-5 minutes

### Step 6: Access Your API

Once deployed, Railway provides a public URL like:
```
https://your-project-name.up.railway.app
```

Test the endpoints:

```bash
# Health check
curl https://your-project-name.up.railway.app/health

# Chat request
curl -X POST https://your-project-name.up.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the VAT rate in Nigeria?",
    "conversation_history": []
  }'
```

## API Endpoints

Your deployed server has these endpoints:

### 1. Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "rag_initialized": true,
  "timestamp": "2025-11-19T10:30:00"
}
```

### 2. Chat (Main RAG Endpoint)
```
POST /chat
```

Request:
```json
{
  "message": "Do freelancers need to charge VAT?",
  "conversation_history": [],
  "user_id": "optional-user-id"
}
```

Response:
```json
{
  "answer": "Based on the Nigerian Tax Reform Acts...",
  "sources": [
    {
      "document": "nigeria_tax_bill_2024.pdf",
      "section": "12",
      "title": "VAT Registration",
      "pages": "45-47"
    }
  ],
  "retrieved_chunks": 5,
  "timestamp": "2025-11-19T10:30:00",
  "has_rag_context": true,
  "metadata": {
    "model": "gpt-4o-mini",
    "tokens_used": {...}
  }
}
```

### 3. Search Documents
```
POST /search?query=VAT+rate&top_k=5
```

Returns relevant chunks without generating an answer.

### 4. System Statistics
```
GET /stats
```

Returns index metadata and system information.

## Architecture on Railway

```
┌─────────────────────────────────────────┐
│         Railway Container               │
│                                         │
│  ┌────────────────────────────────┐   │
│  │   FastAPI Server (Port 8000)   │   │
│  │                                 │   │
│  │  - /chat endpoint               │   │
│  │  - /search endpoint             │   │
│  │  - /health endpoint             │   │
│  └────────┬───────────────────────┘   │
│           │                             │
│  ┌────────▼───────────────────────┐   │
│  │    RAG Pipeline                 │   │
│  │                                 │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │ Retriever (FAISS)       │  │   │
│  │  │ - faiss_index.bin       │  │   │
│  │  │ - embeddings.npy        │  │   │
│  │  └─────────────────────────┘  │   │
│  │                                 │   │
│  │  ┌─────────────────────────┐  │   │
│  │  │ Generator (GPT)         │  │   │
│  │  │ - OpenAI API calls      │  │   │
│  │  └─────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Data Files (In Container)     │   │
│  │                                  │   │
│  │  data/processed/chunks.jsonl    │   │
│  │  data/embeddings/faiss_index.bin│   │
│  │  data/embeddings/embeddings.npy │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
              │
              ▼
      ┌──────────────┐
      │  OpenAI API  │
      │              │
      │  Embeddings  │
      │  GPT-4o-mini │
      └──────────────┘
```

## Troubleshooting

### Build Fails

**Issue**: Missing dependencies
```bash
# Solution: Ensure requirements.txt is complete
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

### Server Starts but RAG Not Initialized

**Issue**: Missing data files
```
❌ Error initializing RAG pipeline: FileNotFoundError
```

**Solution**: Ensure these files exist in your repo:
- `data/processed/chunks.jsonl`
- `data/embeddings/faiss_index.bin`
- `data/embeddings/embeddings.npy`

Check `.railwayignore` to ensure they're not excluded.

### Out of Memory

**Issue**: Railway free tier has memory limits

**Solution**: Use FAISS instead of ChromaDB (smaller footprint)
```python
# In backend/api.py line 84
retriever = TaxActRetriever(top_k=5, use_chromadb=False)
```

### Slow Cold Starts

Railway apps may sleep after inactivity. First request will be slower.

**Solution**: Use Railway's paid plan for always-on instances.

### Environment Variables Not Working

**Issue**: Server can't find OPENAI_API_KEY

**Solution**:
1. Check Railway dashboard → Variables
2. Restart the deployment
3. View logs to verify variables are loaded

## Cost Estimates

### Railway Hosting
- **Free Tier**: $5 credit/month (limited resources)
- **Hobby Plan**: $5/month (better performance)
- **Pro Plan**: $20/month (production-ready)

### OpenAI API Usage
Per 1,000 queries (estimated):
- Embeddings: ~$0.20 (5 chunks × 1,000 queries)
- GPT-4o-mini: ~$10-30 (depends on answer length)

**Total**: ~$10-50/month for moderate usage

## Monitoring

### View Logs
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Metrics to Monitor
- Response time
- Error rate
- Memory usage
- Token consumption
- Query volume

## Production Checklist

Before going live:

- [ ] Environment variables are set
- [ ] Data files are committed and pushed
- [ ] CORS origins are restricted (not `*`)
- [ ] Error handling is comprehensive
- [ ] Rate limiting is implemented
- [ ] Monitoring/logging is configured
- [ ] API key rotation policy is defined
- [ ] Backup strategy for data files
- [ ] SSL/HTTPS is enabled (Railway default)
- [ ] Health checks are passing

## Updating the Deployment

When you have new data or code changes:

```bash
# Make changes locally
git add .
git commit -m "Update RAG system"
git push origin main
```

Railway automatically redeploys on push to main branch.

### Updating RAG Data

If you need to update the tax documents:

1. Run pipeline locally:
   ```bash
   python scripts/01_fetch_sources.py
   python scripts/02_parse_pdf.py
   python scripts/03_make_chunks.py
   python scripts/04_embed_and_index.py
   ```

2. Commit updated files:
   ```bash
   git add data/processed/ data/embeddings/
   git commit -m "Update RAG indices with latest tax documents"
   git push origin main
   ```

3. Railway will automatically redeploy with new data

## Alternative: Docker Deployment

If you prefer Docker:

```dockerfile
# Create Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "backend.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

Then deploy to Railway using Docker:
```bash
railway up
```

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **FastAPI Docs**: https://fastapi.tiangolo.com

## Next Steps

After successful deployment:

1. **Test all endpoints** with Postman or curl
2. **Integrate with React Native app** - update API base URL
3. **Set up monitoring** - track usage and errors
4. **Configure CI/CD** - automated testing before deploy
5. **Add rate limiting** - protect against abuse
6. **Set up analytics** - track query patterns

---

**Your Nigerian Tax RAG API is now live!** 🚀⚖️
