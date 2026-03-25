# Spec 002: Landing Page — Score Upload & Ensemble Setup

**Source:** PLAN.md Phase 1 (complete) + ongoing brownfield inventory
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

A composer opens HarmonyForge for the first time. They see the landing experience, understand the product's purpose, select their SATB ensemble, upload a symbolic score file (MusicXML, MIDI, or PDF), and are routed to the document review page.

---

## Acceptance Criteria

### AC-001: Branding & Visual Identity

**Existing:** [src/components/atoms/LogoLockup.tsx](../src/components/atoms/LogoLockup.tsx) — renders logo with wordmark. [src/components/organisms/PlaygroundBackground.tsx](../src/components/organisms/PlaygroundBackground.tsx) — animated music stand background.

- `[~]` Logo lockup renders on page — **needs verification against Nocturne/Sonata token compliance**
- `[~]` PlaygroundBackground renders the trapezoid music stand visual — **viewport scaling via `useEffect` (present); responsive behavior at narrow viewports unverified**
- `[ ]` `alt` text on logo image: `"HarmonyForge — Glass Box SATB Arrangement"`
- `[ ]` Background animation does not trigger `prefers-reduced-motion` violations

---

### AC-002: Score File Upload (ScoreDropzone)

**Existing:** [src/components/organisms/ScoreDropzone.tsx](../src/components/organisms/ScoreDropzone.tsx) — click-to-upload with `router.push('/document')` on accept.

- `[x]` Dropzone renders with drag-and-drop affordance
- `[x]` Click-to-upload opens the OS file picker — routes to `/document` after accept
- `[~]` Accepted file types: MusicXML (`.xml`, `.musicxml`), MIDI (`.mid`, `.midi`), PDF (`.pdf`) — **file type validation: confirm `accept` attribute is set and enforced**
- `[ ]` Invalid file type shows a user-facing error message in Sonata/Nocturne tokens — no raw hex
- `[~]` `role="button"` or `<input type="file">` keyboard accessible — **verify `tabIndex` and focus-visible ring**
- `[ ]` `aria-label="Upload a score file (MusicXML, MIDI, or PDF)"` on the upload control

---

### AC-003: Ensemble Builder Panel

**Existing:** [src/components/organisms/EnsembleBuilderPanel.tsx](../src/components/organisms/EnsembleBuilderPanel.tsx). Zustand store is empty — no ensemble state wired.

- `[~]` Panel renders 4 SATB voice slots (Soprano, Alto, Tenor, Bass) — **static display only; no Zustand slice wired**
- `[ ]` `EnsembleState` Zustand slice: `voices: Voice[]`, `setVoice: (index, voice) => void`
- `[ ]` Voice selector dropdown per slot — `aria-label="Select [Voice] instrument"`
- `[ ]` Selected ensemble state persists into `/sandbox` via Zustand (not URL params)
- `[~]` [src/components/molecules/VoiceDropdown.tsx](../src/components/molecules/VoiceDropdown.tsx) exists — **verify POUR: keyboard nav, focus-visible**

---

### AC-004: Theme Toggle

**Existing:** [src/components/atoms/ThemeToggle.tsx](../src/components/atoms/ThemeToggle.tsx) (84 lines).

- `[~]` Toggle renders and switches between Nocturne (dark) and Sonata (light) themes
- `[!]` **CONSTRAINT VIOLATION:** Six ad-hoc hex values present — see spec-001 AC-004 for the fix proposal (requires Superman approval)
- `[ ]` `aria-label` toggles: `"Switch to dark mode"` / `"Switch to light mode"`
- `[ ]` `aria-pressed={isDark}` on toggle button

---

### AC-005: Navigation Flow

**Existing:** [src/components/molecules/StepBar.tsx](../src/components/molecules/StepBar.tsx) — 3-step top navigation (Playground → Document → Sandbox).

- `[x]` StepBar renders 3 workflow steps
- `[~]` Step 1 (Playground) is active on this page — **verify active state uses token, not ad-hoc color**
- `[ ]` `aria-current="step"` on the active step
- `[ ]` Steps 2 and 3 are visually disabled (not interactive) until their prerequisite is complete

---

### AC-006: Accessibility (POUR — Page Level)

- `[ ]` Page `<title>` is `"HarmonyForge — Upload Your Score"`
- `[ ]` All interactive elements have `focus-visible:` Tailwind ring using Nocturne/Sonata tokens
- `[ ]` No element fails WCAG AA contrast (4.5:1 text, 3:1 non-text) — use `--sonata-accent-accessible` for Sonata theme text contrast
- `[ ]` Page keyboard flow: Logo → StepBar → EnsembleBuilderPanel → ThemeToggle → ScoreDropzone (logical reading order)

---

## Out of Scope (Backend Only)

- Score parsing or validation of uploaded MusicXML content
- MIDI to symbolic representation conversion
- Ensemble preset recommendations from LLM

---

## Notes for Planning Agent

- **AC-002 file type validation** is a single-iteration task: check `accept` attribute on `<input type="file">` and add an error state with a token-compliant message
- **AC-003 Zustand slice** is blocked until a decision is made on the `EnsembleState` shape — flag as `[ADR-NEEDED]` if the store design requires architectural input
- **AC-004 hex fix** requires Superman approval before implementation — present as a proposal per spec-001 AC-004 notes
- `StepBar` active state bug (AC-005) is low-effort: one token swap
- Backpressure for this spec: `npx tsc --noEmit` + `npm run build` (lint known broken per AGENTS.md)
