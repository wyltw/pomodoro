# Pomodoro

A productivity tool for planning daily priorities, working in focused
intervals, and reviewing progress over time. It brings task planning, the
Pomodoro method, and focus insights into one streamlined workspace.

## Features

- Daily focus tasks with Pomodoro estimates and completion progress
- Task filtering and a dedicated active-task view
- Configurable focus sessions with pause, resume, and reset controls
- Structured short and long breaks
- Persistent focus sessions and seven-day productivity insights for signed-in
  users
- Completion notifications and adjustable sound volume
- Google sign-in
- Responsive sidebar and mobile-friendly layout

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS and shadcn-style UI primitives
- Zustand for client state and TanStack Query for server-state synchronization
- Better Auth with Google OAuth
- Prisma with PostgreSQL
- Vitest and Testing Library

## Getting Started

### Prerequisites

- Node.js 24
- npm
- A PostgreSQL database
- Google OAuth credentials

### Environment variables

Create a `.env` file in the project root:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
SHADOW_DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/SHADOW_DATABASE"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="replace-with-a-random-secret-at-least-32-characters-long"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

`SHADOW_DATABASE_URL` is used by Prisma when a shadow database is needed for
migration workflows. Keep credentials out of version control.

For local OAuth configuration, register these callback URLs with the providers:

```text
http://localhost:3000/api/auth/callback/google
```

### Install and initialize

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command             | Purpose                                           |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start the local development server on `127.0.0.1` |
| `npm run lint`      | Run ESLint                                        |
| `npm test`          | Run Vitest in watch mode                          |
| `npm test -- --run` | Run the test suite once                           |
| `npm run build`     | Create a production build                         |
| `npm run start`     | Serve the production build                        |

## Reference Documentation

- [Product specification](docs/product-spec.md)
- [Architecture](docs/architecture.md)

These documents describe the implemented application as a reference. The code
remains authoritative when behavior changes.
