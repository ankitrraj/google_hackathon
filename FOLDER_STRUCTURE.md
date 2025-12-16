# 📁 VoiceForge Folder Structure

## Complete Project Structure

```
voiceforge/
│
├── 📂 .kiro/                        # Kiro IDE configuration
│   └── 📂 specs/                    # Feature specifications
│       └── 📂 voiceforge/
│           ├── requirements.md      # User stories & acceptance criteria
│           ├── design.md            # Technical design & architecture
│           └── tasks.md             # Implementation task list
│
├── 📂 src/                          # Source code
│   │
│   ├── 📂 app/                      # Next.js App Router
│   │   │
│   │   ├── 📄 layout.tsx            # Root layout (metadata, fonts)
│   │   ├── 📄 page.tsx              # Landing page (/)
│   │   ├── 📄 globals.css           # Global styles
│   │   ├── 📄 favicon.ico           # App icon
│   │   │
│   │   ├── 📂 create/               # Agent Creation Page
│   │   │   └── 📄 page.tsx          # /create route
│   │   │
│   │   ├── 📂 agent/                # Agent Detail Pages
│   │   │   └── 📂 [id]/             # Dynamic route
│   │   │       └── 📄 page.tsx      # /agent/[id] route
│   │   │
│   │   ├── 📂 dashboard/            # Analytics Dashboard
│   │   │   └── 📄 page.tsx          # /dashboard route
│   │   │
│   │   └── 📂 api/                  # Backend API Routes
│   │       └── 📂 agents/           # Agent endpoints
│   │           ├── 📂 create/       # Agent creation
│   │           │   └── 📄 route.ts  # POST /api/agents/create
│   │           └── 📂 [id]/         # Agent operations
│   │               └── 📄 route.ts  # GET/PATCH /api/agents/[id]
│   │
│   ├── 📂 components/               # React Components
│   │   │
│   │   ├── 📂 ui/                   # ShadCN UI Components
│   │   │   ├── 📄 button.tsx        # Button component
│   │   │   ├── 📄 card.tsx          # Card component
│   │   │   ├── 📄 dialog.tsx        # Dialog/Modal component
│   │   │   ├── 📄 input.tsx         # Input field
│   │   │   ├── 📄 textarea.tsx      # Textarea field
│   │   │   ├── 📄 badge.tsx         # Badge component
│   │   │   ├── 📄 select.tsx        # Select dropdown
│   │   │   ├── 📄 progress.tsx      # Progress bar
│   │   │   ├── 📄 scroll-area.tsx   # Scrollable area
│   │   │   ├── 📄 accordion.tsx     # Accordion component
│   │   │   ├── 📄 table.tsx         # Table component
│   │   │   └── 📄 skeleton.tsx      # Loading skeleton
│   │   │
│   │   ├── 📄 AgentBuilder.tsx      # Agent creation form
│   │   ├── 📄 VoiceInterface.tsx    # Voice call UI (Task 3)
│   │   ├── 📄 Dashboard.tsx         # Analytics display (Task 4)
│   │   └── 📄 KnowledgeBaseUpload.tsx # PDF upload (Task 6)
│   │
│   ├── 📂 lib/                      # Core Libraries & Services
│   │   ├── 📄 gemini.ts             # Gemini AI service
│   │   ├── 📄 openai.ts             # OpenAI voice service
│   │   ├── 📄 supabase.ts           # Database client & service
│   │   ├── 📄 types.ts              # TypeScript type definitions
│   │   └── 📄 utils.ts              # ShadCN utility functions
│   │
│   └── 📂 utils/                    # Utility Functions
│       ├── 📄 validation.ts         # Input validation functions
│       └── 📄 extraction.ts         # Data extraction helpers
│
├── 📂 supabase/                     # Database
│   └── 📄 schema.sql                # Complete database schema
│
├── 📂 scripts/                      # Utility Scripts
│   └── 📄 setup-database.js         # Database setup helper
│
├── 📂 public/                       # Static Assets
│   └── (images, fonts, etc.)
│
├── 📂 node_modules/                 # Dependencies (auto-generated)
│
├── 📄 .env.local                    # Environment variables (SECRET!)
├── 📄 .env.example                  # Environment template
├── 📄 .gitignore                    # Git ignore rules
│
├── 📄 package.json                  # Project dependencies
├── 📄 package-lock.json             # Dependency lock file
│
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 components.json               # ShadCN UI configuration
│
├── 📄 README.md                     # Project documentation
├── 📄 SETUP.md                      # Setup instructions
├── 📄 ARCHITECTURE.md               # Architecture documentation
├── 📄 FOLDER_STRUCTURE.md           # This file
└── 📄 QA_REPORT.md                  # QA analysis report
```

---

## 📂 Folder Purposes

### `/src/app/` - Frontend & Backend
**Purpose:** Next.js App Router - handles both UI pages and API routes

**Structure:**
- **Pages** (root level) - Frontend routes
- **`/api/`** - Backend API endpoints

**Why this structure?**
- Co-location of related code
- Clear separation between frontend and backend
- Next.js convention

---

### `/src/components/` - React Components
**Purpose:** Reusable UI components

**Structure:**
- **`/ui/`** - Base UI components (ShadCN)
- **Root level** - Feature components (AgentBuilder, Dashboard)

**Why this structure?**
- Separates base UI from feature components
- Easy to find and maintain
- Follows ShadCN convention

---

### `/src/lib/` - Core Services
**Purpose:** Business logic and external service integrations

**Files:**
- `gemini.ts` - AI agent generation
- `openai.ts` - Voice interactions
- `supabase.ts` - Database operations
- `types.ts` - TypeScript definitions
- `utils.ts` - Helper functions

**Why this structure?**
- Centralized business logic
- Easy to test
- Clear service boundaries

---

### `/src/utils/` - Utility Functions
**Purpose:** Pure utility functions (no external dependencies)

**Files:**
- `validation.ts` - Input validation
- `extraction.ts` - Data transformation

**Why separate from `/lib/`?**
- `/lib/` = Services (external dependencies)
- `/utils/` = Pure functions (no dependencies)

---

### `/supabase/` - Database
**Purpose:** Database schema and migrations

**Files:**
- `schema.sql` - Complete database schema

**Why at root level?**
- Database is infrastructure, not application code
- Easy to find for DevOps
- Can be deployed independently

---

### `/scripts/` - Utility Scripts
**Purpose:** Development and deployment scripts

**Files:**
- `setup-database.js` - Database setup helper

**Why at root level?**
- Not part of application code
- Used during setup/deployment
- Node.js scripts (not TypeScript)

---

## 🎯 File Naming Conventions

### Components
```
PascalCase.tsx
Examples:
- AgentBuilder.tsx
- VoiceInterface.tsx
- Dashboard.tsx
```

### Services & Utils
```
camelCase.ts
Examples:
- gemini.ts
- supabase.ts
- validation.ts
```

### API Routes
```
route.ts (Next.js convention)
Examples:
- /api/agents/create/route.ts
- /api/agents/[id]/route.ts
```

### Pages
```
page.tsx (Next.js convention)
Examples:
- /create/page.tsx
- /agent/[id]/page.tsx
```

---

## 🔍 How to Find Things

### "Where is the agent creation form?"
```
src/components/AgentBuilder.tsx
```

### "Where is the API endpoint for creating agents?"
```
src/app/api/agents/create/route.ts
```

### "Where is the Gemini integration?"
```
src/lib/gemini.ts
```

### "Where is the database schema?"
```
supabase/schema.sql
```

### "Where are the TypeScript types?"
```
src/lib/types.ts
```

### "Where is input validation?"
```
src/utils/validation.ts
```

### "Where is the landing page?"
```
src/app/page.tsx
```

### "Where is the agent detail page?"
```
src/app/agent/[id]/page.tsx
```

---

## 📦 What Each File Does

### Frontend Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `app/page.tsx` | Landing page | Hero, features, templates |
| `app/create/page.tsx` | Agent creation | Uses AgentBuilder component |
| `app/agent/[id]/page.tsx` | Agent details | Display agent, test button |
| `app/dashboard/page.tsx` | Analytics | Call history, stats |
| `components/AgentBuilder.tsx` | Creation form | Templates, prompt input, preview |

### Backend Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `api/agents/create/route.ts` | Create agent | POST endpoint, Gemini call |
| `api/agents/[id]/route.ts` | Get/update agent | GET/PATCH endpoints |
| `lib/gemini.ts` | AI service | generateAgentConfig() |
| `lib/supabase.ts` | Database | createAgent(), getAgent() |
| `lib/openai.ts` | Voice service | createVoiceSession() |

### Utility Files

| File | Purpose | Key Functions |
|------|---------|---------------|
| `utils/validation.ts` | Validation | validatePrompt(), validateAgentConfig() |
| `utils/extraction.ts` | Data helpers | generateAgentUrl(), formatDuration() |
| `lib/types.ts` | Types | Agent, Call, AgentConfig |

---

## 🚀 Adding New Features

### Adding a New Page
```
1. Create: src/app/new-page/page.tsx
2. Add navigation link in layout or other pages
3. Done!
```

### Adding a New API Endpoint
```
1. Create: src/app/api/new-endpoint/route.ts
2. Export async function POST/GET/etc.
3. Add to types.ts if needed
4. Done!
```

### Adding a New Component
```
1. Create: src/components/NewComponent.tsx
2. Import in page where needed
3. Done!
```

### Adding a New Service
```
1. Create: src/lib/new-service.ts
2. Export class or functions
3. Import in API routes or components
4. Done!
```

---

## 🎨 Design System Location

### UI Components
```
src/components/ui/
```

All base UI components from ShadCN are here:
- Buttons, Cards, Dialogs
- Inputs, Textareas, Selects
- Badges, Progress bars
- Tables, Accordions

### Styling
```
src/app/globals.css
```

Global styles and Tailwind configuration

### Theme Configuration
```
tailwind.config.ts
```

Colors, fonts, spacing, etc.

---

## 📊 Data Flow Through Folders

### Agent Creation Flow
```
1. User Input
   ↓
2. src/components/AgentBuilder.tsx
   ↓ fetch('/api/agents/create')
3. src/app/api/agents/create/route.ts
   ↓ GeminiService.generateAgentConfig()
4. src/lib/gemini.ts
   ↓ Returns AgentConfig
5. src/lib/supabase.ts (DatabaseService.createAgent())
   ↓ Saves to database
6. Returns to AgentBuilder
   ↓ Shows preview
7. Navigate to src/app/agent/[id]/page.tsx
```

---

## 🔐 Security-Sensitive Files

### NEVER commit these:
```
.env.local           # Contains API keys
node_modules/        # Dependencies
.next/               # Build output
```

### Safe to commit:
```
.env.example         # Template (no real keys)
src/**/*             # All source code
public/**/*          # Static assets
```

---

## 📈 File Size Guidelines

### Keep files under:
- Components: < 300 lines
- Services: < 500 lines
- API routes: < 200 lines
- Utils: < 300 lines

### If file is too large:
- Split into multiple files
- Extract reusable logic
- Create sub-components

---

## 🎯 Quick Reference

### Most Important Files
1. `src/components/AgentBuilder.tsx` - Agent creation UI
2. `src/lib/gemini.ts` - AI generation
3. `src/lib/supabase.ts` - Database operations
4. `src/app/api/agents/create/route.ts` - Creation API
5. `supabase/schema.sql` - Database schema

### Configuration Files
1. `.env.local` - Environment variables
2. `package.json` - Dependencies
3. `tsconfig.json` - TypeScript settings
4. `tailwind.config.ts` - Styling
5. `next.config.js` - Next.js settings

### Documentation Files
1. `README.md` - Project overview
2. `SETUP.md` - Setup instructions
3. `ARCHITECTURE.md` - Technical architecture
4. `FOLDER_STRUCTURE.md` - This file
5. `QA_REPORT.md` - Quality assurance

---

**Last Updated:** December 13, 2024  
**Total Files:** ~50  
**Total Folders:** ~15  
**Lines of Code:** ~3,000