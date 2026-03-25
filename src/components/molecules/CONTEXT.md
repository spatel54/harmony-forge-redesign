# CONTEXT.md — src/components/molecules/

*Compounds of atoms serving a single user task. Molecules may read from Zustand but do not own store slices. No VexFlow DOM manipulation here.*

---

## Ontology

| Term | Definition |
|---|---|
| **Molecule** | A focused compound component — one user task, composed from atoms |
| **PlaybackBar** | The transport controls molecule: play/pause, position scrubber |
| **ViolationCard** | Renders a single Red Line violation — label, voices, definition |
| **StepBar** | 3-step workflow navigator: Playground → Document → Sandbox |
| **VoiceDropdown** | Voice/part selector dropdown |
| **QuickReplyChips** | Suggested reply chips for the Theory Inspector chat interface |

---

## Decisions

- **`SandboxPlaybackBar` is wired** (TASK-A23 ✅): reads `isPlaying` from `useSandboxStore`; calls `play()`/`pause()`/`stop()` from `usePlayback`; `aria-label="Play arrangement"/"Pause arrangement"` + `aria-pressed`
- **`ScorePaginationDock` created** (TASK-A25 ✅): floating bottom-center pill; ArrowLeft/Right global keydown; `aria-live="polite"` on counter; `aria-disabled` at boundaries
- **`ViolationCard` is sidebar-only**: inline `RedLineTooltip` is TASK-A24 (blocked on backend JSON)
- **`StepBar` is top-anchored workflow nav**: distinct from `ScorePaginationDock`

---

## Patterns

- Molecules read Zustand state via selector hooks: `const isPlaying = useSandboxStore(s => s.isPlaying)`
- Molecules dispatch actions via callbacks passed as props or via direct store action calls
- Violation data shape expected from backend: `{ measure: number, beat: number, voices: [string, string], ruleLabel: string, definition: string }`

---

## Policies

- **No VexFlow imports** — molecules do not touch the score canvas DOM
- **No Tone.js `AudioContext`** — playback molecules dispatch symbolic events to the scheduler hook only
- **No violation detection** — `ViolationCard` renders backend JSON; it never derives violations from note data
- **No hardcoded hex values** — Nocturne/Sonata tokens only

---

## Files

| File | Purpose | Spec AC |
|---|---|---|
| `PlaybackBar.tsx` | Document-page re-upload bar (different from sandbox playback) | — |
| `SandboxPlaybackBar.tsx` | Sandbox transport controls — wired to `usePlayback` + `useSandboxStore` | AC-002 ✅ |
| `ScorePaginationDock.tsx` | Floating pagination pill — ArrowLeft/Right keyboard, aria-live | AC-005 ✅ |
| `ViolationCard.tsx` | Sidebar violation display (147 lines) | AC-003 |
| `StepBar.tsx` | Workflow step navigator (top-anchored) | AC-005 |
| `VoiceDropdown.tsx` | Voice/part selector | — |
| `QuickReplyChips.tsx` | Theory Inspector suggested replies | — |
| `ChatBubble.tsx` | Theory Inspector chat message bubble | — |
| `DevNav.tsx` | Development navigation utility | — |
| `EnsemblePreviewCard.tsx` | Ensemble preview card | — |
| `ExportOptionsPane.tsx` | Export options panel | — |
| `MusicStand.tsx` | Decorative music stand molecule | — |
| `PaletteToolGroup.tsx` | Score palette tool group | — |
| `ScorePreviewPane.tsx` | Small score preview | — |
| `UploadPromptContent.tsx` | Upload prompt copy | — |

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-002 (playback wiring), AC-003 (violation sidebar), AC-005 (dock vs StepBar) |
| `src/store/useSandboxStore.ts` | `isPlaying` + `playheadPosition` + `isExpanded` — all present ✅ |
| `src/lib/audio/usePlayback.ts` | Tone.js Transport hook — `play()`, `pause()`, `stop()` |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-04 | want-export-these-designs-code | Task: Explain the reliable design-to-code export process — tools, workflow order, and · Modified files: src/app/globals.css, src/app/layout.ts, src/app/page.ts (+4 more) · Constraint enforced: Must stay within the existing stack: Next.js App Router, TypeScript, Tailwind v4 · Constraint enforced: Design tokens in the .pen file map to CSS custom properties in globals.css · Agent (claude-sonnet-4-6 2026-03-04 05:21:51Z) The user approved "Start with globals. | [history](.specstory/history/2026-03-04_05-17-28Z-your-task-is-to.md) | <!-- d39e462f-c089-45ef-83ee-296da1b0ddc0 -->
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-06 | list-all-files-components-directory | User request: list all files in components directory --- | [history](.specstory/history/2026-03-06_16-49-24Z-list-all-files-in.md) | <!-- 916f654b-77ad-4233-86c1-f9d0765bd229 -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
