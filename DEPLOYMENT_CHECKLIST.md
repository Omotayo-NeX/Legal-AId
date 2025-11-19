# Railway Deployment Checklist for Nigerian Tax RAG Server

## Pre-Deployment (Local)

### 1. Data Pipeline Completion
- [ ] Run `python scripts/01_fetch_sources.py` - PDFs downloaded
- [ ] Run `python scripts/02_parse_pdf.py` - PDFs parsed
- [ ] Run `python scripts/03_make_chunks.py` - Chunks created
- [ ] Run `python scripts/04_embed_and_index.py` - Embeddings generated

### 2. Verify Data Files Exist
- [ ] `data/processed/chunks.jsonl` (should be 1-5 MB)
- [ ] `data/embeddings/faiss_index.bin` (should be 50-200 MB)
- [ ] `data/embeddings/embeddings.npy` (should be 50-200 MB)
- [ ] `data/embeddings/chunk_metadata.json`
- [ ] `data/embeddings/index_metadata.json`

### 3. Test Locally
```bash
# Test the server locally first
cd /Users/mac/Desktop/legal-AId
python backend/api.py
```

Open http://localhost:8000/docs to test the API.

Test endpoints:
- [ ] GET http://localhost:8000/health - Should return "healthy"
- [ ] GET http://localhost:8000/stats - Should show index metadata
- [ ] POST http://localhost:8000/chat - Test with a tax question

### 4. Check Deployment Files
- [ ] `Procfile` - Created ✅
- [ ] `railway.json` - Created ✅
- [ ] `runtime.txt` - Created ✅
- [ ] `requirements.txt` - Updated with FastAPI ✅
- [ ] `.railwayignore` - Created ✅

## Railway Setup

### 1. GitHub Repository
```bash
# If not already done
git init
git add .
git commit -m "Prepare RAG server for Railway deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/legal-aid.git
git push -u origin main
```

### 2. Create Railway Project
- [ ] Go to https://railway.app/new
- [ ] Click "Deploy from GitHub repo"
- [ ] Select your repository
- [ ] Wait for automatic detection

### 3. Configure Environment Variables

In Railway Dashboard → Variables, add:

**Required:**
```
OPENAI_API_KEY=sk-proj-...
EMBEDDING_MODEL=text-embedding-3-small
CHAT_MODEL=gpt-4o-mini
TOP_K_RESULTS=5
```

**Optional (defaults work fine):**
```
CHUNK_SIZE=800
CHUNK_OVERLAP=200
```

**Optional (if using Supabase):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key
```

### 4. Deploy
- [ ] Railway will automatically build and deploy
- [ ] Monitor build logs for errors
- [ ] Wait for "Deployment successful" message

## Post-Deployment Testing

### 1. Get Your Railway URL
Example: `https://legal-aid-production.up.railway.app`

### 2. Test Endpoints

```bash
# Replace YOUR_RAILWAY_URL with your actual URL
export API_URL="https://your-project.up.railway.app"

# Health check
curl $API_URL/health

# Stats
curl $API_URL/stats

# Chat test
curl -X POST $API_URL/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the VAT rate in Nigeria?",
    "conversation_history": []
  }'
```

Expected responses:
- [ ] `/health` returns `{"status": "healthy", "rag_initialized": true}`
- [ ] `/stats` returns index metadata with chunk count
- [ ] `/chat` returns answer with sources

### 3. Integration Testing

Test from your React Native app:

```typescript
// Update your API base URL
const API_BASE_URL = "https://your-project.up.railway.app";

// Test the chat endpoint
const response = await fetch(`${API_BASE_URL}/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "What is the commencement date?",
    conversation_history: []
  })
});

const data = await response.json();
console.log(data.answer);
console.log(data.sources);
```

## Monitoring

### View Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# View logs
railway logs
```

### Check Metrics
In Railway Dashboard:
- [ ] CPU usage < 80%
- [ ] Memory usage < 80%
- [ ] Response times < 5 seconds
- [ ] No error spikes

## Common Issues & Solutions

### Issue 1: "RAG service not available"
**Cause**: Data files missing or not loaded

**Solution:**
1. Check `.railwayignore` - ensure `data/` is not excluded
2. Verify files are in GitHub repo
3. Redeploy

### Issue 2: Build fails with "No module named 'fastapi'"
**Cause**: Missing dependency

**Solution:**
```bash
# Ensure requirements.txt includes FastAPI
cat requirements.txt | grep fastapi
# Should show: fastapi>=0.104.0

git add requirements.txt
git commit -m "Add FastAPI to requirements"
git push
```

### Issue 3: Server crashes with "Out of Memory"
**Cause**: Railway free tier memory limit

**Solutions:**
1. Use FAISS instead of ChromaDB (edit `backend/api.py` line 84)
2. Upgrade to Railway Hobby plan ($5/month)
3. Reduce `TOP_K_RESULTS` to 3

### Issue 4: OpenAI API errors
**Cause**: Invalid or missing API key

**Solution:**
1. Check Railway Variables
2. Ensure `OPENAI_API_KEY` starts with `sk-proj-` or `sk-`
3. Verify API key has credits
4. Restart deployment

## Production Optimization

### Security
- [ ] Restrict CORS origins (not `allow_origins=["*"]`)
- [ ] Add API key authentication
- [ ] Set up rate limiting
- [ ] Enable HTTPS only (Railway default)

### Performance
- [ ] Use Railway Hobby/Pro tier for better resources
- [ ] Monitor OpenAI token usage
- [ ] Implement response caching
- [ ] Add request timeout limits

### Monitoring
- [ ] Set up error alerting (Sentry, etc.)
- [ ] Track query analytics
- [ ] Monitor API costs
- [ ] Set up uptime monitoring

## Cost Management

### Expected Costs

**Railway:**
- Free: $5 credit/month
- Hobby: $5/month
- Pro: $20/month

**OpenAI API (per 1,000 queries):**
- Embeddings (text-embedding-3-small): ~$0.20
- Generation (gpt-4o-mini): ~$10-30

**Total estimated monthly cost:**
- Light usage (< 1,000 queries): $5-15
- Moderate usage (5,000 queries): $50-100
- Heavy usage (20,000 queries): $200-500

### Cost Optimization
- [ ] Use gpt-4o-mini instead of gpt-4
- [ ] Cache common queries
- [ ] Set `max_tokens` limit
- [ ] Monitor and set budget alerts

## Backup & Recovery

### Backup Strategy
```bash
# Backup embeddings and indices
tar -czf rag-data-backup-$(date +%Y%m%d).tar.gz data/embeddings/ data/processed/

# Store in cloud storage
aws s3 cp rag-data-backup-*.tar.gz s3://your-bucket/backups/
```

### Recovery
If deployment fails:
1. Check Railway logs
2. Rollback to previous deployment
3. Restore data from backup
4. Redeploy

## Update Workflow

When updating RAG data:

```bash
# 1. Update data locally
python scripts/01_fetch_sources.py
python scripts/02_parse_pdf.py
python scripts/03_make_chunks.py
python scripts/04_embed_and_index.py

# 2. Test locally
python backend/api.py
# Verify at http://localhost:8000

# 3. Commit and push
git add data/processed/ data/embeddings/
git commit -m "Update RAG indices with latest tax documents"
git push origin main

# 4. Railway auto-deploys
# Monitor logs for successful deployment
```

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Your API Docs**: `https://your-railway-url.up.railway.app/docs`

---

## Quick Deploy Commands

```bash
# Step 1: Commit everything
git add .
git commit -m "Deploy to Railway"
git push origin main

# Step 2: Open Railway
open https://railway.app/new

# Step 3: Monitor deployment
railway logs --follow
```

**That's it!** Your Nigerian Tax RAG API should now be live on Railway! 🚀
