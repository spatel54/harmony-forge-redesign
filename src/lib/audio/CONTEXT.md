# CONTEXT.md — src/lib/audio/

*Tone.js symbolic scheduling adapters. `usePlayback.ts` created (TASK-A22 ✅).*

---

## Ontology

| Term | Definition |
|---|---|
| **Symbolic Scheduling** | Dispatching note events as pitch/duration/timing data to Tone.js Transport — no waveform synthesis |
| **Transport** | Tone.js's global playback clock — `Tone.Transport.start()`, `.stop()`, `.position` |
| **Part** | A `Tone.Part` instance — a sequence of `{ time, note, duration }` events for one SATB voice |
| **Playhead** | The current Transport position, mapped back to a measure/beat for the score canvas cursor |

---

## Decisions

- **Symbolic only**: All Tone.js usage is `Tone.Synth` + `Tone.Part` with MIDI note names — no `AudioContext`, no raw buffers, no sample loading
- **`usePlayback` hook** (TASK-A22 ✅): `play()` / `pause()` / `stop()` via dynamic `import('tone')`; stable refs pattern so scheduleRepeat never re-registers; all state in `useSandboxStore`
- **Dynamic import for SSR safety**: mirrors ADR-009 VexFlow pattern — `import('tone')` inside callbacks, never at module level
- **No `Tone.Part` yet**: TASK-A22 implements Transport lifecycle only; note scheduling via `Tone.Part` deferred to when backend note events are available

---

## Patterns

- Functions export typed scheduling actions:
  ```ts
  export function scheduleVoice(voice: SATBVoice, notes: NoteEvent[]): Tone.Part
  export function clearSchedule(): void
  ```
- All functions are pure setup/teardown — no global state held inside this directory

---

## Policies

- **Never call `new AudioContext()` directly** — use `Tone.start()` which handles the AudioContext lifecycle
- **Never load audio samples** — symbolic synthesis only (`Tone.Synth`, `Tone.PolySynth`)
- **No React imports** — this is a plain TypeScript adapter layer

---

## Files

| File | Purpose | Status |
|---|---|---|
| `usePlayback.ts` | Tone.js Transport hook — `play()`, `pause()`, `stop()`; updates `useSandboxStore` | ✅ TASK-A22 |

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-002 (playback hook requirements, symbolic event shape) |
| `.claude/rules/typescript-patterns.md` | Tone.js symbolic-only constraint |
