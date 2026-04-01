# Milind’s Resume

A resume website built as a **structured, interactive profile**.

Instead of being just a static page, this project turns resume data into multiple formats:

- a clean resume page
- a chat interface to ask questions about the resume
- a plain-text ATS-friendly version
- a raw JSON version of the resume data

The idea is simple:

> write resume data once, then use it everywhere.

This project is built with **Next.js**, **TypeScript**, and a typed resume schema so the same information can power the UI, APIs, and AI chat.

## Why this exists

Most resume websites are just styled text.

This one treats a resume like structured product data.

That makes it possible to:

- render a readable resume
- expose machine-readable resume data
- generate ATS-friendly text
- let people explore the profile through chat
- keep everything synced from one source of truth

## Project focus

The focus of this project is:

- **clarity** — easy to read for humans
- **structure** — resume data lives in a typed schema
- **reusability** — one dataset powers many views
- **interactivity** — visitors can chat with the resume
- **portability** — resume can be exported as plain text or JSON

This is not just a portfolio page.
It is a small system for presenting a professional profile in multiple useful ways.

## Features

### Resume experience
- Clean responsive resume UI
- Section-based layout for work, projects, education, skills, talks, and contributions
- Links to external proof, profiles, and project sources
- Copy-to-clipboard email interaction
- Print-friendly layout
- JSON resume view for structured inspection

### Chat with the resume
- Ask questions about the resume in natural language
- Resume-aware chat assistant
- Streaming responses
- Persistent chat history in the browser
- Sidebar chat interface
- Starter prompts for quick exploration
- Text-to-speech button for assistant responses

### Data and APIs
- Typed resume schema with validation
- Resume stored in a structured TypeScript object
- Raw JSON API route
- Plain-text ATS-friendly API route
- Shared data source across UI and APIs

### UX details
- Theme-aware interface
- Responsive layout for desktop and mobile
- Keyboard shortcut support
- Smooth chat interactions and message timestamps
- Print handling improvements
- Resume data transformed into plain text for simpler AI grounding

## Tech stack

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Zod**
- **Vercel AI SDK**
- **Groq**
- **Dexie** for browser-side chat persistence

## How it works

The main resume data lives in:

- `lib/resume.ts`

The schema lives in:

- `lib/resume-schema.ts`

The project then uses the same data to power:

- the main resume page
- the chat assistant
- the plain-text ATS export
- the raw JSON export

So instead of duplicating content across different files and formats, everything stays connected.

## Main routes

- `/` — main resume page
- `/api/plain` — ATS-friendly plain text resume
- `/api/raw` — raw structured resume JSON

## Local development

```bash
pnpm install
pnpm dev
```

For production build:

```bash
pnpm build
pnpm start
```

Type check:

```bash
pnpm run typecheck
```

## Environment variables

The chat route now uses server-side rate limiting and Telegram monitoring.

Required for `/api/chat`:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Existing chat/model integrations also still require their current provider env vars.

## Who this is for

This project is useful for:

- recruiters who want a readable resume
- hiring managers who want structured information quickly
- developers who want to see how a typed resume system can work
- anyone exploring interactive personal websites

## Future direction

Possible future improvements:

- tailored resume generation for specific job descriptions
- recruiter-focused summary mode
- stronger citations in chat answers
- project deep-dive pages
- role-based views of the same resume data

## License

Open source.
