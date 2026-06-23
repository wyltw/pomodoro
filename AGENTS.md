# Repository Guidelines

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Overview

This repository is a Pomodoro timer app.

Tech stack:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Vitest

## File Structure

```text
pomodoro/
├── src/
│   ├── app/             # Next.js App Router layouts, pages, and globals
│   ├── components/      # React components for app features and layout
│   │   ├── timer/       # Timer-specific UI components
│   │   └── ui/          # Reusable shadcn-style primitives
│   ├── lib/             # Shared hooks, contexts, types, constants, and utils
│   └── testing/         # Test setup files
├── public/              # Static assets
├── .github/workflows/   # CI configuration
└── node_modules/next/dist/docs/ # Local Next.js version docs
```

## Code Style

- Use type aliases over interface
- Use named exports, not default exports
- Use Shadcn MCP to search existing shadcn-style components before creating new UI primitives
- Extract large JSX blocks into semantic components with clear names

## Build, Test, and Development Commands

- `npm run dev`: start the local Next.js development server.
- `npm run lint`: run ESLint across the project.
- `npm test`: run Vitest in watch mode.
- `npm test -- --run`: run Vitest once, matching CI.
- `npm run build`: create a production build with Next.js.
- `npm run start`: serve a built production app.

## Testing Guidelines

Focus tests on integration behavior using Vitest with Testing Library. Test files should use `*.test.ts` or `*.test.tsx` and live close to the implementation. Cover state transitions, user interactions, and edge cases for hooks or interactive components.

## Commit & Pull Request Guidelines

Recent commits use concise prefixes such as `fix:`, `chore:`, `ci:`, and `layout:`. Follow that style with an imperative summary, for example `fix: handle timer reset state`. PRs should include a short description, test results, linked issues when relevant, and screenshots or recordings for visible UI changes.

## Agent-Specific Instructions

This project uses Next.js `16.2.9`, which may differ from older Next.js conventions. Before changing Next.js routing, server/client component behavior, forms, or build APIs, read the relevant guide in `node_modules/next/dist/docs/` and follow any deprecation notices.
