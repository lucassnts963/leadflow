# LeadFlow CRM

Self-contained CRM for local business lead management — 100% client-side, no backend, all data persisted in `localStorage`.

Extracted from [elucas.dev](https://elucas.dev).

## Stack

- Next.js 14 App Router (JavaScript)
- Tailwind CSS
- framer-motion

## Features

- Lead management with status tracking and scoring
- Google Maps scraping via Apify (user's own API key)
- AI-powered outreach and objection handling via any OpenAI-compatible API (default: DeepSeek)
- CSV import/export
- Dashboard analytics
- Client-side auth gate

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Set your API keys in the **Config** tab.
