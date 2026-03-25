# CONTEXT.md — public/

*Static assets served directly by Next.js. No processing, no bundling.*

---

## Ontology

| Term | Definition |
|---|---|
| **Static Asset** | A file served at its literal path — `public/logo.svg` is accessible at `/logo.svg` |
| **SVG Logo** | Vector logo variants for HarmonyForge — multiple lockups for different contexts |

---

## Decisions

- **Fonts are NOT served from `public/`** — fonts are loaded via CSS `@import` in `src/styles/fonts.css`
- **Logo SVGs live here** — `logo.svg`, `logo-nodes.svg`, `logo-soundwave.svg`, `logo-tuning-fork.svg`

---

## Patterns

- Reference public assets in components via absolute path: `src="/logo.svg"` (not a relative import)
- SVG logos imported as `<img>` tags or via Next.js `<Image>` component for optimization

---

## Policies

- **No TypeScript or React code in `public/`** — static files only
- **No design tokens in SVG files** — SVGs use inline colors or `currentColor`; never hardcoded Nocturne/Sonata values

---

## Files

| File | Purpose |
|---|---|
| `logo.svg` | Primary HarmonyForge logo |
| `logo-nodes.svg` | Node-style logo variant |
| `logo-soundwave.svg` | Soundwave logo variant |
| `logo-tuning-fork.svg` | Tuning fork logo variant |
| `file.svg` | Generic file icon |
| `globe.svg` | Globe icon |
| `next.svg` | Next.js logo (default Next.js asset) |
| `vercel.svg` | Vercel logo (default Next.js asset) |
| `window.svg` | Window icon |
| `assets/` | Reserved for additional static assets |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-10 | most-recent-explicit-guidance-superman | Task: (1) Run `bash scripts/specstory-to-context · Modified files: src/store/useUploadStore.ts, src/store/useEnsembleStore.ts, src/store/useSandboxStore.ts (+32 more) · Constraint enforced: Planning phase only — zero source code generated · Constraint enforced: Tasks scoped to single component/hook, completable in one context window · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-10_15-57-11Z-the-most-recent-explicit.md) | <!-- 817084a8-8da2-4624-933e-639945f36647 -->
