# VoiceForge - AI-Powered Voice Agents

Create, deploy, and manage AI-powered voice agents through natural language prompts. Built with Gemini 3 Pro and OpenAI Realtime API.

## 🚀 Features

- **AI-Generated Agents**: Describe your agent in plain English, Gemini 3 Pro creates the complete configuration
- **Voice Testing**: Test agents with real voice calls using OpenAI Realtime API
- **Analytics Dashboard**: Track calls, view transcripts, and analyze extracted data
- **Knowledge Base**: Upload PDFs to enhance agent capabilities
- **Instant Deployment**: Get shareable URLs for your agents immediately

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, ShadCN UI
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **AI Services**: 
  - Gemini 3 Pro (agent config generation, knowledge extraction)
  - OpenAI Realtime API (voice interactions)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI Studio account (for Gemini API)
- OpenAI account (for Realtime API)

## 🔧 Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voiceforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and fill in your API keys:
   ```env
   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key_here

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Agents table
   CREATE TABLE agents (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id TEXT,
     name TEXT NOT NULL,
     industry TEXT NOT NULL,
     system_prompt TEXT NOT NULL,
     questions JSONB NOT NULL DEFAULT '[]',
     extract_fields JSONB NOT NULL DEFAULT '[]',
     knowledge_base TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Calls table
   CREATE TABLE calls (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
     transcript TEXT NOT NULL,
     extracted_data JSONB NOT NULL DEFAULT '{}',
     duration INTEGER NOT NULL DEFAULT 0,
     status TEXT NOT NULL DEFAULT 'in_progress',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Indexes for performance
   CREATE INDEX idx_agents_user_id ON agents(user_id);
   CREATE INDEX idx_calls_agent_id ON calls(agent_id);
   CREATE INDEX idx_calls_created_at ON calls(created_at DESC);
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── create/            # Agent creation page
│   ├── agent/[id]/        # Agent detail & test page
│   ├── dashboard/         # Analytics dashboard
│   └── api/               # API routes
├── components/            # React components
│   └── ui/               # ShadCN UI components
├── lib/                  # Core libraries
│   ├── types.ts          # TypeScript types
│   ├── supabase.ts       # Database client
│   ├── gemini.ts         # Gemini API client
│   └── openai.ts         # OpenAI API client
└── utils/                # Utility functions
    ├── validation.ts     # Input validation
    └── extraction.ts     # Data extraction helpers
```

## 🔄 Development Workflow

This project follows a spec-driven development approach:

1. **Requirements** - Clear user stories and acceptance criteria
2. **Design** - Technical architecture and correctness properties  
3. **Tasks** - Incremental implementation plan
4. **Implementation** - Code with property-based testing

Current implementation status:
- ✅ Task 1: Project foundation and infrastructure
- 🔄 Task 2: Agent creation with Gemini integration (next)
- ⏳ Task 3: Voice interface with OpenAI Realtime API
- ⏳ Task 4: Dashboard and analytics
- ⏳ Task 5: Landing page and navigation
- ⏳ Task 6: PDF knowledge base upload

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Vitest for component and utility testing
- **Property-Based Tests**: fast-check for correctness properties
- **Integration Tests**: End-to-end workflow testing

Run tests:
```bash
npm test
```

## 🚀 Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📖 API Documentation

### Core Endpoints

- `POST /api/agents/create` - Create new agent from prompt
- `GET /api/agents/[id]` - Get agent details
- `POST /api/agents/[id]/upload-knowledge` - Upload PDF knowledge
- `POST /api/calls/start` - Start voice call session
- `POST /api/calls/complete` - Complete call and save data
- `GET /api/dashboard/stats` - Get dashboard analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using Next.js, Gemini 3 Pro, and OpenAI Realtime API.