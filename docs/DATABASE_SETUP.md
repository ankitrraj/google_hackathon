# Database Setup Guide

## Quick Setup (Recommended)

### 1. Run Migration Helper
```bash
node scripts/apply-migration.js
```

This will:
- Open Supabase SQL Editor in your browser
- Show you the migration file path
- Guide you through the process

### 2. Apply Migration
1. Browser opens to SQL Editor
2. Copy content from: `supabase/migrations/20251216_initial_schema.sql`
3. Paste in SQL Editor
4. Click "Run"

### 3. Verify
Run these queries to verify:
```sql
SELECT * FROM agents LIMIT 1;
SELECT * FROM calls LIMIT 1;
```

---

## Manual Setup

If the helper script doesn't work:

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### 2. Navigate to SQL Editor
- Select your project
- Click "SQL Editor" in sidebar
- Click "New Query"

### 3. Copy Migration
Open `supabase/migrations/20251216_initial_schema.sql` and copy all content

### 4. Run Migration
- Paste in SQL Editor
- Click "Run" or press Ctrl+Enter

---

## Database Schema

### Tables

#### `agents`
Stores voice agent configurations

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | User identifier (optional) |
| name | TEXT | Agent name |
| industry | TEXT | Industry category |
| first_message | TEXT | Initial greeting |
| system_prompt | TEXT | AI instructions |
| questions | JSONB | Questions to ask |
| extract_fields | JSONB | Data to extract |
| knowledge_base | TEXT | Optional PDF content |
| created_at | TIMESTAMPTZ | Creation timestamp |

#### `calls`
Stores call records and extracted data

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| agent_id | UUID | Foreign key to agents |
| transcript | TEXT | Conversation transcript |
| extracted_data | JSONB | Extracted information |
| duration | INTEGER | Call duration (seconds) |
| status | TEXT | completed/failed/in_progress |
| created_at | TIMESTAMPTZ | Creation timestamp |

---

## Troubleshooting

### Error: "relation already exists"
Tables already exist. Either:
- Drop existing tables first
- Or modify migration to use `CREATE TABLE IF NOT EXISTS`

### Error: "permission denied"
Make sure you're using the service role key in `.env.local`

### Error: "syntax error"
Check that you copied the entire migration file

---

## Future Migrations

When adding new migrations:

1. Create new file: `supabase/migrations/YYYYMMDD_description.sql`
2. Add your SQL changes
3. Run through SQL Editor
4. Document changes here

---

## Rollback

To rollback this migration:

```sql
DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS agents CASCADE;
```

⚠️ **Warning**: This will delete all data!
