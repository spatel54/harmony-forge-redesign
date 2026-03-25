# CONTEXT.md — src/styles/

*Font imports. Design tokens live in `src/app/globals.css`, not here.*

---

## Ontology

| Term | Definition |
|---|---|
| **`fonts.css`** | Imports the three HarmonyForge typefaces: Instrument Serif (brand), Inter (body/labels), Satoshi (system/data) |
| **Type Scale** | The locked font size and weight hierarchy defined in `design-system.md` |

---

## Decisions

- **Font loading via CSS `@import`** in `fonts.css`, imported into `layout.tsx` — not via Next.js `next/font` (already established)
- **Token source is `globals.css`** (in `src/app/`), not this directory — this directory is fonts only

---

## Patterns

- `fonts.css` is imported once in `src/app/layout.tsx`
- Font families referenced in Tailwind via CSS custom properties defined in `globals.css`

---

## Policies

- **Never add design tokens to `fonts.css`** — all token declarations belong in `src/app/globals.css`
- **Never add utility classes or component styles here** — this is a font import file only

---

## Files

| File | Purpose |
|---|---|
| `fonts.css` | Font face imports for Instrument Serif, Inter, Satoshi |

---

## Research

| Resource | Purpose |
|---|---|
| `design-system.md` | Full typography spec (families, weights, sizes, line heights) |
| `src/app/globals.css` | Where `--font-brand`, `--font-body`, `--font-data` tokens are declared |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-02-26 | user-selected-lines-users-shivpat | Modified files: design-system/MASTER.md, src/app/globals.css · Meta-Rewrite - What is the user actually asking for? · Shall I proceed with the implementation as described above? · Agent (claude-sonnet-4-6 2026-02-27 01:44:13Z) Now replace all Sonata tokens with Nocturne tokens across the copied frame. · Command executed: ls /Users/shivpat/harmony-forge-redesign/ && cat /Users/shivpat/harmony-forge-redesign/tsconfig.json | [history](.specstory/history/2026-02-26_17-31-03Z.md) | <!-- a29d2b69-75b7-4c27-846d-1905f28d8b0b -->
| 2026-03-02 | after-every-correction,-want-update | Modified files: .claude/projects/-Users-shivpat-harmony-forge-redesign/memory/MEMORY.md, .claude/plans/bubbly-sniffing-tiger.md, notes/journey.md (+3 more) · List the top-level directory structure of /Users/shivpat/harmony-forge-redesign (ls one level deep) 5. · Top-level Directory Structure of /Users/shivpat/harmony-forge-redesign CLAUDE. · The project enforces Intrinsic Determinism for music theory and has established rules for ui-ux-pro-max suggestions (never auto-apply colors, safe to adopt UX patterns directly). · Meta-rewrite Superman is asking for intellectual friction as a feature — a check against confirmation bias and rash decisions. | [history](.specstory/history/2026-03-02_03-14-15Z-explore-the-following-in.md) | <!-- bfe3c57b-bee8-485c-9087-fd9ae6e7be5d -->
| 2026-03-02 | https:-www.noteflight.com-home-based-note | Task: Restructure all 3 rows into a group-container architecture: · Modified files: src/app/globals.css, src/types/palette.types.ts, src/stores/useScorePaletteStore.ts (+26 more) · Constraint enforced: Nocturne tokens only — #3a2320 toolbar, #4a2f2b separator, #ffb300 labels, #b0a090 icons · Constraint enforced: 8px grid: gap-8 within group frames; gap-20 between group frames; padding-24 edges · Agent (claude-sonnet-4-6 2026-03-02 16:53:36Z) Agent - sidechain (2026-03-02 16:52:39Z) Explore the HarmonyForge project at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-02_16-52-22Z-explore-the-harmonyforge-project.md) | <!-- 1be60351-96c3-4b52-9672-9cfd4a40142f -->
| 2026-03-02 | node-id:-ddqqm-all-notes | Task: Replace $sonata-accent on all 8 label nodes with $sonata-surface (Cherry Wood #9E4B3E), · Modified files: .claude/plans/logical-twirling-newt.md · Constraint enforced: Design system tokens only — no ad-hoc hex values · Constraint enforced: $sonata-detail (#D2B48C Tan Birch) is too light at ~1.8:1 — rules out · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-02_21-45-46Z.md) | <!-- 25e0bd9d-70c5-44d0-92d6-6c9c9460105a -->
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-02-25 | continue-these-tasks-instad-were | User request: Continue these tasks instad that were left off by Claude: I want the progress indicator to go on the bottom of the page in the form of a floating dock | [history](.specstory/history/2026-02-25_17-37-57Z-continue-these-tasks-instad.md) | <!-- ad59da04-4d83-4df3-b9f9-a5d8aa03e8ef -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | HarmonyForge is a Glass Box co-creative SATB music arrangement tool — "ante-hoc" meaning the theory explanations are surfaced before or as the user makes decisions, not after. | [history](.specstory/history/2026-03-10_08-57-50Z-you-are-a-context.md) | <!-- dc41960f-0218-4899-a95e-dd75a72f8d61 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: .claude/projects/-Users-shivpat-harmony-forge-redesign/memory/MEMORY.md, .claude/plans/bubbly-sniffing-tiger.md, notes/journey.md (+3 more) · List the top-level directory structure of /Users/shivpat/harmony-forge-redesign (ls one level deep) 5. · Top-level Directory Structure of /Users/shivpat/harmony-forge-redesign CLAUDE. · The project enforces Intrinsic Determinism for music theory and has established rules for ui-ux-pro-max suggestions (never auto-apply colors, safe to adopt UX patterns directly). | [history](.specstory/history/2026-03-10_08-58-00Z-you-are-a-context.md) | <!-- 116d691f-72b3-4386-bc8f-3e85c4d98ad0 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-02 16:53:36Z) Agent - sidechain (2026-03-02 16:52:39Z) Explore the HarmonyForge project at /Users/shivpat/harmony-forge-redesign. · Any existing icon library being used (lucide-react, heroicons, react-icons, phosphor, etc. · Agent (claude-sonnet-4-6 2026-03-02 16:52:58Z) Agent - sidechain (2026-03-02 16:52:41Z) Explore the design system files in /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-09Z-you-are-a-context.md) | <!-- 9756dfad-e30a-4888-b1ed-90d0d65442e0 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: .claude/plans/logical-twirling-newt.md | [history](.specstory/history/2026-03-10_08-58-12Z-you-are-a-context.md) | <!-- 9948233e-01aa-415c-8b2c-7f5a048dcd58 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
