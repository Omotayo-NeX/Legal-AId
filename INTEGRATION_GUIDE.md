# 🔌 Integration Guide: Nigerian Tax Reform Acts RAG into Legal AI.d

## ✅ Setup Complete!

Your Nigerian Tax Reform Acts RAG system is now integrated with your React Native app!

---

## 🎯 What's Been Set Up

### 1. FastAPI Backend ✅
- **Location:** `backend/api.py`
- **Running on:** http://localhost:8000
- **Status:** ✅ Healthy (RAG initialized)
- **Endpoints:**
  - `POST /chat` - Main chat with RAG
  - `POST /search` - Search documents
  - `GET /health` - Health check
  - `GET /stats` - System stats

### 2. React Native Service ✅
- **Location:** `src/services/tax-rag.service.ts`
- **Features:**
  - Chat with RAG backend
  - Health checking (with caching)
  - Source formatting
  - Tax keyword detection

---

## 🚀 Quick Start

### Step 1: Start the Backend Server

```bash
cd "/Users/mac/Desktop/Legal AId"
python3 backend/api.py
```

The server will start on **http://localhost:8000**

### Step 2: Update Your React Native App

Add the RAG API URL to your `.env` file:

```bash
# Add to .env file
EXPO_PUBLIC_TAX_RAG_API_URL=http://localhost:8000
```

For iOS Simulator, use:
```bash
EXPO_PUBLIC_TAX_RAG_API_URL=http://localhost:8000
```

For Android Emulator, use:
```bash
EXPO_PUBLIC_TAX_RAG_API_URL=http://10.0.2.2:8000
```

For Physical Device (on same network):
```bash
EXPO_PUBLIC_TAX_RAG_API_URL=http://YOUR_COMPUTER_IP:8000
```

### Step 3: Update Your Chat Screen

Update your chat screen (likely `app/(tabs)/chat.tsx`) to use the Tax RAG service:

```typescript
import { taxRAGService } from '@/src/services/tax-rag.service';

// In your chat component
const sendMessage = async (message: string) => {
  try {
    // Check if RAG is available
    const isHealthy = await taxRAGService.checkHealth();

    if (isHealthy && taxRAGService.isTaxRelatedQuery(message)) {
      // Use Tax RAG for tax-related queries
      const response = await taxRAGService.chat(message);

      // Display the answer
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources, // Show sources!
        has_rag_context: response.has_rag_context
      }]);

      // Optional: Show sources separately
      if (response.sources && response.sources.length > 0) {
        const sourcesText = taxRAGService.formatSources(response.sources);
        console.log('Sources:', sourcesText);
      }
    } else {
      // Fallback to OpenAI/Claude for non-tax queries
      // ... your existing chat logic
    }
  } catch (error) {
    console.error('Chat error:', error);
    // Fallback to regular chat
  }
};
```

---

## 💡 Integration Patterns

### Pattern 1: Hybrid RAG + LLM

Use RAG for tax questions, fallback to OpenAI/Claude for others:

```typescript
const sendMessage = async (message: string) => {
  // Check if tax-related
  if (taxRAGService.isTaxRelatedQuery(message)) {
    try {
      const response = await taxRAGService.chat(message);
      return response.answer;
    } catch (error) {
      // Fallback to OpenAI/Claude
      return await openAIChat(message);
    }
  } else {
    // Use OpenAI/Claude directly
    return await openAIChat(message);
  }
};
```

### Pattern 2: Always Try RAG First

```typescript
const sendMessage = async (message: string) => {
  try {
    // Always try RAG first
    const response = await taxRAGService.chat(message);

    // If RAG says it's not tax-related, use LLM
    if (!response.has_rag_context) {
      return await openAIChat(message);
    }

    return response.answer;
  } catch (error) {
    // Fallback to LLM
    return await openAIChat(message);
  }
};
```

### Pattern 3: Show RAG Sources

```typescript
const ChatMessage = ({ message }) => {
  return (
    <View>
      <Text>{message.content}</Text>

      {message.sources && message.sources.length > 0 && (
        <View style={styles.sources}>
          <Text style={styles.sourcesTitle}>📚 Sources:</Text>
          {message.sources.map((source, index) => (
            <Text key={index} style={styles.sourceItem}>
              {index + 1}. {source.document} - Section {source.section}
              {source.pages && ` (Page ${source.pages})`}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
```

---

## 🔥 Example Implementation

Here's a complete example for your chat screen:

```typescript
// app/(tabs)/chat.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { taxRAGService } from '@/src/services/tax-rag.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: any[];
  has_rag_context?: boolean;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragAvailable, setRagAvailable] = useState(false);

  // Check RAG availability on mount
  useEffect(() => {
    checkRAGHealth();
  }, []);

  const checkRAGHealth = async () => {
    const isHealthy = await taxRAGService.checkHealth();
    setRagAvailable(isHealthy);
    if (isHealthy) {
      console.log('✅ Tax RAG Service is available');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Try Tax RAG if available and query is tax-related
      if (ragAvailable && taxRAGService.isTaxRelatedQuery(input)) {
        const response = await taxRAGService.chat(input);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          timestamp: new Date(),
          sources: response.sources,
          has_rag_context: response.has_rag_context,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Fallback to your existing OpenAI/Claude logic
        // ... your existing code ...
      }
    } catch (error) {
      console.error('Chat error:', error);

      // Error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* RAG Status Indicator */}
      {ragAvailable && (
        <View style={{
          backgroundColor: '#1BAA66',
          padding: 8,
          alignItems: 'center'
        }}>
          <Text style={{ color: 'white', fontSize: 12 }}>
            ✅ 2026 Tax Reform Knowledge Active
          </Text>
        </View>
      )}

      {/* Messages */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={{
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.role === 'user' ? '#1BAA66' : '#F0F0F0',
              padding: 12,
              borderRadius: 12,
              marginBottom: 12,
              maxWidth: '80%',
            }}
          >
            <Text style={{
              color: message.role === 'user' ? 'white' : 'black',
            }}>
              {message.content}
            </Text>

            {/* Show sources for RAG responses */}
            {message.sources && message.sources.length > 0 && (
              <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#DDD' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 4 }}>
                  📚 Sources:
                </Text>
                {message.sources.map((source, index) => (
                  <Text key={index} style={{ fontSize: 11, color: '#666' }}>
                    {index + 1}. Section {source.section}: {source.title}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={{
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEE'
      }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about Nigerian tax law..."
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#F9F9F9',
            borderRadius: 24,
            marginRight: 8,
          }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={isLoading}
          style={{
            backgroundColor: '#1BAA66',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {isLoading ? '...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

---

## 🧪 Testing the Integration

### 1. Test Backend Directly

```bash
# Health check
curl http://localhost:8000/health

# Test query
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the commencement date?"}'
```

### 2. Test from React Native

Add this to your app to test:

```typescript
import { taxRAGService } from '@/src/services/tax-rag.service';

// Test function
const testTaxRAG = async () => {
  try {
    const isHealthy = await taxRAGService.checkHealth();
    console.log('RAG Health:', isHealthy);

    if (isHealthy) {
      const response = await taxRAGService.chat('What is the commencement date?');
      console.log('Answer:', response.answer);
      console.log('Sources:', response.sources);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run on app start
useEffect(() => {
  testTaxRAG();
}, []);
```

---

## 🔒 Production Deployment

### Option 1: Deploy Backend to Cloud

**Heroku:**
```bash
# Create Procfile
echo "web: python backend/api.py" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

**Railway.app:**
```bash
# railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python backend/api.py",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**DigitalOcean App Platform:**
- Connect GitHub repo
- Set run command: `python backend/api.py`
- Add environment variables

### Option 2: Run Backend Alongside App

If you have a Node.js backend, integrate the Python RAG service:

```javascript
// server.js (Node.js)
const { spawn } = require('child_process');

// Start Python RAG service
const pythonProcess = spawn('python3', ['backend/api.py']);

// Your existing Express app
app.post('/api/chat', async (req, res) => {
  // Proxy to Python RAG service
  const response = await fetch('http://localhost:8000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });

  const data = await response.json();
  res.json(data);
});
```

---

## 📊 Monitoring & Debugging

### Check Server Logs

```bash
# View logs
tail -f /path/to/logs

# Or check the background process
# (if running in background)
```

### Debug Frontend

```typescript
// Enable debug logging
const taxRAGService = new TaxRAGService();

// Log all requests
const originalChat = taxRAGService.chat;
taxRAGService.chat = async (...args) => {
  console.log('[TaxRAG] Request:', args);
  const result = await originalChat.apply(taxRAGService, args);
  console.log('[TaxRAG] Response:', result);
  return result;
};
```

### Monitor Performance

```typescript
const sendMessage = async (message: string) => {
  const startTime = Date.now();

  try {
    const response = await taxRAGService.chat(message);
    const duration = Date.now() - startTime;

    console.log(`[Performance] Query took ${duration}ms`);
    console.log(`[Performance] Retrieved ${response.retrieved_chunks} chunks`);

    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## 🎯 Expected Results

After integration, your app will:

1. ✅ **Detect tax-related queries** automatically
2. ✅ **Use RAG for accurate answers** with 2025-2026 tax knowledge
3. ✅ **Show source citations** (section numbers, page numbers)
4. ✅ **Never say "as of October 2023"** for tax questions
5. ✅ **Fallback gracefully** if RAG is unavailable
6. ✅ **Display confidence** through source citations

---

## ❓ FAQ

**Q: What if the backend is down?**
A: The service automatically falls back to your regular OpenAI/Claude chat.

**Q: Does this work offline?**
A: No, it requires the backend server to be running.

**Q: Can I cache responses?**
A: Yes! Add caching to the service:

```typescript
private responseCache = new Map<string, TaxChatResponse>();

async chat(message: string) {
  const cacheKey = message.toLowerCase().trim();

  if (this.responseCache.has(cacheKey)) {
    return this.responseCache.get(cacheKey)!;
  }

  const response = await this.actualChat(message);
  this.responseCache.set(cacheKey, response);

  return response;
}
```

**Q: How do I update the knowledge base?**
A: Replace the PDF in `data/raw/`, then re-run:
```bash
python3 scripts/02_parse_pdf.py
python3 scripts/03_make_chunks.py
python3 scripts/04_embed_and_index.py
```

Then restart the backend server.

---

## 🎉 You're All Set!

Your Legal AI.d app now has access to the Nigerian Tax Reform Acts 2025-2026 knowledge base!

**Next steps:**
1. Start the backend: `python3 backend/api.py`
2. Update your chat screen to use `taxRAGService`
3. Test with tax questions
4. Deploy to production

**Questions? Check:**
- `SUCCESS_REPORT.md` - Complete system overview
- `RAG_SYSTEM_README.md` - Technical documentation
- `QUICK_START.md` - Quick reference

---

**Built with ⚖️ for Nigerian legal clarity**
