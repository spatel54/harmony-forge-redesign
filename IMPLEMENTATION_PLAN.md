# Implementation Plan

_(This file is generated and maintained by the agent. Do not edit manually during an active loop run.)_

**How to populate:** Run `PROMPT_plan.md` via the Claude CLI or paste it into a planning session. The agent will perform a gap analysis against `specs/` and populate this file with a prioritized task list. Each task includes explicit acceptance criteria derived from the spec.

**How to use:** The `loop.sh` build loop reads this file each iteration. The agent picks the single highest-priority uncompleted task, implements it, validates it (per `AGENTS.md`), marks it complete, and commits.

---

## Status Key

- `[ ]` — Not started
- `[~]` — In progress (current loop iteration)
- `[x]` — Complete (tests + lint + build passing)
- `[!]` — Blocked (reason noted inline)

---

## Backpressure (Every Commit)

```bash
npx tsc --noEmit && npm run build
```

Both must pass before any task is marked `[x]` and committed.

---

## Tasks

### Phase 2A — Zustand Foundation (no dependencies)

- [x] [TASK-A01] Create UploadState Zustand slice (filename, fileType, fileValid)
  - **Acceptance:** `src/store/useUploadStore.ts` typed slice with `setUploadedFile` action; persists into sessionStorage so /document access without upload redirects.
  - **Files:** `src/store/useUploadStore.ts` (new)
  - **Constraint:** no `any` types; typed interface per `typescript-patterns.md`
  - **Spec:** [spec:002 AC-002] [spec:003 AC-002 AC-004]
  - **Test:** `npx tsc --noEmit`

- [x] [TASK-A02] Create EnsembleState Zustand slice (voices: Voice[], setVoice) [ADR-NEEDED]
  - **Acceptance:** `src/store/useEnsembleStore.ts` typed slice; 4 SATB voice slots; selection persists into /sandbox (not URL params).
  - **Files:** `src/store/useEnsembleStore.ts` (new)
  - **Constraint:** no `any` types; [ADR-NEEDED] — document EnsembleState shape in ADR-008
  - **Spec:** [spec:002 AC-003]
  - **Test:** `npx tsc --noEmit`

- [x] [TASK-A03] Add isPlaying + playheadPosition to useSandboxStore
  - **Acceptance:** `useSandboxStore` exposes `isPlaying: boolean`, `playheadPosition: number`, `setPlaying(v: boolean)`, `setPlayhead(pos: number)` actions.
  - **Files:** `src/store/useSandboxStore.ts` (modify)
  - **Constraint:** typed; no `any`; preserve contextMenu slice
  - **Spec:** [spec:001 AC-002]
  - **Test:** `npx tsc --noEmit`

---

### Phase 2B — Landing Page (spec 002) [depends: A01, A02]

- [x] [TASK-A04] Wire DropzoneCopy to store uploaded file in useUploadStore on file select
  - **Acceptance:** `page.tsx` `handleFileUpload` calls `useUploadStore.setUploadedFile({name, type})`; DropzoneCopy `accept=".pdf,.xml,.mxl,.midi,.mid"` already present — verify it.
  - **Files:** `src/app/page.tsx` (modify)
  - **Constraint:** file stored symbolically (name + type only — no raw binary in state)
  - **Spec:** [spec:002 AC-002]
  - **Test:** `npx tsc --noEmit` + manual: upload a .pdf, check store.filename populated

- [x] [TASK-A05] Add invalid file type error state to DropzoneCopy
  - **Acceptance:** if dropped/selected file extension not in allowed list, show inline error message using Nocturne/Sonata token colors (no raw hex); error text: "Unsupported file type. Please upload MusicXML, MIDI, or PDF."
  - **Files:** `src/components/organisms/DropzoneCopy.tsx` (modify)
  - **Constraint:** token-compliant error color (`--color-violation-red` or equivalent token); error state announced via `aria-live="polite"`
  - **Spec:** [spec:002 AC-002]
  - **Test:** `npx tsc --noEmit` + manual: drop .mp3 → error appears

- [x] [TASK-A06] Wire EnsembleBuilderPanel to useEnsembleStore
  - **Acceptance:** `EnsembleBuilderPanel` reads/writes voice selections from `useEnsembleStore` instead of local `useState`; selections survive navigation to /sandbox.
  - **Files:** `src/components/organisms/EnsembleBuilderPanel.tsx` (modify)
  - **Constraint:** no prop-drilling the store; `useEnsembleStore` imported directly in organism
  - **Spec:** [spec:002 AC-003]
  - **Test:** `npx tsc --noEmit` + manual: select instruments, navigate to /sandbox, verify store

- [x] [TASK-A07] Make pending StepBar steps non-interactive
  - **Acceptance:** steps with `n > currentStep` have `pointer-events-none` + `aria-disabled="true"`; cannot be clicked or focused in pending state.
  - **Files:** `src/components/molecules/StepBar.tsx` (modify)
  - **Constraint:** POUR — still render step labels (visible), just not interactive
  - **Spec:** [spec:002 AC-005]
  - **Test:** `npx tsc --noEmit` + keyboard: Tab through StepBar on step 1 → step 3 not reachable

- [x] [TASK-A08] Add page `<title>` for landing page
  - **Acceptance:** `<title>` is "HarmonyForge — Upload Your Score" on the / route.
  - **Files:** `src/app/page.tsx` or `src/app/layout.tsx` (add Next.js metadata export)
  - **Constraint:** use Next.js App Router metadata API (`export const metadata`)
  - **Spec:** [spec:002 AC-006]
  - **Test:** `npm run build` — verify `<title>` in built HTML

- [x] [TASK-A09] Add prefers-reduced-motion guard to PlaygroundBackground animation
  - **Acceptance:** any CSS animation or transition in `PlaygroundBackground` is wrapped in `@media (prefers-reduced-motion: no-preference)` or disabled via hook; static fallback renders without animation.
  - **Files:** `src/components/organisms/PlaygroundBackground.tsx` (modify)
  - **Constraint:** Tailwind `motion-safe:` prefix or CSS media query — no JS-only solution
  - **Spec:** [spec:002 AC-001]
  - **Test:** `npx tsc --noEmit` + browser: OS reduced motion → no animation

- [x] [TASK-A10] Add alt text to LogoLockup image
  - **Acceptance:** logo `<img>` or SVG has `alt="HarmonyForge — Glass Box SATB Arrangement"`
  - **Files:** `src/components/atoms/LogoLockup.tsx` (modify)
  - **Constraint:** alt text must be present even if logo is SVG (`aria-label` fallback)
  - **Spec:** [spec:002 AC-001]
  - **Test:** `npx tsc --noEmit` + axe audit on / route

---

### Phase 2C — Document Page (spec 003) [depends: A01]

- [x] [TASK-A11] Add back navigation button to DocumentHeader
  - **Acceptance:** back button left of LogoLockup calls `router.push('/')`; `aria-label="Back to upload"`; focus-visible ring uses token.
  - **Files:** `src/components/organisms/DocumentHeader.tsx` (modify)
  - **Constraint:** POUR; `aria-label` verbatim from spec; token focus ring
  - **Spec:** [spec:003 AC-001]
  - **Test:** `npx tsc --noEmit` + keyboard: press back button → / route

- [x] [TASK-A12] Render piece title in Instrument Serif from useUploadStore
  - **Acceptance:** `document/page.tsx` or `ScorePreviewPanel` renders piece title (from `useUploadStore.filename`, stripped of extension) in `font-brand` (Instrument Serif token) — not Inter.
  - **Files:** `src/app/document/page.tsx` or `src/components/organisms/ScorePreviewPanel.tsx`
  - **Constraint:** `font-brand` Tailwind class only — no ad-hoc `font-family` inline style
  - **Spec:** [spec:003 AC-001]
  - **Test:** `npx tsc --noEmit` + visual: title in Instrument Serif

- [x] [TASK-A13] Add role="img" + aria-label to ScorePreviewPanel
  - **Acceptance:** preview container has `role="img"` `aria-label="Score preview: [piece title]"` where [piece title] is dynamic from `useUploadStore`.
  - **Files:** `src/components/organisms/ScorePreviewPanel.tsx` (modify)
  - **Constraint:** `aria-label` must be dynamic — no hardcoded string
  - **Spec:** [spec:003 AC-002]
  - **Test:** `npx tsc --noEmit` + axe audit on /document

- [x] [TASK-A14] Add redirect guard to document/page.tsx
  - **Acceptance:** on mount, if `useUploadStore.filename` is null/empty, call `router.push('/')`; no empty panel renders.
  - **Files:** `src/app/document/page.tsx` (modify)
  - **Constraint:** guard runs in `useEffect` (client-side) — no SSR redirect
  - **Spec:** [spec:003 AC-002]
  - **Test:** `npx tsc --noEmit` + manual: navigate to /document directly → redirects to /

- [ ] [TASK-A15] Show uploaded filename + "Change file" link in DropzoneCopy context on doc page
  - **Acceptance:** on /document, `UploadPromptContent` or a sibling component shows "Reviewing: [filename]" copy; "Change file" link calls `router.push('/')`.
  - **Files:** `src/components/molecules/UploadPromptContent.tsx` or `DropzoneCopy.tsx`
  - **Constraint:** contextual only on /document (accept an optional prop or use store)
  - **Spec:** [spec:003 AC-003]
  - **Test:** `npx tsc --noEmit` + manual: upload file → /document shows filename

- [ ] [TASK-A16] Wire "Generate Harmonies" button with aria-disabled guard
  - **Acceptance:** "Generate Harmonies" stays as-is (correct CTA); add `aria-label="Generate harmonies and open score in Sandbox"`; button is `aria-disabled="true"` + `pointer-events-none` when no valid file in `useUploadStore` — never `disabled` attribute alone (keyboard focus preserved).
  - **Files:** `src/components/organisms/EnsembleBuilderPanel.tsx` (modify)
  - **Constraint:** POUR — `aria-disabled="true"` + `pointer-events-none`; never `disabled` attr alone
  - **Spec:** [spec:003 AC-004]
  - **Test:** `npx tsc --noEmit` + keyboard: Tab to button when no file → focus present, aria-disabled

- [ ] [TASK-A17] Add page `<title>` for document page
  - **Acceptance:** `<title>` is "HarmonyForge — Review Your Score" on /document.
  - **Files:** `src/app/document/page.tsx` (add metadata export)
  - **Constraint:** Next.js App Router metadata API
  - **Spec:** [spec:003 AC-005]
  - **Test:** `npm run build` — verify `<title>` in built HTML

---

### Phase 2D — Accessibility Cross-Cut (specs 001–003)

- [ ] [TASK-A18] Fix ThemeToggle aria-label + aria-pressed
  - **Acceptance:** `aria-label` toggles between "Switch to dark mode" / "Switch to light mode" (not "Toggle Theme"); `aria-pressed={isDark}` added.
  - **Files:** `src/components/atoms/ThemeToggle.tsx` (modify)
  - **Constraint:** aria changes only — hex replacement is TASK-A18b
  - **Spec:** [spec:001 AC-004] [spec:002 AC-004]
  - **Test:** `npx tsc --noEmit` + axe: `aria-pressed` updates on toggle

- [ ] [TASK-A18b] Replace ThemeToggle ad-hoc hex values with Nocturne/Sonata tokens
  - **Acceptance:** all 6 hex values replaced with CSS variable tokens from globals.css: `#2D1817` → `var(--nocturne-bg)` or equivalent dark-bg token; `#A55B3766` → `var(--nocturne-detail)` with opacity; `#C8B8B6` → `var(--sonata-detail)` or equivalent muted light token; `#D2B48C` → `var(--sonata-detail)`; `#FFB300` → `var(--hf-accent)`; `#1A1110` / `#4A3B39` → `var(--hf-text-primary)` per theme. Implementation must read globals.css to confirm exact token names.
  - **Files:** `src/components/atoms/ThemeToggle.tsx` (modify)
  - **Constraint:** zero ad-hoc hex values remain after this task
  - **Spec:** [spec:001 AC-004] [spec:002 AC-004]
  - **Test:** `npx tsc --noEmit` + visual: toggle renders correctly in Nocturne + Sonata

---

### Phase 2E — Sandbox Core (spec 001) [depends: A03]

- [ ] [TASK-A19] VexFlow Stave rendering — replace static HTML staves with VexFlow [ADR-NEEDED]
  - **Acceptance:** `ScoreCanvas` `useEffect` renders 4 SATB staves via VexFlow `Renderer` + `Stave`; static absolute-px HTML removed; canvas fills available width responsively; `role="img"` `aria-label="SATB score: [piece name]"` on wrapper.
  - **Files:** `src/components/organisms/ScoreCanvas.tsx` (major modify)
  - **Constraint:** VexFlow DOM manipulation inside `useEffect` only; [ADR-NEEDED] — document VexFlow integration approach in ADR-009
  - **Spec:** [spec:001 AC-001]
  - **Test:** `npx tsc --noEmit` + `npm run build` + visual: staves render at 1440px and 768px

- [ ] [TASK-A20] VexFlow dynamic note rendering from static note data [depends: A19]
  - **Acceptance:** `ScoreCanvas` reads hardcoded note data structure (placeholder before A21) and renders notes via VexFlow `Voice` + `Formatter` + `Beam`.
  - **Files:** `src/components/organisms/ScoreCanvas.tsx` (modify)
  - **Constraint:** VexFlow `Note` objects only — no raw SVG/HTML note elements
  - **Spec:** [spec:001 AC-001]
  - **Test:** `npx tsc --noEmit` + visual: 4 voices with notes visible on staves

- [ ] [TASK-A21] Create ScoreState Zustand slice + wire ScoreCanvas [depends: A19, A20]
  - **Acceptance:** `useScoreStore` holds `notes[]`, `durations[]`, `beamGroups[]`; `ScoreCanvas` reads from `useScoreStore` not hardcoded data.
  - **Files:** `src/store/useScoreStore.ts` (new); `src/components/organisms/ScoreCanvas.tsx`
  - **Constraint:** typed interfaces; VexFlow receives symbolic data only
  - **Spec:** [spec:001 AC-001]
  - **Test:** `npx tsc --noEmit`

- [ ] [TASK-A22] Implement usePlayback hook (Tone.js symbolic dispatch) [depends: A03]
  - **Acceptance:** `usePlayback` schedules symbolic note events via Tone.js `Part`/`Transport`; no `AudioContext` or raw buffer; `play()` / `pause()` / `stop()` actions; updates `useSandboxStore.isPlaying` + `playheadPosition`.
  - **Files:** `src/lib/audio/usePlayback.ts` (new or modify existing)
  - **Constraint:** Tone.js symbolic events ONLY — no `AudioContext`, no raw buffer
  - **Spec:** [spec:001 AC-002]
  - **Test:** `npx tsc --noEmit` + manual: play → Tone.js Transport starts

- [ ] [TASK-A23] Wire SandboxPlaybackBar to usePlayback + aria attributes [depends: A03, A22]
  - **Acceptance:** `SandboxPlaybackBar` play/pause button reads `isPlaying` from store; dispatches `play()`/`pause()` from `usePlayback`; `aria-label="Play arrangement"` (or "Pause arrangement"); `aria-pressed={isPlaying}`.
  - **Files:** `src/components/molecules/SandboxPlaybackBar.tsx` (modify)
  - **Constraint:** POUR; `aria-label` + `aria-pressed` verbatim from spec
  - **Spec:** [spec:001 AC-002]
  - **Test:** `npx tsc --noEmit` + axe: `aria-pressed` updates on click

- [!] [TASK-A24] RedLineTooltip component + violation coordinate hook [BLOCKED: backend JSON TBD]
  - **Acceptance:** `RedLineTooltip` renders inline at violation measure/beat coordinates; data sourced from backend JSON `{ measure, beat, voices, ruleLabel, definition }`; keyboard-accessible (focus-visible, aria-describedby); indicator uses `--color-violation-red` token (no raw hex).
  - **Files:** `src/components/atoms/RedLineTooltip.tsx` (new); `src/lib/theory/useViolationOverlay.ts` (new — maps JSON to VexFlow coords)
  - **Constraint:** [BLOCKED] requires backend violation JSON delivery; coordinate mapping depends on VexFlow Renderer ref from A19
  - **Spec:** [spec:001 AC-003]
  - **Test:** `npx tsc --noEmit` + visual: tooltip appears on mock violation JSON

- [ ] [TASK-A25] ScorePaginationDock — floating Apple-style bottom dock
  - **Acceptance:** new floating component bottom-anchored in sandbox layout; displays current page / total pages within active score; left/right arrow keys advance pages; does not overlap canvas ≥ 600px; Nocturne/Sonata token-compliant pill shape.
  - **Files:** `src/components/molecules/ScorePaginationDock.tsx` (new)
  - **Constraint:** floating (`position: fixed` or absolute within scroll container); keyboard: `ArrowLeft`/`ArrowRight`; POUR focus-visible
  - **Spec:** [spec:001 AC-005]
  - **Test:** `npx tsc --noEmit` + keyboard: ArrowLeft/Right advances page counter

- [ ] [TASK-A26] Score Maximize — expand button + isExpanded state + Escape key
  - **Acceptance:** expand button in `SandboxHeader` toggles full-screen canvas mode; `aria-label="Expand score"` / `"Collapse score"` (toggled); all other UI panels hidden in expanded state; Escape key collapses expanded state.
  - **Files:** `src/components/organisms/SandboxHeader.tsx` (modify); `src/store/useSandboxStore.ts` (add `isExpanded`, `setExpanded`)
  - **Constraint:** POUR; Escape handled via `useEffect` keydown listener
  - **Spec:** [spec:001 AC-006]
  - **Test:** `npx tsc --noEmit` + keyboard: Escape collapses; `aria-label` toggles

---

### Phase 3/4 Deferrals

- [ ] [TASK-A27] TheoryTagList component (Phase 3 — defer)
  - **Acceptance:** Theory-Named tags (Strophic, Homophonic, SATB, Common Meter, Hymnody) rendered beneath score title; each anchored to academic definition.
  - **Spec:** [spec:001 AC-007]

- [ ] [TASK-A28] Hover/focus state audit — all sandbox interactive elements (Phase 4)
  - **Acceptance:** all elements have explicit `hover:` + `focus-visible:` Tailwind classes; no interactive element is hover-state-less.
  - **Spec:** [spec:001 AC-008]

---

## ADRs to Draft After Implementation

| ADR | Trigger Task | Decision Area |
|---|---|---|
| ADR-008 | TASK-A02 | EnsembleState shape — Zustand slice design |
| ADR-009 | TASK-A19 | VexFlow integration approach — useEffect ref pattern |
