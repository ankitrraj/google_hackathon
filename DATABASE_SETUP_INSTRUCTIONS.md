# 🗄️ Database Setup Instructions

## Quick Setup (2 minutes)

Your browser should have opened the Supabase SQL Editor. If not, follow these steps:

### Step 1: Open SQL Editor
Go to: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx/sql/new

### Step 2: Copy Schema
1. Open file: `voiceforge/supabase/schema.sql`
2. Select all (Ctrl+A)
3. Copy (Ctrl+C)

### Step 3: Run Schema
1. Paste in SQL Editor (Ctrl+V)
2. Click "Run" button (or press Ctrl+Enter)
3. Wait for completion (~5 seconds)

### Step 4: Verify
Go to Table Editor: https://supabase.com/dashboard/project/vhmocttoecyeollvwurx/editor

You should see:
- ✅ `agents` table (9 columns)
- ✅ `calls` table (7 columns)

---

## What Gets Created

### Tables
```sql
agents
├── id (UUID)
├── user_id (TEXT)
├── name (TEXT)
├── industry (TEXT)
├── system_prompt (TEXT)
├── questions (JSONB)
├── extract_fields (JSONB)
├── knowledge_base (TEXT)
└── created_at (TIMESTAMP)

calls
├── id (UUID)
├── agent_id (UUID) → agents.id
├── transcript (TEXT)
├── extracted_data (JSONB)
├── duration (INTEGER)
├── status (TEXT)
└── created_at (TIMESTAMP)
```

### Indexes (for performance)
- `idx_agents_user_id`
- `idx_agents_created_at`
- `idx_calls_agent_id`
- `idx_calls_created_at`
- `idx_calls_status`

### Security
- Row Level Security (RLS) enabled
- 6 security policies
- Validation functions

### Views (for analytics)
- `agent_stats` - Agent statistics
- `call_analytics` - Call analytics

---

## After Setup

Run the app:
```bash
npm run dev
```

Test agent creation:
1. Go to http://localhost:3000/create
2. Select a template
3. Click "Generate Agent with AI"
4. Wait 1-2 seconds
5. See your agent! 🎉

---

## Troubleshooting

### Error: "relation 'agents' does not exist"
**Solution:** Schema not run yet. Follow steps above.

### Error: "permission denied"
**Solution:** Make sure you're using the service_role key, not anon key.

### Tables not showing in Table Editor
**Solution:** Refresh the page or check SQL Editor for errors.

---

## Alternative: Supabase CLI

If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref vhmocttoecyeollvwurx

# Run migrations
supabase db push
```

---

**Need help? Check the SQL Editor for error messages!**