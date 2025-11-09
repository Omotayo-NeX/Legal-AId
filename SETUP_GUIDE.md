# Legal AI.d - Setup Guide

This guide will walk you through setting up Legal AI.d from scratch.

---

## Step 1: Install Dependencies

```bash
cd "/Users/mac/Desktop/Legal AId"
npm install
```

---

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: legal-aid (or your choice)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to Nigeria (e.g., eu-west-1 or ap-southeast-1)
4. Click "Create new project"
5. Wait for project to be created (2-3 minutes)

### 2.2 Get Your API Keys

1. In your Supabase project dashboard, click "Settings" (gear icon in sidebar)
2. Click "API" under Project Settings
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2.3 Create Database Schema

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New Query"
3. Open the file `supabase-schema.sql` in this project
4. Copy ALL the contents
5. Paste into the Supabase SQL Editor
6. Click "Run" (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

This creates:
- `users` table
- `chat_sessions` table
- `document_templates` table
- `generated_documents` table
- `compliance_reminders` table
- `legal_knowledge` table
- `subscriptions` table
- Row Level Security (RLS) policies
- Storage bucket for files
- Sample document templates

### 2.4 Enable Authentication

1. Click "Authentication" in Supabase sidebar
2. Click "Providers"
3. Enable **Email** provider (toggle ON)
4. (Optional) Enable **Phone** provider:
   - You'll need a Twilio account
   - Add Twilio credentials
5. Go to "Email Templates" to customize signup/reset emails (optional)

### 2.5 Configure Storage

1. Click "Storage" in Supabase sidebar
2. You should see a bucket called `legal-aid-files` (created by SQL script)
3. Click on it
4. Click "Policies" tab
5. Verify policies are active (they should be automatically created)

---

## Step 3: Configure Environment Variables

### 3.1 Create .env File

```bash
cp .env.example .env
```

### 3.2 Add Supabase Credentials

Open `.env` and replace these values:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace:
- `https://your-project-id.supabase.co` with your actual Project URL
- `your_anon_key_here` with your actual anon/public key

### 3.3 (Optional) Add AI API Key

If you want to test AI chat features:

**For OpenAI:**
```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxx
```

**For Claude:**
```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-xxxxxx
```

Get keys from:
- OpenAI: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Anthropic: [https://console.anthropic.com/](https://console.anthropic.com/)

---

## Step 4: Test the Setup

### 4.1 Start the Development Server

```bash
npm start
```

You should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)
```

### 4.2 Run on Simulator/Emulator

**iOS:**
```bash
Press 'i' in the terminal
```

**Android:**
```bash
Press 'a' in the terminal
```

**Physical Device:**
- Install "Expo Go" app from App Store / Play Store
- Scan the QR code shown in terminal

### 4.3 Test Authentication

1. App should load the Welcome screen
2. Click "Get Started"
3. Fill in signup form:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: (at least 6 characters)
4. Click "Create Account"
5. Check your email for verification link (optional, depends on Supabase settings)
6. Try logging in

### 4.4 Test Features

Once logged in:

✅ **Dashboard** - Should show quick actions and empty reminders
✅ **Chat** - Should load with welcome message (AI integration needed for responses)
✅ **Documents** - Should show 6 document templates
✅ **Profile** - Should show your user info
✅ **Tax Calculator** - Click "Tax Calculator" from home:
   - Enter gross income (e.g., 5000000)
   - Click "Calculate Tax"
   - Should show detailed tax breakdown

---

## Step 5: Verify Database Connection

### 5.1 Check User Creation

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "users" table
4. You should see your user record with:
   - id (UUID)
   - email
   - full_name
   - subscription_tier: "free"

### 5.2 Test Chat Session Creation

1. In the app, go to Chat tab
2. Send a message (will show dummy response for now)
3. In Supabase, check "chat_sessions" table
4. You should see a new session with your messages

---

## Common Issues & Fixes

### Issue 1: "Invalid API Key" Error

**Cause**: Environment variables not loaded

**Fix**:
1. Make sure `.env` file exists in root directory
2. Restart the Expo server (`npm start`)
3. Clear cache: `expo start -c`

### Issue 2: "Auth session missing" Error

**Cause**: Supabase not properly configured

**Fix**:
1. Verify Supabase URL and key in `.env`
2. Check Supabase project is active
3. Ensure email auth is enabled in Supabase

### Issue 3: "RLS Policy Error" When Accessing Data

**Cause**: Row Level Security policies not created

**Fix**:
1. Re-run the `supabase-schema.sql` script
2. Check if policies exist:
   - Go to Supabase Dashboard > Table Editor
   - Click on any table
   - Click "Policies" button
   - Should show policies for SELECT, INSERT, UPDATE, DELETE

### Issue 4: Images/Logo Not Loading

**Cause**: Asset path incorrect

**Fix**:
1. Verify `public/logo/logo.png` exists
2. If missing, add a logo file or use placeholder
3. Update image import in `app/(tabs)/home.tsx`

### Issue 5: Tax Calculator Not Working

**Cause**: Usually input validation

**Fix**:
1. Make sure to enter only numbers (no commas or currency symbols)
2. Income must be greater than 0
3. Check console for error messages

---

## Next Steps

Now that setup is complete, you can:

1. **Implement AI Chat**
   - Add OpenAI/Claude API integration
   - Implement streaming responses
   - Add RAG with Nigerian legal documents

2. **Build Document Generator**
   - Integrate PDF generation library
   - Create form for each template
   - Upload PDFs to Supabase Storage

3. **Add Compliance Reminders**
   - Implement push notifications
   - Create reminder management UI
   - Add recurring reminder logic

4. **Integrate Paystack**
   - Add subscription plans
   - Implement payment flow
   - Lock features by tier

5. **Polish UI**
   - Add loading states
   - Improve error handling
   - Add animations

---

## Getting Help

If you encounter issues:

1. **Check Logs**:
   - Expo logs in terminal
   - Supabase logs in dashboard (Database > Logs)

2. **Verify Configuration**:
   - `.env` file has correct values
   - Supabase project is active
   - Database schema was created successfully

3. **Test Connection**:
   ```bash
   # In app, check console for:
   "Supabase client initialized"
   ```

4. **Common Commands**:
   ```bash
   # Clear cache
   npm start -- --clear

   # Reset node modules
   rm -rf node_modules && npm install

   # Check environment variables are loaded
   console.log(process.env.EXPO_PUBLIC_SUPABASE_URL)
   ```

---

## Success Checklist

Before moving forward, verify:

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] Email authentication enabled
- [ ] `.env` file configured with Supabase credentials
- [ ] App runs without errors
- [ ] Can sign up new user
- [ ] User appears in Supabase `users` table
- [ ] Can log in with created account
- [ ] All tabs load (Home, Chat, Documents, Profile)
- [ ] Tax calculator works with test data

---

**You're all set! 🎉**

The MVP foundation is ready. Now you can add AI features, document generation, and payment integration to complete the full vision of Legal AI.d.
