# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `app/`, including route UIs (`page.tsx`), shared scaffolding (`layout.tsx`), and API handlers under `app/api/`. Reusable UI sits in `components/` (for example, `components/style-filter/` and `components/length-control.tsx`). Shared runtime helpers and integrations belong in `lib/` (`api-client.ts`, `transform-service.ts`, `openai-service.ts`). Lightweight utilities such as `utils/cn.ts` cover cross-cutting helpers. Assets are stored in `public/`, with icons in `public/icons/` matching filter identifiers. Long-form references and specs go in `docs/`.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies; always bootstrap with pnpm to keep the lockfile intact.
- `pnpm dev` — run the Turbopack-powered dev server at `http://localhost:3000`.
- `pnpm build` — produce a production bundle and run Next.js type and route checks.
- `pnpm lint` — execute ESLint; warnings count as failures and must be resolved before shipping.

## Coding Style & Naming Conventions
Author React components in TypeScript with strict mode enabled. Components use PascalCase filenames, while hooks and utilities use camelCase or kebab-case (`text-stats.tsx`, `useFoo`). Prefer the `@/` path alias for root-relative imports. Tailwind utility classes are the default styling approach; keep `app/globals.css` additive and minimal. Favor explicit prop and return types for exported APIs.

## Testing Guidelines
There is no default automated suite. When adding non-trivial logic, contribute targeted unit or integration tests (Vitest or React Testing Library are preferred) and document the `pnpm` command required to run them. For UI changes, capture manual verification notes or screenshots in the PR description.

## Commit & Pull Request Guidelines
Write imperative, concise commit messages (e.g., `Add APA style assets`). Pull requests must summarize scope, list validation steps (`pnpm lint`, manual QA, screenshots/GIFs), and link issues when relevant. Highlight breaking changes, config updates, or new environment variables up front.

## Security & Configuration Tips
Never commit `.env*` files or secrets; rely on `.env.local` for local keys. The OpenAI API key powers `lib/openai-service.ts`; if you add mocks or fallbacks, document the approach. Review third-party packages before adding them and prefer existing utility layers over introducing new ones.
