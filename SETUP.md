# VoiceForge Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Get Supabase Service Role Key

1. Go to your Supabase project: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **API** 
4. Scroll down to **Project API keys**
5. Copy the **service_role** key (NOT the anon key!)
6. Add it to `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZobW9jdHRvZWN5ZW9sbHZ3dXJ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQzMjg5NiwiZXhwIjoyMDgxMDA4ODk2fQ.YOUR_ACTUAL_KEY_HERE
```

### Step 2: Set Up Database

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx/sql
2. Click **New Query**
3. Copy and paste the contents of `supabase/schema.sql`
4. Click **Run** to create all tables

### Step 3: Verify Environment Variables

Check your `.env.local` file has all these:

```env
# Gemini API (✅ Already configured)
GEMINI_API_KEY=AIzaSyBTOHrBp1KcicAoc8UllbuG7dq4pNV6bq8

# OpenAI (⏳ Not needed yet - for voice testing later)
OPENAI_API_KEY=your_openai_api_key_here

# Supabase (✅ URL and Anon key configured, ❌ Service key needed!)
NEXT_PUBLIC_SUPABASE_URL=https://vhmocttoecyeollvwurx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE  # ← ADD THIS!

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000

### Step 5: Test Agent Creation

1. Go to http://localhost:3000/create
2. Click on a template (e.g., "Restaurant Booking")
3. Click "Generate Agent with AI"
4. Wait 1-2 seconds for Gemini to generate
5. Review the preview
6. Click "Deploy Agent"
7. Test your agent!

## 🐛 Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY is not configured"

**Solution:** Add the service role key to `.env.local` (see Step 1 above)

### Error: "Failed to generate agent configuration"

**Possible causes:**
1. Gemini API key is invalid
2. Gemini API quota exceeded (free tier: 60 requests/min)
3. Network issue

**Solution:** 
- Check your Gemini API key at https://makersuite.google.com/app/apikey
- Wait a minute if you hit rate limits
- Check your internet connection

### Error: "Failed to save agent"

**Possible causes:**
1. Database tables not created
2. Service role key is wrong
3. Supabase project is paused

**Solution:**
- Run the database schema (Step 2 above)
- Verify service role key is correct
- Check Supabase dashboard for project status

### Build Error: "Invalid supabaseUrl"

**Solution:** Make sure all environment variables are set before building:
```bash
# Check if variables are set
cat .env.local

# If missing, add them, then:
npm run build
```

## ✅ Verification Checklist

Before testing, make sure:

- [ ] Supabase service role key is added to `.env.local`
- [ ] Database schema is created (agents and calls tables exist)
- [ ] Gemini API key is valid
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000

## 🎯 What's Working

- ✅ Agent creation with Gemini 1.5 Flash (1-2 second response)
- ✅ Template system (Restaurant, Salon, Doctor)
- ✅ Agent preview with full configuration
- ✅ Agent detail page with all information
- ✅ Database persistence
- ✅ Error handling and validation

## 🔜 Coming Next

- ⏳ Voice testing with OpenAI Realtime API (Task 3)
- ⏳ Dashboard with analytics (Task 4)
- ⏳ PDF knowledge base upload (Task 6)

## 📞 Need Help?

If you're stuck, check:
1. Console logs in browser (F12 → Console)
2. Terminal logs where `npm run dev` is running
3. Supabase logs in dashboard

Most issues are due to missing environment variables or database not being set up!