# CONTEXT.md — src/app/

*Next.js App Router root. Contains the global layout, global CSS tokens, and the two primary route segments: `sandbox/` and `document/`.*

---

## Ontology

| Term | Definition |
|---|---|
| **Route Segment** | A Next.js App Router directory with a `page.tsx` that maps to a URL path |
| **Root Layout** | `layout.tsx` — wraps all routes; mounts `ThemeProvider`, global fonts, and `globals.css` |
| **Root Page** | `page.tsx` — the landing screen (`/`); currently the entry point |
| **Sandbox Route** | `/sandbox` — the Tactile Sandbox: score canvas, playback, Theory Inspector |
| **Document Route** | `/document` — upload, metadata, export |
| **globals.css** | The single source of truth for all design tokens (Tailwind v4 CSS-first) |

---

## Decisions

- **App Router (not Pages Router)**: Layouts, loading states, and error boundaries are file-based
- **`globals.css` in `src/app/`**: Tailwind v4 CSS-first — tokens declared as CSS custom properties inside `@theme {}` and `:root {}` — no `tailwind.config.js`
- **Tailwind v4 `--font-*` in `@theme` removed** (2026-03-12): Tailwind v4.2.x generates a broken `.font-[family-name:var(...)]` template class from any `--font-*` variable in `@theme`. Turbopack's strict CSS parser rejects it. Font vars moved to plain `:root {}`. Manual `.font-*` classes (`.font-sans`, `.font-brand`, etc.) defined explicitly in `globals.css`.
- **`postcss.config.js` (CJS) replaces `postcss.config.mjs`** (2026-03-12): CJS format required for Next.js PostCSS plugin loading. Adds `removeBrokenFontTemplate` plugin after `@tailwindcss/postcss` to strip the broken class before Turbopack parses the CSS output.
- **`"use client"` at component level**: Pages and layouts remain Server Components by default; `"use client"` is pushed down to individual components that need interactivity

---

## Patterns

- `layout.tsx` imports `globals.css`, `fonts.css`, and mounts `<ThemeProvider>` — nothing else
- `page.tsx` files compose organisms only — no inline logic, no direct store reads
- Token structure in `globals.css`: `@theme {}` for Tailwind mapping → `:root {}` for CSS variables → `.dark {}` for Nocturne overrides
- Font loading: `next/font` or `@import` in `src/styles/fonts.css` — never `<link>` in layout

---

## Policies

- **No business logic in `layout.tsx` or root `page.tsx`** — layout is structural only
- **No constraint computation in any route** — the route layer composes UI; it does not process music theory
- **Do not add design tokens anywhere except `globals.css`** — all token additions go here, nowhere else
- **Never nest a route segment inside another segment** unless creating a true sub-route (e.g., `/sandbox/[id]`)

---

## Research

| Resource | Purpose |
|---|---|
| `src/app/globals.css` | All design tokens — Sonata/Nocturne, spacing, radius, shadows, WCAG-safe accent |
| `src/styles/fonts.css` | Font face imports |
| `src/components/atoms/ThemeProvider.tsx` | `next-themes` provider mounted in layout |
| `specs/001-satb-sandbox.md` | AC-004 (theme toggle), AC-001 (score canvas route) |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-02 | after-every-correction,-want-update | Modified files: .claude/projects/-Users-shivpat-harmony-forge-redesign/memory/MEMORY.md, .claude/plans/bubbly-sniffing-tiger.md, notes/journey.md (+3 more) · List the top-level directory structure of /Users/shivpat/harmony-forge-redesign (ls one level deep) 5. · Top-level Directory Structure of /Users/shivpat/harmony-forge-redesign CLAUDE. · The project enforces Intrinsic Determinism for music theory and has established rules for ui-ux-pro-max suggestions (never auto-apply colors, safe to adopt UX patterns directly). · Meta-rewrite Superman is asking for intellectual friction as a feature — a check against confirmation bias and rash decisions. | [history](.specstory/history/2026-03-02_03-14-15Z-explore-the-following-in.md) | <!-- bfe3c57b-bee8-485c-9087-fd9ae6e7be5d -->
| 2026-03-02 | https:-www.noteflight.com-home-based-note | Task: Restructure all 3 rows into a group-container architecture: · Modified files: src/app/globals.css, src/types/palette.types.ts, src/stores/useScorePaletteStore.ts (+26 more) · Constraint enforced: Nocturne tokens only — #3a2320 toolbar, #4a2f2b separator, #ffb300 labels, #b0a090 icons · Constraint enforced: 8px grid: gap-8 within group frames; gap-20 between group frames; padding-24 edges · Agent (claude-sonnet-4-6 2026-03-02 16:53:36Z) Agent - sidechain (2026-03-02 16:52:39Z) Explore the HarmonyForge project at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-02_16-52-22Z-explore-the-harmonyforge-project.md) | <!-- 1be60351-96c3-4b52-9672-9cfd4a40142f -->
| 2026-03-02 | node-id:-ddqqm-all-notes | Task: Replace $sonata-accent on all 8 label nodes with $sonata-surface (Cherry Wood #9E4B3E), · Modified files: .claude/plans/logical-twirling-newt.md · Constraint enforced: Design system tokens only — no ad-hoc hex values · Constraint enforced: $sonata-detail (#D2B48C Tan Birch) is too light at ~1.8:1 — rules out · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-02_21-45-46Z.md) | <!-- 25e0bd9d-70c5-44d0-92d6-6c9c9460105a -->
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-04 | want-export-these-designs-code | Task: Explain the reliable design-to-code export process — tools, workflow order, and · Modified files: src/app/globals.css, src/app/layout.ts, src/app/page.ts (+4 more) · Constraint enforced: Must stay within the existing stack: Next.js App Router, TypeScript, Tailwind v4 · Constraint enforced: Design tokens in the .pen file map to CSS custom properties in globals.css · Agent (claude-sonnet-4-6 2026-03-04 05:21:51Z) The user approved "Start with globals. | [history](.specstory/history/2026-03-04_05-17-28Z-your-task-is-to.md) | <!-- d39e462f-c089-45ef-83ee-296da1b0ddc0 -->
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/components/atoms/ModalOverlay.ts, src/components/atoms/ExportOptionCard.ts, src/components/atoms/ExportSectionHeader.ts (+15 more) · Agent (claude-sonnet-4-6 2026-03-04 11:32:37Z) Agent - sidechain (2026-03-04 11:31:28Z) Explore the project at /Users/shivpat/harmony-forge-redesign. · The system is ready for Phase 2 implementation. | [history](.specstory/history/2026-03-04_11-31-11Z-explore-the-project-at.md) | <!-- 23f49955-3311-427e-9634-8498c7355976 -->
| 2026-03-09 | user-opened-file-temp-readonly | Task: the specific component or feature requested · Modified files: .claude/commands/compaction/research_codebase.md, .claude/commands/compaction/create_plan.md, .claude/commands/compaction/implement_plan.md (+10 more) · Constraint enforced: stack requirements, a11y rules, symbolic-only music handling, Theory Named strategy · Agent (claude-sonnet-4-6 2026-03-09 04:49:04Z) Agent - sidechain (2026-03-09 04:48:10Z) Explore the repository at /Users/shivpat/harmony-forge-redesign and report: 1. · Top-Level Directory Structure /Users/shivpat/harmony-forge-redesign/ ├── . | [history](.specstory/history/2026-03-09_04-47-47Z-explore-the-repository-at.md) | <!-- 6673df72-15ca-47fa-a1ee-39239100411a -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: .claude/projects/-Users-shivpat-harmony-forge-redesign/memory/MEMORY.md, .claude/plans/bubbly-sniffing-tiger.md, notes/journey.md (+3 more) · List the top-level directory structure of /Users/shivpat/harmony-forge-redesign (ls one level deep) 5. · Top-level Directory Structure of /Users/shivpat/harmony-forge-redesign CLAUDE. · The project enforces Intrinsic Determinism for music theory and has established rules for ui-ux-pro-max suggestions (never auto-apply colors, safe to adopt UX patterns directly). | [history](.specstory/history/2026-03-10_08-58-00Z-you-are-a-context.md) | <!-- 116d691f-72b3-4386-bc8f-3e85c4d98ad0 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-02 16:53:36Z) Agent - sidechain (2026-03-02 16:52:39Z) Explore the HarmonyForge project at /Users/shivpat/harmony-forge-redesign. · Any existing icon library being used (lucide-react, heroicons, react-icons, phosphor, etc. · Agent (claude-sonnet-4-6 2026-03-02 16:52:58Z) Agent - sidechain (2026-03-02 16:52:41Z) Explore the design system files in /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-09Z-you-are-a-context.md) | <!-- 9756dfad-e30a-4888-b1ed-90d0d65442e0 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: .claude/plans/logical-twirling-newt.md | [history](.specstory/history/2026-03-10_08-58-12Z-you-are-a-context.md) | <!-- 9948233e-01aa-415c-8b2c-7f5a048dcd58 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:32:37Z) Agent - sidechain (2026-03-04 11:31:28Z) Explore the project at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-47Z-you-are-a-context.md) | <!-- 286aad38-3b01-410a-9b48-f2c1e806f67f -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-09 04:49:04Z) Agent - sidechain (2026-03-09 04:48:10Z) Explore the repository at /Users/shivpat/harmony-forge-redesign and report: 1. | [history](.specstory/history/2026-03-10_08-58-58Z-you-are-a-context.md) | <!-- 96464360-665e-4e96-86c0-8908359b9dcd -->
| 2026-03-10 | user-opened-file-users-shivpat | Modified files: specs/001-satb-sandbox.md, docs/adr/overview.md, specs/002-theory-tags.md (+5 more) · Skills (invoked with /skill-name ) are extensible workflows you or Claude can create: - Stored in . · Best for straightforward tasks like simple refactors or basic explanations. · Recommended for complex architectural decisions, challenging bugs, or multi-step implementation planning. · On other models (Haiku, older Sonnet/Opus versions), thinking uses a fixed budget instead. | [history](.specstory/history/2026-03-10_15-28-35Z-https-notebooklm-google-com.md) | <!-- a2ca65f7-c568-41ba-bae9-03420179d99a -->
| 2026-03-12 | caveat:-messages-below-were-generated | User request: Caveat: The messages below were generated by the user while running local commands. DO NOT respond to these messages or otherwise consider them in you | [history](.specstory/history/2026-03-12_09-24-00Z.md) | <!-- f75fb4ea-173c-4d37-8f66-e03352a85b62 -->
