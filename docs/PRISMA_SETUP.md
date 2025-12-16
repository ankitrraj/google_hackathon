# Prisma Setup Guide for VoiceForge

## Step 1: Get Database Connection String

### From Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `vhmocttoecyeollvwurx`

2. **Navigate to Database Settings**
   ```
   Left Sidebar → Click "Database" icon (cylinder)
   OR
   Click "Project Settings" (gear) → Database
   ```

3. **Find Connection String**
   ```
   Scroll to "Connection string" section
   Select: "URI" format
   ```

4. **Copy Connection String**
   ```
   Format:
   postgresql://postgres:[YOUR-PASSWORD]@db.vhmocttoecyeollvwurx.supabase.co:5432/postgres
   ```

5. **Replace Password**
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - If forgot: Database Settings → Reset database password

---

## Step 2: Add to `.env.local`

Add this line to your `.env.local` file:

```env
# Database (Prisma)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.vhmocttoecyeollvwurx.supabase.co:5432/postgres"
```

**Example:**
```env
DATABASE_URL="postgresql://postgres:MySecurePass123@db.vhmocttoecyeollvwurx.supabase.co:5432/postgres"
```

---

## Step 3: Validate Schema

```bash
npx prisma validate
```

**Expected Output:**
```
✔ Prisma schema loaded from prisma/schema.prisma
✔ Environment variable DATABASE_URL available
✔ Prisma schema is valid
```

---

## Step 4: Push Schema to Database

```bash
npx prisma db push
```

**What this does:**
- Connects to Supabase
- Creates `agents` table
- Creates `calls` table
- Sets up relationships
- Creates indexes

**Expected Output:**
```
✔ Generated Prisma Client
✔ Database synchronized with Prisma schema
```

---

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

This creates TypeScript types for your database.

---

## Step 6: Verify in Supabase

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. You should see:
   - ✅ agents
   - ✅ calls

---

## Step 7: Open Prisma Studio (Optional)

```bash
npx prisma studio
```

Opens at `http://localhost:5555` to view/edit data visually!

---

## Usage in Code

### Import Prisma Client

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

### Create Agent

```typescript
const agent = await prisma.agent.create({
  data: {
    name: "Hotel Booking Agent",
    industry: "hospitality",
    firstMessage: "Hello! Welcome to our hotel.",
    systemPrompt: "You are a helpful hotel booking assistant...",
    questions: ["When would you like to check in?"],
    extractFields: [
      { name: "check_in_date", type: "date", description: "Check-in date" }
    ]
  }
});
```

### Get All Agents

```typescript
const agents = await prisma.agent.findMany({
  include: {
    calls: true
  }
});
```

### Create Call

```typescript
const call = await prisma.call.create({
  data: {
    agentId: agent.id,
    transcript: "Customer: I want to book a room...",
    extractedData: { check_in_date: "2025-12-20" },
    duration: 120,
    status: "COMPLETED"
  }
});
```

---

## Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
**Solution:** Add DATABASE_URL to `.env.local`

### Error: "Authentication failed"
**Solution:** Wrong password in DATABASE_URL

### Error: "Connection timeout"
**Solution:** Check internet or add `?sslmode=require`
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

### Error: "Table already exists"
**Solution:** Tables already created. Use `npx prisma db pull` to sync

---

## Common Commands

```bash
# Validate schema
npx prisma validate

# Push schema to database (no migration files)
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Pull existing schema from database
npx prisma db pull

# Format schema file
npx prisma format

# Reset database (⚠️ deletes all data)
npx prisma db push --force-reset
```

---

## Migration vs Push

### `npx prisma db push` (We're using this)
- ✅ Quick prototyping
- ✅ No migration files
- ✅ Direct schema sync
- ❌ No migration history

### `npx prisma migrate dev` (For production)
- ✅ Creates migration files
- ✅ Version control
- ✅ Rollback support
- ❌ More complex

For MVP, we use `db push`. Later switch to `migrate`.

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] DATABASE_URL added to `.env.local`
- [ ] Password replaced
- [ ] `npx prisma validate` successful
- [ ] `npx prisma db push` successful
- [ ] Tables visible in Supabase
- [ ] Prisma Studio opens

**Once all ✅, you're ready to code!** 🎉
