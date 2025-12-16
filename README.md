# 🎙️ VoiceForge

> AI-powered voice agent builder for businesses. Create intelligent voice assistants in minutes, not months.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Overview

VoiceForge is a platform that lets you create custom voice AI agents using natural language. Simply describe what you want your agent to do, and our AI generates a complete voice assistant configuration ready to deploy.

**Perfect for:**
- 🏨 Hotel booking systems
- 🏥 Medical appointment scheduling
- 🍕 Restaurant order taking
- 💇 Salon appointment booking
- 🛍️ Customer support automation

## ✨ Features

- **🤖 AI-Powered Generation**: Describe your agent in plain English, get a complete configuration
- **🎨 Visual Editor**: Fine-tune your agent's behavior with an intuitive interface
- **🗣️ Voice Integration**: Real-time voice conversations with natural speech
- **📊 Analytics Dashboard**: Track calls, view transcripts, analyze performance
- **🔌 Easy Integration**: Webhooks, APIs, and phone number provisioning
- **📚 Knowledge Base**: Upload documents to enhance your agent's knowledge

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini for agent generation
- **Voice**: TBD (Google Cloud / OpenAI / ElevenLabs)

[View full tech stack →](docs/TECH_STACK.md)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ankitrraj/google_hackathon.git
cd google_hackathon/voiceforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run database migrations
# Open Supabase SQL Editor and run supabase/schema.sql

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🔑 Environment Variables

Create a `.env.local` file with:

```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎯 Quick Start

1. **Create an Agent**
   ```
   Navigate to /create
   Enter: "Create a hotel booking agent for Raj Hotel"
   Click "Generate"
   ```

2. **Customize**
   ```
   Edit the generated configuration
   Adjust personality, questions, and behavior
   ```

3. **Test**
   ```
   Click "Test" to try your agent
   Make a test call and see it in action
   ```

4. **Deploy**
   ```
   Click "Deploy" to go live
   Get a phone number or embed on your website
   ```

## 📚 Documentation

- [Roadmap](docs/ROADMAP.md) - Current progress and future plans
- [Tech Stack](docs/TECH_STACK.md) - Detailed technology overview
- [Challenges](docs/CHALLENGES.md) - Known issues and solutions

## 🗂️ Project Structure

```
voiceforge/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── create/       # Agent creation page
│   │   └── dashboard/    # Dashboard page
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── create/       # Create page components
│   ├── lib/              # Utilities and services
│   │   ├── gemini.ts     # Gemini AI integration
│   │   ├── supabase.ts   # Database client
│   │   └── types.ts      # TypeScript types
│   └── utils/            # Helper functions
├── supabase/             # Database schema
├── docs/                 # Documentation
├── tests/                # Test files
└── public/               # Static assets
```

## 🧪 Testing

```bash
# Run Gemini API test
node tests/test-gemini.js

# Check available models
node tests/check-gemini-models.js
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Google Hackathon
- Inspired by Vapi.ai, Bland.ai, and Retell.ai
- UI components from [shadcn/ui](https://ui.shadcn.com/)

## 📧 Contact

Ankit Raj - [@ankitrraj](https://github.com/ankitrraj)

Project Link: [https://github.com/ankitrraj/google_hackathon](https://github.com/ankitrraj/google_hackathon)

---

<p align="center">Made with ❤️ for Google Hackathon</p>
