# Technology Stack

## Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks

## Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (planned)

## AI & Voice
- **LLM**: Google Gemini (for agent generation)
- **Voice Provider**: TBD (Google Cloud / OpenAI / ElevenLabs)
- **Speech-to-Text**: TBD
- **Text-to-Speech**: TBD

## Infrastructure
- **Hosting**: Vercel (planned)
- **Database**: Supabase Cloud
- **Phone**: Twilio (planned)
- **Storage**: Supabase Storage (for PDFs)

## Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Editor**: VS Code
- **Linting**: ESLint
- **Formatting**: Prettier (via Kiro)

## Key Dependencies
```json
{
  "@google/generative-ai": "^0.21.0",
  "@supabase/supabase-js": "^2.47.10",
  "next": "15.1.3",
  "react": "^19.0.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5"
}
```

## Architecture Decisions

### Why Next.js?
- Full-stack framework
- API routes built-in
- Great developer experience
- Easy deployment

### Why Supabase?
- PostgreSQL (reliable)
- Real-time capabilities
- Built-in auth
- Easy to use

### Why Gemini?
- Good at structured output
- Cost-effective
- Fast response times
- Google ecosystem

### Why TypeScript?
- Type safety
- Better IDE support
- Fewer runtime errors
- Industry standard
