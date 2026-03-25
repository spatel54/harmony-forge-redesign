# Spec 001: SATB Tactile Sandbox — Arrangement Screen

**Source:** PLAN.md Phases 2–4, CLAUDE.md Architecture Boundaries
**Status:** Active — Phase 2 in progress
**Last updated:** 2026-03-09

---

## Status Key

- `[x]` — Done and compliant
- `[~]` — Partially implemented (gaps noted inline)
- `[ ]` — Not started
- `[!]` — Exists but violates a constraint (must fix before shipping)

---

## Job to Be Done (JTBD)

A composer opens HarmonyForge and sees a score canvas. They can:

1. Read a symbolic SATB score rendered in VexFlow
2. Play back the arrangement symbolically via Tone.js
3. See inline Red Line violation annotations on the canvas
4. Toggle between Nocturne (dark) and Sonata (light) themes
5. Navigate score pages via a floating bottom dock (Apple-style progress indicator)
6. Maximize the score canvas for focused editing

---

## Acceptance Criteria

### AC-001: Score Canvas (VexFlow)

**Existing:** [src/components/organisms/ScoreCanvas.tsx](../src/components/organisms/ScoreCanvas.tsx) — 363 lines, static design-faithful canvas with absolute pixel coordinates. Staves, labels, barlines, and note ellipses are rendered as React/Tailwind elements (not VexFlow).

- `[~]` `ScoreCanvas` component renders all four SATB voices — **present, but static (not VexFlow-driven)**. Pixel spec is locked to design; does not consume dynamic `ScoreState`.
- `[ ]` VexFlow integration — replace static stave rendering with `Renderer` + `Stave` + `Voice` + `Formatter` inside `useEffect`
- `[ ]` Voices consume Zustand `ScoreState` (notes, durations, beam groups)
- `[ ]` `role="img"` + `aria-label="SATB score: [piece name]"` on canvas wrapper
- `[~]` Canvas fills available width — present in CSS, but fixed pixel coords will break at narrow viewports

---

### AC-002: Playback (Tone.js)

**Existing:** [src/components/molecules/PlaybackBar.tsx](../src/components/molecules/PlaybackBar.tsx) (84 lines), [SandboxPlaybackBar.tsx](../src/components/molecules/SandboxPlaybackBar.tsx). `useSandboxStore` has only `contextMenu` state — no `isPlaying`, no `playhead`.

- `[~]` Playback button component exists — **no `usePlayback` hook wired to Tone.js**
- `[ ]` `usePlayback` hook dispatches symbolic note events to Tone.js (no `AudioContext`)
- `[ ]` `isPlaying` + `playheadPosition` added to Zustand store
- `[ ]` `aria-label="Play arrangement"` + `aria-pressed={isPlaying}` on button
- `[ ]` Playhead position reflected on score canvas

---

### AC-003: Red Line Violation Tooltips

**Existing:** [src/components/molecules/ViolationCard.tsx](../src/components/molecules/ViolationCard.tsx) (147 lines) renders violation data in the Theory Inspector sidebar. No inline canvas annotation exists.

- `[~]` Violation data displayed — **in sidebar only; not inline on VexFlow canvas**
- `[ ]` `RedLineTooltip` component renders inline at violation's measure/beat coordinates on canvas
- `[ ]` Violation data sourced from backend JSON `{ measure, beat, voices, ruleLabel, definition }` — never derived from raw note data
- `[ ]` Tooltip keyboard-accessible with `aria-describedby`
- `[ ]` Violation indicator uses `--color-violation-red` token

Per [music-theory.md](../.claude/rules/music-theory.md): "A parallel fifth is defined as two voices moving in the same direction by a perfect fifth interval, per common-practice voice-leading rules (Aldwell & Schachter, *Harmony and Voice Leading*, 4th ed.)"

---

### AC-004: Theme Toggle

**Existing:** [src/components/atoms/ThemeToggle.tsx](../src/components/atoms/ThemeToggle.tsx) (84 lines). Functional. **Uses 6 ad-hoc hex values** violating the Nocturne/Sonata token constraint.

- `[~]` Toggle exists and switches themes correctly
- `[!]` **CONSTRAINT VIOLATION:** `#2D1817`, `#A55B3766`, `#C8B8B6`, `#FFB300`, `#1A1110`, `#4A3B39` — replace with design system token references (requires Superman approval per typescript-patterns.md)
- `[ ]` `aria-label` toggles between `"Switch to dark mode"` / `"Switch to light mode"`
- `[ ]` `aria-pressed={isDark}` on button

---

### AC-005: Floating Bottom Dock (Progress Indicator)

**Existing:** [src/components/molecules/StepBar.tsx](../src/components/molecules/StepBar.tsx) is a top-anchored 3-step navigation (Playground → Document → Sandbox) — not a bottom dock.

- `[ ]` New floating dock component — bottom-anchored, Apple-style pill shape
- `[ ]` Displays current page / total pages within the active score
- `[ ]` Keyboard navigable (left/right arrow keys advance pages)
- `[ ]` Does not overlap score canvas at viewport heights ≥ 600px
- `[~]` Step navigation exists — preserve `StepBar` for workflow navigation; dock is for score pagination only

---

### AC-006: Score Maximize

**Existing:** No expand button found in any component.

- `[ ]` Expand button in score header toggles full-screen canvas mode
- `[ ]` `aria-label="Expand score"` / `"Collapse score"` (toggled)
- `[ ]` All other UI panels hidden in expanded state
- `[ ]` `Escape` key collapses expanded state

---

### AC-007: Metadata & Theory Tags (Phase 3)

**Existing:** [src/components/atoms/PartChip.tsx](../src/components/atoms/PartChip.tsx) exists. No Theory-Named tags implemented.

- `[~]` Part chip atom exists — no Theory-Named tag list rendered beneath score
- `[ ]` Theory-Named tags: Strophic, Homophonic, SATB, Common Meter, Hymnody — each anchored to academic definition
- `[ ]` Instrument tags dynamically generated from Zustand `ScoreState` voices
- `[ ]` Academically rigorous piece description rendered beneath score title

---

### AC-008: Hover / Selected States (Phase 4)

**Existing:** Some hover states present; no audit has been run.

- `[~]` Hover states on some interactive elements — **audit required: run against Nocturne/Sonata tokens**
- `[ ]` All interactive elements have explicit `hover:` and `focus-visible:` Tailwind classes
- `[ ]` Selected voice highlighted in score canvas
- `[ ]` No interactive element is hover-state-less

---

## Out of Scope (Backend Only)

- SATB constraint-satisfaction solver
- Parallel fifth / voice crossing detection logic
- LLM Theory Inspector API
- MusicXML persistence

---

## Notes for Planning Agent

- **AC-004 token fix** requires Superman approval before implementation — present as a proposal, not a direct commit
- **AC-001 VexFlow migration** is the highest-complexity task; do not attempt in a single loop iteration — split into: (1) VexFlow Stave rendering, (2) dynamic note rendering, (3) ScoreState integration
- `src/lib/llm-review.ts` may be needed for AC-001 visual correctness and AC-007 description tone checks
- Backend violation JSON shape required: `{ measure: number, beat: number, voices: [string, string], ruleLabel: string, definition: string }`
