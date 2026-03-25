# Spec 003: Document Page — Score Review & Routing to Sandbox

**Source:** PLAN.md Phase 1 (complete) + brownfield inventory
**Status:** Active — components exist, spec retroactively written
**Last updated:** 2026-03-10

---

## Status Key

- `[x]` — Done and compliant
- `[~]` — Partially implemented (gaps noted inline)
- `[ ]` — Not started
- `[!]` — Exists but violates a constraint (must fix before shipping)

---

## Job to Be Done (JTBD)

A composer has uploaded a symbolic score file on the landing page and arrives at `/document`. They see a preview of the score metadata and a thumbnail rendering, confirm the file is correct, and proceed into the Tactile Sandbox at `/sandbox`.

---

## Acceptance Criteria

### AC-001: Document Header

**Existing:** [src/components/organisms/DocumentHeader.tsx](../src/components/organisms/DocumentHeader.tsx)

- `[~]` Header renders with back navigation and piece title area — **verify: title sourced from uploaded file name or metadata, not hardcoded**
- `[ ]` Back navigation: `router.push('/')` with `aria-label="Back to upload"`
- `[ ]` Piece title rendered in `Instrument Serif` (brand font token) — not Inter
- `[ ]` Step 2 (Document) is active in `StepBar` — `aria-current="step"` on step 2

---

### AC-002: Score Preview

**Existing:** [src/components/organisms/ScorePreviewPanel.tsx](../src/components/organisms/ScorePreviewPanel.tsx), [src/components/molecules/ScorePreviewPane.tsx](../src/components/molecules/ScorePreviewPane.tsx)

- `[~]` Preview panel renders — **content source unverified: confirm it displays the uploaded file's metadata (title, composer, time signature, key signature), not static placeholder data**
- `[ ]` Preview uses symbolic data only — no audio, no raw waveform rendering
- `[ ]` `role="img"` + `aria-label="Score preview: [piece title]"` on the preview container
- `[ ]` If no file is present in state (direct URL access), redirect to `/` — do not render an empty panel

---

### AC-003: Dropzone Copy & Instructions

**Existing:** [src/components/organisms/DropzoneCopy.tsx](../src/components/organisms/DropzoneCopy.tsx), [src/components/molecules/UploadPromptContent.tsx](../src/components/molecules/UploadPromptContent.tsx)

- `[~]` Instructional copy renders — **verify: copy is contextual (confirms file was accepted), not generic upload instructions**
- `[ ]` Copy states the accepted file name
- `[ ]` "Re-upload" or "Change file" link returns to `/` (`router.push('/')`)

---

### AC-004: Continue to Sandbox

- `[ ]` "Open in Sandbox" primary button routes to `/sandbox` via `router.push('/sandbox')`
- `[ ]` Button is disabled if no valid file is in Zustand / local state
- `[ ]` `aria-label="Open score in Sandbox"` on the button
- `[ ]` `aria-disabled="true"` when disabled; never `disabled` attribute alone (keyboard must still focus it)

---

### AC-005: Accessibility (POUR — Page Level)

- `[ ]` Page `<title>` is `"HarmonyForge — Review Your Score"`
- `[ ]` All interactive elements have `focus-visible:` Tailwind ring using Nocturne/Sonata tokens
- `[ ]` No element fails WCAG AA contrast (4.5:1 text, 3:1 non-text)
- `[ ]` Keyboard flow: Back → StepBar → Preview → Dropzone Copy → Open in Sandbox (logical order)

---

## Out of Scope (Backend Only)

- MusicXML parsing or structural analysis
- Score thumbnail generation from audio or waveform
- File conversion (MIDI → MusicXML)

---

## Notes for Planning Agent

- **AC-002 redirect guard** (no file → redirect to `/`) is a single-iteration task: check Zustand state on mount, call `router.push('/')` if no file present
- **AC-001 piece title** depends on where the uploaded file name is stored — confirm whether it lives in Zustand or `sessionStorage`; add a `DocumentState` Zustand slice if neither exists
- **AC-004 disabled button** requires the POUR pattern: `aria-disabled="true"` + pointer-events-none via Tailwind; never `disabled` (which removes keyboard focus)
- Backpressure: `npx tsc --noEmit` + `npm run build`
