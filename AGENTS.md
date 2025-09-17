# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js app router, including `page.tsx` (UI flow), `layout.tsx`, and API routes under `app/api/`.
- `components/` contains reusable UI such as `style-filter/` (drag-and-drop filters), `length-control.tsx`, and metrics displays.
- `lib/` houses client/server utilities (`api-client.ts`, `transform-service.ts`, `openai-service.ts`) and shared typings.
- `public/icons/` stores SVG/PNG assets aligned with filter identifiers; placeholder assets are not committed.
- `utils/` keeps light-weight helpers (e.g., `cn.ts` for class merging).

## Build, Test, and Development Commands
- `pnpm install` — install dependencies; pnpm is the canonical package manager.
- `pnpm dev` — start the Next.js dev server with Turbopack.
- `pnpm build` — generate the production bundle; runs Next.js build checks.
- `pnpm lint` — execute ESLint with the Next.js TypeScript ruleset; treat warnings as issues to resolve.

## Coding Style & Naming Conventions
- Use TypeScript with strict mode enabled; prefer explicit types for public APIs.
- Follow the existing module alias `@/` when importing from project root.
- Components live in PascalCase files; utilities and hooks use kebab- or camelCase (`text-stats.tsx`, `useFoo`).
- Tailwind is the primary styling tool; keep custom CSS in `app/globals.css` minimal.
- Run `pnpm lint` before sending changes; no autoformatter is enforced, so respect ESLint guidance.

## Testing Guidelines
- No automated test suite is present. Add unit or integration tests when introducing complex logic and document how to run them.
- For UI changes, capture manual verification steps (screenshots or notes) in the PR.

## Commit & Pull Request Guidelines
- Write imperative, concise commit messages (e.g., `Add APA style assets`).
- Each PR should include: summary of changes, validation notes (`pnpm lint`, manual checks), and linked issues when applicable.
- Highlight any new environment variables or migrations; include screenshots/GIFs for significant UI updates.

## Security & Configuration Tips
- Never commit `.env*` files or secrets. Use `.env.local` for local credentials.
- The OpenAI API key is required for `openai-service.ts`; document mock strategies if you introduce them.
