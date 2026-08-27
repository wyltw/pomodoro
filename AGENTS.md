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
- Treat likely typos in requested filenames or symbols as ambiguous; infer from context when obvious, otherwise ask before creating or renaming files
- Prefer early returns or guard clauses for invalid or fallback branches
- Avoid type assertions whenever possible; prefer inference, narrowing, schemas, or type guards at trust boundaries
- Name helpers for the generic operation they perform unless the domain meaning changes the behavior; avoid repeating context already clear at the call site

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

- Format commit messages and PR titles as `<type>[optional scope]: <description>`.
- Use a concise Conventional Commits type such as `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `revert`, or `chore`.
- Review every staged change and infer the commit's core purpose before writing the description.
- Write the description as a concise imperative summary of that purpose. If the staged changes serve multiple distinct purposes, mention each one rather than describing only a subset.
- Do not add prefixes outside this format, including `[codex]`.
- Include the description and test results in the PR body.
