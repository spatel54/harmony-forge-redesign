# ADR-006: Adopt Symbolic-Only Media Constraint for VexFlow and Tone.js

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** —

---

## Decision Drivers

- HarmonyForge is a Glass Box system — all reasoning must be transparent, deterministic, and auditable
- Web Audio API (AudioContext, raw buffers) introduces untestable, platform-dependent behavior
- Symbolic representations (MusicXML/JSON) are the only format that supports academic analysis, citation, and deterministic constraint checking

## Context

HarmonyForge requires score rendering (VexFlow) and playback (Tone.js). Both libraries can operate in two modes: (1) symbolic/event-driven using note pitch, duration, and timing data, or (2) raw audio synthesis using Web Audio API buffers, oscillators, and audio processing graphs. The Glass Box design principle requires that all music data remain in symbolic form throughout the frontend.

## Options Considered

### Option 1: Symbolic-only — VexFlow renders symbolic note data; Tone.js schedules symbolic events — **Selected**

- **Pro:** Score data is always in inspectable, citable form (MusicXML/JSON)
- **Pro:** No AudioContext lifecycle management in the frontend — no autoplay policy issues
- **Pro:** Constraint checking, Theory Named citations, and Glass Box explanations all operate on the same symbolic representation
- **Con:** Less expressive for advanced audio effects (reverb, spatialization) — acceptable given the product scope

### Option 2: Raw Audio — VexFlow renders notation; Tone.js synthesizes raw audio with full DSP

- **Pro:** More expressive audio output (reverb, humanization, dynamics)
- **Con:** Raw audio data is opaque — cannot be inspected, cited, or passed to constraint-satisfaction logic
- **Con:** AudioContext lifecycle on mobile requires explicit user gesture; significant UX complexity
- **Con:** Violates the Glass Box boundary: music becomes a waveform, not a symbolic artifact

## Decision

We will use VexFlow exclusively for symbolic note rendering from MusicXML/JSON data, and Tone.js exclusively for symbolic event scheduling (`Tone.Part`, `Tone.Synth` with MIDI note names). `new AudioContext()`, `AudioBuffer`, `createOscillator`, and any raw Web Audio API calls are permanently banned from `src/`.

## Rationale

The symbolic constraint is the architectural foundation of HarmonyForge's Glass Box claim. Once music becomes a waveform, it cannot be inspected for SATB violations, cited to academic sources, or surfaced through the Theory Inspector. The symbolic boundary is what enables ante-hoc explainability. We are not optimizing for audio fidelity — we are optimizing for transparency and academic rigour.

## Consequences

**Positive:**
- All music data is inspectable and auditable at every stage
- VexFlow and Tone.js share the same data model — no conversion layer
- Theory Named citations can reference exact note events by position

**Negative:**
- No advanced audio effects (reverb, humanization) — playback sounds synthetic
- `Tone.start()` still requires a user gesture (AudioContext API limitation) — mitigated by placing playback behind a button

**Neutral / Follow-ups:**
- Violation indicator: `new AudioContext()` in any `src/` file
- Enforcement: policy P-004 (VexFlow) and P-005 (Tone.js) in `docs/policies/CONTEXT.md`

## Validation / Revisit Criteria

- Revisit if Superman explicitly requests audio quality improvements that require raw buffer access
- Revisit if a future HarmonyForge phase introduces a dedicated audio rendering service (backend-side audio synthesis)

## References

- `docs/policies/CONTEXT.md` — P-004, P-005
- `src/lib/audio/CONTEXT.md` — Tone.js symbolic scheduling adapter patterns
- Arrieta et al., "Explainable AI: Concepts, taxonomies, opportunities." *Information Fusion*, 2020 — Glass Box definition
