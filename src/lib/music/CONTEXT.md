# CONTEXT.md — src/lib/music/

*Music domain data structures and factory functions. Pure TypeScript — no framework dependencies, no audio, no rendering.*

---

## Ontology

| Term | Definition |
|---|---|
| **NoteEvent** | A symbolic music event: `{ pitch: string, duration: string, voice: SATBVoice, measure: number, beat: number }` |
| **SATBVoice** | One of `"soprano" \| "alto" \| "tenor" \| "bass"` |
| **noteFactory** | Pure factory function(s) in `noteFactory.ts` that construct `NoteEvent` objects |
| **Pitch** | A scientific pitch notation string (e.g., `"C4"`, `"G#3"`) — never a frequency value |
| **Duration** | A rhythmic value string (e.g., `"q"` = quarter, `"h"` = half, `"8"` = eighth) — Tone.js / VexFlow compatible |

---

## Decisions

- **Data-only layer**: `src/lib/music/` holds domain data structures and constructors — no VexFlow, no Tone.js, no React
- **Factory pattern**: `noteFactory.ts` produces typed `NoteEvent` objects from raw input — validation happens at this boundary

---

## Patterns

- Factory functions validate inputs and return typed domain objects:
  ```ts
  export function createNote(pitch: string, duration: string, voice: SATBVoice): NoteEvent
  ```
- SATB voice ranges enforced at factory boundary (Aldwell & Schachter standard ranges):
  - Soprano: B3–G5, Alto: G3–C5, Tenor: C3–G4, Bass: E2–C4

---

## Policies

- **No VexFlow imports** — music data structures are rendering-agnostic
- **No Tone.js imports** — music data structures are playback-agnostic
- **No React or Zustand imports**
- **Constraint violation detection belongs in the backend** — this factory only enforces data shape, not voice-leading rules

---

## Files

| File | Purpose |
|---|---|
| `noteFactory.ts` | Factory functions for `NoteEvent` construction |

---

## Research

| Resource | Purpose |
|---|---|
| `.claude/rules/music-theory.md` | SATB range constraints (Aldwell & Schachter reference) |
| `specs/001-satb-sandbox.md` | AC-001 (ScoreState note shape consumed by VexFlow) |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/app/page.ts, src/styles/fonts.css, src/app/globals.css (+5 more) · Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · Updating the plan to remove Fraunces. · Agent (claude-sonnet-4-6 2026-03-04 05:03:05Z) The reference shows a trapezoid desk — my rectangular implementation misses this. · Viewport scaling — a useEffect computes scale = window. | [history](.specstory/history/2026-03-04_04-46-41Z-explore-the-directory-users.md) | <!-- 7ee73219-a989-48f6-98bd-60aec828fa58 -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 04:48:35Z) Agent - sidechain (2026-03-04 04:48:17Z) Explore the directory /Users/shivpat/harmony-forge-redesign/src and list all files and folders. · This plan replaces the existing implementation with a pixel-faithful translation of node w7exk ("PLAYGROUND - LIGHT") from HarmonyForge. | [history](.specstory/history/2026-03-10_08-58-19Z-you-are-a-context.md) | <!-- 4fe6c710-92f3-43d5-b148-c8bbd2d0089e -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
