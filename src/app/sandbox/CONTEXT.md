# CONTEXT.md — src/app/sandbox/

*The Tactile Sandbox route (`/sandbox`). This is the primary user-facing screen: VexFlow score canvas, Tone.js symbolic playback, Theory Inspector sidebar, and inline Red Line violation tooltips.*

---

## Ontology

| Term | Definition |
|---|---|
| **Tactile Sandbox** | The full editing experience — compose, play back, and inspect a symbolic SATB arrangement |
| **Score Canvas** | The VexFlow-rendered area displaying all four SATB voices as a readable score |
| **Playhead** | The position marker that advances across the score during playback |
| **Theory Inspector** | The collapsible sidebar that displays Glass Box reasoning and Red Line violation details |
| **Red Line** | An inline visual annotation on the score canvas marking a voice-leading violation |
| **Context Menu** | The right-click menu on the score canvas (managed by `useSandboxStore`) |

---

## Decisions

- **Sandbox is its own route segment** — isolated from `/document` so score editing state does not persist across navigation
- **Organisms compose the page** — `page.tsx` assembles `SandboxHeader`, `ScoreCanvas`, `TheoryInspectorPanel`; no inline UI logic
- **isExpanded collapses all panels** (TASK-A26 ✅): when `useSandboxStore.isExpanded=true`, ScorePalette, SandboxPlaybackBar, and TheoryInspectorPanel are hidden — ScoreCanvas fills the full column
- **Escape key exits expand mode**: `useEffect` keydown listener in `page.tsx` calls `setExpanded(false)` on Escape; skips INPUT/TEXTAREA targets
- **ScorePaginationDock** (TASK-A25 ✅): floating bottom-center pill inside the canvas wrapper; ArrowLeft/Right keyboard navigation via global keydown listener

---

## Patterns

- `page.tsx` imports and composes organisms only:
  ```tsx
  import { SandboxHeader } from "@/components/organisms/SandboxHeader";
  import { ScoreCanvas } from "@/components/organisms/ScoreCanvas";
  import { TheoryInspectorPanel } from "@/components/organisms/TheoryInspectorPanel";
  ```
- Store reads happen inside organism components, not in `page.tsx`
- Right-click context menu is managed via `useSandboxStore.openContextMenu` / `closeContextMenu`

---

## Policies

- **No VexFlow or Tone.js imports in `page.tsx`** — those live in `ScoreCanvas` and `usePlayback`
- **No violation detection in this route** — violations arrive as backend JSON; this route only renders them
- **No MusicXML parsing in this route** — parsing happens in `src/lib/music/`

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | All ACs for this route (AC-001 through AC-008) |
| `src/components/organisms/ScoreCanvas.tsx` | Primary VexFlow rendering component (363 lines, currently static) |
| `src/components/organisms/TheoryInspectorPanel.tsx` | Theory Inspector sidebar |
| `src/components/organisms/SandboxHeader.tsx` | Header with theme toggle, export, maximize |
| `src/store/useSandboxStore.ts` | Context menu + `isPlaying` + `playheadPosition` + `isExpanded` + `setExpanded` — ✅ complete |
| `src/lib/audio/usePlayback.ts` | Tone.js Transport hook: `play()`, `pause()`, `stop()` — ✅ TASK-A22 |
| `src/components/molecules/ScorePaginationDock.tsx` | Floating page counter with ArrowLeft/Right keyboard nav — ✅ TASK-A25 |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-04 | want-export-these-designs-code | Task: Explain the reliable design-to-code export process — tools, workflow order, and · Modified files: src/app/globals.css, src/app/layout.ts, src/app/page.ts (+4 more) · Constraint enforced: Must stay within the existing stack: Next.js App Router, TypeScript, Tailwind v4 · Constraint enforced: Design tokens in the .pen file map to CSS custom properties in globals.css · Agent (claude-sonnet-4-6 2026-03-04 05:21:51Z) The user approved "Start with globals. | [history](.specstory/history/2026-03-04_05-17-28Z-your-task-is-to.md) | <!-- d39e462f-c089-45ef-83ee-296da1b0ddc0 -->
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/components/atoms/ModalOverlay.ts, src/components/atoms/ExportOptionCard.ts, src/components/atoms/ExportSectionHeader.ts (+15 more) · Agent (claude-sonnet-4-6 2026-03-04 11:32:37Z) Agent - sidechain (2026-03-04 11:31:28Z) Explore the project at /Users/shivpat/harmony-forge-redesign. · The system is ready for Phase 2 implementation. | [history](.specstory/history/2026-03-04_11-31-11Z-explore-the-project-at.md) | <!-- 23f49955-3311-427e-9634-8498c7355976 -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:32:37Z) Agent - sidechain (2026-03-04 11:31:28Z) Explore the project at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-47Z-you-are-a-context.md) | <!-- 286aad38-3b01-410a-9b48-f2c1e806f67f -->
