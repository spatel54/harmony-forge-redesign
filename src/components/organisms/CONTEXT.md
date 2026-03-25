# CONTEXT.md — src/components/organisms/

*Full UI sections. Organisms own layout, may own store reads, and compose molecules and atoms. VexFlow DOM manipulation belongs here and only here.*

---

## Ontology

| Term | Definition |
|---|---|
| **Organism** | A complete, self-contained UI section — the score canvas, the inspector panel, the header |
| **ScoreCanvas** | The VexFlow rendering container — currently 363 lines of static React/Tailwind (not VexFlow-driven) |
| **TheoryInspectorPanel** | The collapsible sidebar — LLM Glass Box reasoning, Red Line violations, voice part analysis |
| **SandboxHeader** | Top bar — theme toggle, export button, maximize button, piece title |
| **SandboxContextMenu** | Right-click menu on the score canvas — sourced from `useSandboxStore` |
| **EnsembleBuilderPanel** | Panel for selecting and configuring the SATB voice ensemble |
| **ScorePalette** | Toolbar for note input and editing tools |
| **Renderer** | VexFlow's `Renderer` class — creates the SVG/canvas element inside `useEffect` |
| **Stave** | VexFlow's `Stave` class — represents one staff line (one voice) |
| **Voice** | VexFlow's `Voice` class — holds the notes for a single SATB part |
| **Formatter** | VexFlow's `Formatter` class — handles note layout and horizontal spacing |

---

## Decisions

- **`ScoreCanvas` is VexFlow-driven** (TASK-A19/A20/A21 ✅): dynamic `import('vexflow')` inside `useEffect`, ResizeObserver for responsive re-render, reads from `useScoreStore`, `subscribeWithSelector`. ADR-009 documents this decision.
- **VexFlow only in `ScoreCanvas`**: No other organism, molecule, or atom may import VexFlow
- **Theory Inspector receives backend JSON**: The panel never computes violations — it renders structured `{ measure, beat, voices, ruleLabel, definition }` from the API

---

## Patterns

- VexFlow setup inside `useEffect` with a stable `ref`:
  ```tsx
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!containerRef.current) return;
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    // ... stave + voice + formatter setup
  }, [scoreState]);
  ```
- `ScoreCanvas` wrapper must have `role="img"` and `aria-label="SATB score: [piece name]"` (AC-001)
- `RedLineTooltip` attaches inline at VexFlow note coordinates — uses `aria-describedby` for keyboard accessibility (AC-003)

---

## Policies

- **VexFlow DOM manipulation inside `useEffect` only** — never in render, never in event handlers
- **No constraint logic** — `ScoreCanvas` renders what Zustand `ScoreState` contains; it never validates notes
- **No hardcoded pixel coordinates in the VexFlow migration** — all positions derived from VexFlow layout engine
- **No Theory Inspector sidebar logic in `ScoreCanvas`** — the two organisms are independent

---

## Files

| File | Purpose | Spec AC | Status |
|---|---|---|---|
| `ScoreCanvas.tsx` | VexFlow score renderer — dynamic import, ResizeObserver, reads `useScoreStore` | AC-001 | ✅ complete |
| `DocumentView.tsx` | Client component extracted from document/page.tsx; redirect guard, `useUploadStore` | — | ✅ TASK-A17 |
| `TheoryInspectorPanel.tsx` | Theory Inspector sidebar | AC-003 | `[~]` partial |
| `SandboxHeader.tsx` | Sandbox top bar | AC-006 | `[~]` partial |
| `SandboxContextMenu.tsx` | Right-click context menu | — | exists |
| `EnsembleBuilderPanel.tsx` | Voice ensemble configuration | — | exists |
| `ExportModal.tsx` | Export dialog | — | exists |
| `PlaygroundBackground.tsx` | Landing playground background | — | exists |
| `ScoreDropzone.tsx` | MusicXML upload dropzone | — | exists |
| `ScorePalette.tsx` | Note input toolbar | — | exists |
| `ScorePreviewPanel.tsx` | Score thumbnail preview | — | exists |
| `TransitionOverlay.tsx` | Page transition overlay | — | exists |
| `DocumentHeader.tsx` | Document route header | — | exists |
| `DropzoneCopy.tsx` | Dropzone instructional copy | — | exists |

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-001 (VexFlow migration), AC-003 (RedLineTooltip), AC-006 (maximize) |
| VexFlow API docs | `Renderer`, `Stave`, `Voice`, `Formatter`, `StaveNote` |
| `.claude/rules/music-theory.md` | SATB voice ranges for VexFlow stave positioning |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-04 | want-export-these-designs-code | Task: Explain the reliable design-to-code export process — tools, workflow order, and · Modified files: src/app/globals.css, src/app/layout.ts, src/app/page.ts (+4 more) · Constraint enforced: Must stay within the existing stack: Next.js App Router, TypeScript, Tailwind v4 · Constraint enforced: Design tokens in the .pen file map to CSS custom properties in globals.css · Agent (claude-sonnet-4-6 2026-03-04 05:21:51Z) The user approved "Start with globals. | [history](.specstory/history/2026-03-04_05-17-28Z-your-task-is-to.md) | <!-- d39e462f-c089-45ef-83ee-296da1b0ddc0 -->
| 2026-03-04 | tool-result-get-variables-calling | User request: Tool result of get variables . Calling get variables is not necessary anymore. {"variables":{"nocturne-accent":{"type":"color","value":" FFB300"},"noc | [history](.specstory/history/2026-03-04_05-38-01Z.md) | <!-- 890c1710-5dad-474c-9fe9-d8e35509b298 -->
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-06 | list-all-files-components-directory | User request: list all files in components directory --- | [history](.specstory/history/2026-03-06_16-49-24Z-list-all-files-in.md) | <!-- 916f654b-77ad-4233-86c1-f9d0765bd229 -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | User request: You are a context distiller for the HarmonyForge project (Next.js, TypeScript, VexFlow, Tone.js, Zustand). Read the session transcript below. Return a | [history](.specstory/history/2026-03-10_08-58-28Z-you-are-a-context.md) | <!-- e70d8e0d-407d-4693-a9aa-792d447f213a -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
