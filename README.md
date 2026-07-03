# Aevum

Aevum is a relationship-and-personal-growth companion app. It combines daily
check-ins, partner linking, psychology-style quizzes, and an AI coach to help
couples and individuals track their emotional health, communication patterns,
and day-to-day life across wellness, health, work, and finance.

It's a single full-stack TypeScript app: a React SPA on the frontend, a
Hono + tRPC API on the backend, and a MySQL-compatible database (TiDB Cloud
or plain MySQL) via Drizzle ORM. The same server can also be wrapped as a
native iOS/Android app with Capacitor.

## Tech Stack

- **Frontend:** React 19, React Router, Vite, Tailwind CSS, Radix UI / shadcn-style components, TanStack Query
- **Backend:** Hono, tRPC (`@trpc/server`), Zod validation
- **Database:** MySQL / TiDB Cloud via Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- **Auth:** Kimi OAuth + JWT sessions (`jose`)
- **AI / media:** OpenAI (chat + DALL-E image generation), with optional Stability AI / Replicate image providers
- **Mobile:** Capacitor (iOS/Android shells around the built web app)
- **Other:** web-push (push notifications), AWS S3 (file storage)

## Features

- **Check-ins** — daily mood/relationship check-ins
- **Partner Hub** — invite-code based partner linking and shared status
- **Quizzes** — attachment style, window of tolerance, neurochemistry, trauma programming, communication patterns
- **AI Hub** — AI coach, conflict resolution assistant, content generation, personalized recommendations, conversation history, and an AI "workspace"
- **Insights & Profile** — psychological profile and relationship insights
- **Everything Hub** — wellness, health, work, finance, notes, calendar, and data-connector screens
- **Settings** — including per-user image-generation API keys and push notification preferences

## Prerequisites

- Node.js 20+
- A MySQL-compatible database (e.g. a free [TiDB Cloud](https://tidbcloud.com) serverless cluster, or local MySQL)
- A Kimi platform app (for `APP_ID` / `APP_SECRET` / OAuth login)
- An OpenAI API key (for AI chat and image generation)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp env.example .env
# then fill in DATABASE_URL, OPENAI_API_KEY, APP_ID/APP_SECRET, etc. (see below)

# 3. Push the schema to your database
npm run db:push

# 4. Run the app in development mode
npm run dev
# App runs at http://localhost:3000 (Vite dev server + Hono API)
```

## Environment Variables

See `env.example` for the full list. Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL/TiDB connection string, e.g. `mysql://user:pass@host:port/db?ssl={"rejectUnauthorized":true}` |
| `OPENAI_API_KEY` | Used for AI chat responses and DALL-E image generation |
| `APP_ID` / `APP_SECRET` | Kimi platform app credentials |
| `VITE_APP_ID` | Same as `APP_ID`, exposed to the frontend build |
| `VITE_KIMI_AUTH_URL` / `KIMI_AUTH_URL` / `KIMI_OPEN_URL` | Kimi OAuth endpoints |
| `OWNER_UNION_ID` | Your Kimi union ID — grants you admin access |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with the Hono API mounted |
| `npm run build` | Build the frontend (Vite) and bundle the server (esbuild) into `dist/` |
| `npm start` | Run the production server (`dist/boot.js`) |
| `npm run check` | Type-check the whole project |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm test` | Run tests with Vitest |
| `npm run db:generate` | Generate a Drizzle migration from schema changes |
| `npm run db:migrate` | Apply Drizzle migrations |
| `npm run db:push` | Push the schema directly to the database (no migration files) |

## API

The backend exposes a single tRPC router (see `router.ts`) mounted under
`/api/trpc`, with sub-routers for `auth`, `checkin`, `partner`, `feed`,
`chat`, `psych`, `ai`, `image`, `push`, and `status`. A lightweight health
check is available at `/api/trpc/ping`.

## Deployment

The production server serves both the API and the built static frontend from
one process, so only a single deployment is needed. See [DEPLOY.md](./DEPLOY.md)
for step-by-step guides for Render, Railway, and Fly.io, plus a split
frontend/backend option.

## License

This project does not currently declare a license.
