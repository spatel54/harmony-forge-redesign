# CONTEXT.md — src/layouts/

*Shared layout wrappers. Currently a placeholder directory — Next.js App Router layout convention means actual layouts live in `src/app/layout.tsx`.*

---

## Ontology

| Term | Definition |
|---|---|
| **Layout** | A React component that wraps a route or group of routes with persistent UI (nav, sidebars, providers) |
| **Root Layout** | `src/app/layout.tsx` — the single layout currently in use; mounts `ThemeProvider` and imports fonts |

---

## Decisions

- **Layouts follow App Router convention**: Layouts live in `src/app/` as `layout.tsx` files. This directory (`src/layouts/`) is pre-allocated for custom shared layout components if needed in later phases.

---

## Patterns

- (None yet — directory contains only `README.md`)
- Future pattern: shared layout wrapper components imported by `src/app/layout.tsx`

---

## Policies

- **No page-specific logic in layouts** — layouts are structural wrappers only
- **No Zustand store writes in layouts** — providers (ThemeProvider) are the only acceptable context setup

---

## Research

| Resource | Purpose |
|---|---|
| `src/app/layout.tsx` | The active root layout |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-02-26 | user-selected-lines-users-shivpat | Modified files: design-system/MASTER.md, src/app/globals.css · Meta-Rewrite - What is the user actually asking for? · Shall I proceed with the implementation as described above? · Agent (claude-sonnet-4-6 2026-02-27 01:44:13Z) Now replace all Sonata tokens with Nocturne tokens across the copied frame. · Command executed: ls /Users/shivpat/harmony-forge-redesign/ && cat /Users/shivpat/harmony-forge-redesign/tsconfig.json | [history](.specstory/history/2026-02-26_17-31-03Z.md) | <!-- a29d2b69-75b7-4c27-846d-1905f28d8b0b -->
| 2026-03-02 | https:-www.noteflight.com-home-based-note | Task: Restructure all 3 rows into a group-container architecture: · Modified files: src/app/globals.css, src/types/palette.types.ts, src/stores/useScorePaletteStore.ts (+26 more) · Constraint enforced: Nocturne tokens only — #3a2320 toolbar, #4a2f2b separator, #ffb300 labels, #b0a090 icons · Constraint enforced: 8px grid: gap-8 within group frames; gap-20 between group frames; padding-24 edges · Agent (claude-sonnet-4-6 2026-03-02 16:53:36Z) Agent - sidechain (2026-03-02 16:52:39Z) Explore the HarmonyForge project at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-02_16-52-22Z-explore-the-harmonyforge-project.md) | <!-- 1be60351-96c3-4b52-9672-9cfd4a40142f -->
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | HarmonyForge is a Glass Box co-creative SATB music arrangement tool — "ante-hoc" meaning the theory explanations are surfaced before or as the user makes decisions, not after. | [history](.specstory/history/2026-03-10_08-57-50Z-you-are-a-context.md) | <!-- dc41960f-0218-4899-a95e-dd75a72f8d61 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-02 16:53:36Z) Agent - sidechain (2026-03-02 16:52:39Z) Explore the HarmonyForge project at /Users/shivpat/harmony-forge-redesign. · Any existing icon library being used (lucide-react, heroicons, react-icons, phosphor, etc. · Agent (claude-sonnet-4-6 2026-03-02 16:52:58Z) Agent - sidechain (2026-03-02 16:52:41Z) Explore the design system files in /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-09Z-you-are-a-context.md) | <!-- 9756dfad-e30a-4888-b1ed-90d0d65442e0 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
