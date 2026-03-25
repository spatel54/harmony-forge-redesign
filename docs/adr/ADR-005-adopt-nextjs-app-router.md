# ADR-005: Adopt Next.js App Router Over Pages Router

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** —

---

## Decision Drivers

- Next.js 15 defaults to App Router; Pages Router is in maintenance mode
- HarmonyForge routes are simple (`/`, `/document`, `/sandbox`) — no complex data fetching patterns
- React Server Components enable layout-level optimizations without manual code splitting

## Context

HarmonyForge was scaffolded with `create-next-app@latest` which defaults to App Router. The three primary routes (`/`, `/document`, `/sandbox`) each have a `layout.tsx` and `page.tsx`. Client components are marked with `"use client"` at the component level, not the page level.

## Options Considered

### Option 1: Next.js App Router — **Selected**

- **Pro:** Actively developed; React Server Components support
- **Pro:** Layout sharing via `layout.tsx` at the route segment level — no manual HOC pattern
- **Con:** `"use client"` boundary management requires discipline; Zustand stores need client wrapping

### Option 2: Pages Router

- **Pro:** Mature; extensive documentation; no `"use client"` boundary complexity
- **Con:** In maintenance mode; not the recommended path for new Next.js 15 projects
- **Con:** No React Server Components — entire pages are client bundles

## Decision

We will use Next.js App Router exclusively. All routes use `layout.tsx` + `page.tsx` conventions. `"use client"` is applied at the component level (not the page level) for the minimum necessary client surface area.

## Rationale

App Router is the canonical Next.js 15 path. The `"use client"` discipline (components only, not pages) keeps server-rendered HTML for non-interactive elements, reducing Time to First Byte. We are not optimizing for Pages Router familiarity — we are optimizing for future compatibility with the Next.js ecosystem.

## Consequences

**Positive:**

- Routes are explicit `layout.tsx` / `page.tsx` pairs — predictable file structure
- Server-side layout rendering reduces bundle size for non-interactive scaffold
- Easier upgrade path as Next.js evolves

**Negative:**

- `"use client"` boundary must be managed manually — missing boundary causes server/client hydration errors
- Zustand stores cannot be created at the server level

**Neutral / Follow-ups:**

- Current route segments: `/` (landing), `/document` (review), `/sandbox` (editor)
- `layout.tsx` at root applies global fonts and theme initialization

## Validation / Revisit Criteria

- Revisit if App Router introduces breaking changes that require significant refactoring cost
- Revisit if a server-side data fetching pattern is needed that favors Pages Router conventions

## References

- `src/app/` — route directory structure
- Next.js 15 App Router documentation
