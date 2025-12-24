# Email Gate Setup Instructions

## ✅ What's Been Implemented

1. **Supabase Database Schema** (`supabase_schema.sql`)
2. **Email Validation** (`backend/email_validator.py`)
3. **Supabase Client** (`backend/supabase_client.py`)
4. **Email Gate Modal** (Added to `web-landing/app.html`)
5. **API Endpoints** (Added to `backend/api.py`):
   - `/api/verify-email` - Verifies email and checks rate limits
   - `/chat` - Updated to require email and enforce limits
6. **New Support Pages**:
   - `contact-us.html` - Contact page with nexconsultingltd@gmail.com
   - `faq.html` - FAQ page
   - `help-center.html` - Help center with guides
   - `disclaimer.html` - Legal disclaimer

## 🔧 Setup Steps

### Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in:
   - **Name:** legal-aid-prod (or your choice)
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to Nigeria
4. Click "Create Project" (takes ~2 minutes)

### Step 2: Create Database Table

1. Once project is ready, click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase_schema.sql`
4. Paste into the SQL editor
5. Click "Run" (bottom right)
6. You should see "Success. No rows returned"

### Step 3: Get API Credentials

1. Click "Settings" (gear icon) in left sidebar
2. Click "API" under Project Settings
3. Copy these two values:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### Step 4: Update Environment Variables

1. Open `.env.backend` in your project
2. Replace the placeholder values:

```bash
# Before:
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# After (with your actual values):
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

### Step 5: Test Locally

```bash
# Stop the current server (if running)
# Press Ctrl+C in the terminal

# Install Supabase package (if not already installed)
pip install supabase

# Start the server
python3 -m uvicorn backend.api:app --reload --port 8000
```

### Step 6: Test Email Gate

1. Open http://localhost:8000/app.html
2. You should see the email popup immediately
3. Try these tests:

**Test 1: Valid Email**
- Enter: `test@gmail.com`
- Should accept and close modal
- Should store email in localStorage

**Test 2: Invalid Format**
- Enter: `notanemail`
- Should show error: "Please enter a valid email address"

**Test 3: Disposable Email**
- Enter: `test@temp-mail.org`
- Should show error: "Disposable email addresses are not allowed"

**Test 4: Rate Limiting**
- Make 21 queries in a row
- 21st query should fail with: "Daily limit of 20 queries exceeded"

### Step 7: Check Supabase Database

1. Go back to Supabase dashboard
2. Click "Table Editor" in left sidebar
3. Click "legal_aid_users" table
4. You should see your test email(s) with query counts

## 📊 Rate Limits

- **Per Email:** 20 queries/day, 100 queries/month
- **Per IP:** 50 queries/day (backup protection)
- **Per Minute:** 10 queries/minute (existing rate limit)

## 🛠️ Still To Do

### 1. Fix Dates in Pages

Update these files with correct dates:
- `web-landing/disclaimer.html` - Change to "Effective Date: January 1, 2025"
- Any other pages with incorrect dates

### 2. Deploy to Railway

```bash
# Commit all changes
git add .
git commit -m "Add email gate with Supabase rate limiting"
git push origin main
```

Then add environment variables to Railway:
1. Go to Railway dashboard
2. Click your project
3. Click "Variables" tab
4. Add:
   - `SUPABASE_URL` = (your URL)
   - `SUPABASE_KEY` = (your key)
5. Railway will automatically redeploy

## 🎨 Customization

### Change Rate Limits

Edit `backend/supabase_client.py`:
```python
DAILY_QUERY_LIMIT = 20  # Change to your desired daily limit
MONTHLY_QUERY_LIMIT = 100  # Change to your desired monthly limit
IP_DAILY_LIMIT = 50  # Change IP-based limit
```

### Change Email Modal Text

Edit `web-landing/app.html` around line 1980:
```html
<h2>Welcome to Legal AI.d</h2>
<p>Enter your email to access our free tax calculator</p>
```

### Add More Disposable Email Domains

Edit `backend/email_validator.py`:
```python
DISPOSABLE_DOMAINS = {
    "temp-mail.org", "guerrillamail.com",
    # Add more domains here
}
```

## 📞 Support

For issues or questions:
- Email: nexconsultingltd@gmail.com
- Check the FAQ: http://localhost:8000/faq.html

## 🔒 Security Notes

1. **Never commit** `.env` or `.env.backend` files to git
2. **Use environment variables** in Railway for production
3. **Keep Supabase keys secret** - they grant database access
4. **Monitor usage** in Supabase dashboard to detect abuse
5. **Enable Row Level Security** (already done in schema)

## ✨ Features

- ✅ Email-first access (no anonymous users)
- ✅ Disposable email blocking
- ✅ Per-email and per-IP rate limiting
- ✅ Usage tracking in Supabase
- ✅ LocalStorage for returning users
- ✅ Beautiful modal UI
- ✅ Error handling and validation
- ✅ Support pages (Contact, FAQ, Help, Disclaimer)

Enjoy your protected tax calculator! 🎉
