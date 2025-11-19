# Legal AI.d - Frontend Options

Three frontend interfaces for the Nigerian Tax RAG API, all hosted on Railway alongside the API.

## 🎨 Available Frontends

### Option A: Simple HTML/CSS/JS (`/simple` or `/`)
**Best for**: Quick access, minimal loading time

**Features:**
- Single HTML file
- Pure JavaScript (no frameworks)
- Fast loading
- Mobile responsive
- Real-time health status
- Example queries

**Access**: `https://legal-aid-production-f134.up.railway.app/` or `/simple`

---

### Option B: React Interface (`/react`)
**Best for**: Modern UI, better UX

**Features:**
- React 18 (via CDN)
- Gradient glass-morphism design
- Sidebar with examples
- Real-time stats
- Animated transitions
- Source highlighting

**Access**: `https://legal-aid-production-f134.up.railway.app/react`

---

### Option C: Enhanced Web (`/search`)
**Best for**: Professional look, dark mode

**Features:**
- Dark theme design
- Sticky source sidebar
- Quick query buttons
- Detailed metrics
- Beautiful typography
- Production-ready styling

**Access**: `https://legal-aid-production-f134.up.railway.app/search`

---

## 🚀 Features Common to All

✅ **Rate Limited** - 10 requests/minute for chat, 20 for search
✅ **Real-time Search** - Instant results from RAG API
✅ **Source Citations** - Every answer includes document references
✅ **Mobile Responsive** - Works on all devices
✅ **No Backend Required** - Pure frontend, calls Railway API
✅ **Copy to Clipboard** - Easy answer copying
✅ **Error Handling** - Graceful error messages

---

## 🔧 Technical Details

### Rate Limiting

Implemented using `slowapi`:
- **Chat endpoint**: 10 requests/minute per IP
- **Search endpoint**: 20 requests/minute per IP
- Returns 429 status code when limit exceeded

### API Endpoints Used

All frontends call these Railway API endpoints:
- `POST /chat` - Main RAG query
- `GET /health` - System status
- `GET /stats` - Index statistics

### File Structure

```
frontend/
├── simple/
│   └── index.html          # Option A - Simple interface
├── react/
│   └── index.html          # Option B - React interface
└── web-enhanced/
    └── search.html         # Option C - Enhanced design
```

---

## 📊 Performance

### Option A (Simple)
- **Load Time**: ~50ms
- **File Size**: 12KB
- **No Dependencies**

### Option B (React)
- **Load Time**: ~200ms (React from CDN)
- **File Size**: 18KB + React (~130KB)
- **Dependencies**: React 18

### Option C (Enhanced)
- **Load Time**: ~60ms
- **File Size**: 15KB
- **No Dependencies**

---

## 🎯 Use Cases

### Simple (`/`)
- Quick lookups
- Mobile users
- Low bandwidth
- Embedded in iframe

### React (`/react`)
- Desktop users
- Power users
- Extended sessions
- Feature-rich experience

### Enhanced (`/search`)
- Professional presentations
- Marketing page
- Public-facing
- Brand showcase

---

## 🔐 Security

All frontends are:
- ✅ Read-only (no data modification)
- ✅ CORS-protected
- ✅ Rate-limited per IP
- ✅ No authentication required (public knowledge)
- ✅ No API keys exposed (server-side only)

---

## 🚢 Deployment

All frontends are automatically served by FastAPI on Railway:

```python
# Root redirects to simple
@app.get("/")
async def root_redirect():
    return FileResponse("frontend/simple/index.html")

# Individual routes
@app.get("/simple")  # Simple interface
@app.get("/react")   # React interface
@app.get("/search")  # Enhanced interface
```

No separate hosting needed - everything runs on Railway!

---

## 📱 Mobile Support

All interfaces are fully responsive:

**Breakpoints:**
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

**Mobile Features:**
- Touch-friendly buttons
- Optimized layouts
- Reduced animations
- Smaller fonts
- Sticky headers

---

## 🎨 Customization

### Change Colors

Edit the CSS variables in each HTML file:

**Simple:**
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
}
```

**React:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**Enhanced:**
```css
background: #0f172a;  /* Dark background */
--accent: #3b82f6;     /* Blue accent */
```

---

## 📊 Analytics

Consider adding analytics to track:
- Search queries
- Popular topics
- User engagement
- Error rates

**Suggested tools:**
- Google Analytics
- Plausible (privacy-friendly)
- Custom logging via API

---

## 🐛 Troubleshooting

### Frontend not loading
1. Check Railway deployment logs
2. Verify frontend files exist in repository
3. Ensure FastAPI is mounting static files

### API calls failing
1. Check CORS configuration
2. Verify API_BASE_URL in JavaScript
3. Check Railway environment variables

### Rate limit errors
1. Normal behavior after 10 requests/minute
2. Wait 60 seconds or change IP
3. Adjust limits in `backend/api.py` if needed

---

## 🔄 Updates

To update a frontend:

1. Edit the HTML file locally
2. Test locally: `python backend/api.py`
3. Commit and push to GitHub
4. Railway auto-deploys

```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
```

---

## 📚 Learn More

- **API Documentation**: `/docs`
- **GitHub**: https://github.com/Omotayo-NeX/Legal-AId
- **Railway Dashboard**: https://railway.app

---

**Built with ⚖️ for Nigerian legal clarity**
