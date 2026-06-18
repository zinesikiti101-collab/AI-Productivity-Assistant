README.md
# AI Workplace Command Center
An AI-powered executive assistant that transforms workplace information into actionable outcomes. Instead of isolated AI tools, the platform automatically converts meeting notes, emails, research documents, and project updates into summaries, tasks, schedules, recommendations, and professional communications.
## Project Overview
The AI Workplace Command Center is a modern SaaS web application designed for professionals, managers, administrators, and teams who need to process high volumes of workplace information efficiently. It bridges the gap between raw information and action by using advanced AI to analyze, synthesize, and generate structured outputs.
The application features a **Midnight Glass** visual design — a dark, glassmorphism-inspired interface with deep navy backgrounds, translucent panels, and indigo-to-cyan accent gradients that evoke the premium feel of tools like Linear and Microsoft Copilot.
## Features
### Core Modules
- **Dashboard** — Overview of productivity metrics, recent AI activity, and quick-access cards for all tools
- **Email Studio** — Generate professional emails with tone control (Executive, Friendly, Urgent, Diplomatic) and audience targeting
- **Meeting Intelligence** — Paste raw meeting notes and receive structured summaries, key decisions, and action item tables
- **AI Priority Planner** — Organize tasks into an Eisenhower Matrix (Urgent/Important quadrants) with a time-blocked daily schedule
- **Research Assistant** — Transform long-form text into executive briefs, opportunity analyses, and risk assessments
- **Workplace Chatbot** — Context-aware AI assistant with real-time streaming responses for workplace questions
- **Workflow Automation** — Multi-step chained tool that chains AI tasks from Meeting Notes → Summary → Action Items → Schedule → Email → Report
- **Prompt Lab** — A transparency hub for inspecting, reviewing, and refining the AI system prompts
- **Responsible AI Center** — Documentation of AI limitations, confidence indicators, and human-in-the-loop guidelines
### Design & UX
- Dark glassmorphism theme with deep navy surfaces and gradient accents
- Responsive layout with sidebar navigation
- Markdown rendering for all AI-generated content
- Real-time streaming chat interface
- Professional, portfolio-quality UI components
## Tools & Technologies
| Category | Technology |
|----------|------------|
| Framework | [TanStack Start](https://tanstack.com/start) v1 — Full-stack React with SSR/SSG |
| Language | TypeScript 5.8+ (strict mode) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 with custom `@utility` tokens |
| Components | Radix UI primitives + shadcn/ui |
| Routing | TanStack Router (file-based) |
| State / Data | TanStack Query |
| AI Gateway | Lovable AI Gateway with Google Gemini 3 Flash |
| AI SDK | Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`) |
| Icons | Lucide React |
| Charts | Recharts |
| Validation | Zod |
| Build Tool | Vite 8 |
| Runtime | Edge-compatible (Cloudflare Workers) |
## Setup Instructions
### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 20+
- A [Lovable](https://lovable.dev) account with API access
### 1. Clone & Install
```bash
git clone <repo-url>
cd ai-workplace-command-center
bun install
```
### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
LOVABLE_API_KEY=your_lovable_api_key_here
```
You can obtain your API key from your Lovable project settings.
### 3. Run the Development Server
```bash
bun run dev
```
The app will be available at `http://localhost:3000`.
### 4. Build for Production
```bash
bun run build
```
Preview the production build:
```bash
bun run preview
```
### Available Scripts
| Script | Description |
|--------|-------------|
| `bun run dev` | Start the Vite dev server |
| `bun run build` | Production build |
| `bun run build:dev` | Development-mode build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |
## Project Structure
```
src/
├── components/        # UI components (sidebar, markdown renderer, page headers)
├── components/ui/     # shadcn/ui primitive components
├── hooks/             # Custom React hooks (use-ai-generate, use-mobile)
├── lib/               # Utilities, prompts, and AI gateway configuration
│   ├── ai-gateway.server.ts   # Lovable AI Gateway provider setup
│   ├── ai.functions.ts        # Server functions for AI generation
│   └── prompts.ts             # Centralized system prompts
├── routes/            # TanStack Start file-based routes
│   ├── __root.tsx     # Root layout with sidebar provider
│   ├── index.tsx      # Dashboard (homepage)
│   ├── email.tsx      # Email Studio
│   ├── meetings.tsx   # Meeting Intelligence
│   ├── planner.tsx    # AI Priority Planner
│   ├── research.tsx   # Research Assistant
│   ├── chat.tsx       # Workplace Chatbot
│   ├── workflow.tsx   # Workflow Automation
│   ├── prompts.tsx    # Prompt Lab
│   ├── responsible.tsx # Responsible AI Center
│   └── api/chat.ts    # Streaming chat API route
├── styles.css         # Global styles with Tailwind v4 theme tokens
└── ...
```
## License
This project was built as a professional portfolio demonstration.
