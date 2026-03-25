# CONTEXT.md — docs/ontology/

*Canonical domain entity definitions for HarmonyForge. The authoritative source for what project-specific terms mean — not how they are implemented (→ patterns/) or why decisions were made (→ adr/).*

---

## Purpose

This folder defines the **domain language** of HarmonyForge. Every concept used in specs, ADRs, rule files, and source code should have its canonical definition here. When a term appears in multiple contexts (music theory, HCI, engineering), the ontology resolves the ambiguity.

---

## What Belongs Here

- Named domain entities and their relationships (SATB voices, ViolationFlag, Glass Box, etc.)
- Music theory glossary with Theory Named citations (per Aldwell & Schachter or equivalent)
- HCI/design terminology used in the project (Intrinsic Determinism, Ante-hoc explainability, Expressive Sovereignty)
- Entity relationship maps (what a ScoreCanvas contains, how ViolationFlag relates to TheoryInspector)
- Disambiguation entries when a term has multiple valid meanings

## What Does NOT Belong Here

- Implementation patterns → `docs/patterns/`
- External research papers and citations → `docs/research/`
- Architectural decisions with rationale → `docs/adr/`
- Operational rules and constraints → `docs/policies/`

---

## Domain Entities (Index)

| Entity | Definition | Source |
|---|---|---|
| **SATB** | Four-voice choral texture: Soprano, Alto, Tenor, Bass | Common-practice tradition (Aldwell & Schachter, *Harmony and Voice Leading*, 4th ed.) |
| **Voice** | A single melodic line within the SATB texture, defined by its range and role | Ibid. |
| **ViolationFlag** | A structured JSON object emitted by the backend constraint-satisfaction solver when a voice-leading rule is broken | HarmonyForge backend spec |
| **RedLine** | The inline visual annotation rendered on the VexFlow canvas at the position of a ViolationFlag | HarmonyForge design system |
| **Glass Box** | An AI system designed for ante-hoc transparency — interpretable by design, not post-hoc explanation | XAI taxonomy (Arrieta et al., 2020) |
| **Ante-hoc Explainability** | Transparency built into the system architecture before deployment, as opposed to post-hoc saliency maps | Ibid. |
| **Theory Inspector** | The sidebar UI component that surfaces LLM-generated Glass Box explanations for detected violations | HarmonyForge HCI spec |
| **Intrinsic Determinism** | The design principle that every music theory claim must be anchored in an academic definition, not probabilistic inference | HarmonyForge CLAUDE.md |
| **Theory Named Strategy** | The citation protocol: "X is defined as [definition], per [source]." Required for all theory claims | `.claude/rules/music-theory.md` |
| **Expressive Sovereignty** | A composer's right to make intentional, informed decisions — not accept opaque AI outputs | Notebook research (Notebook 1) |
| **Repair Phase** | The workflow stage where a composer corrects AI-generated music that violates voice-leading rules | HarmonyForge research framing |
| **Axiomatic Ground Truth** | A music theory rule derived from pedagogical texts (Fux, Aldwell) used as a deterministic constraint | HarmonyForge backend design |
| **ScoreCanvas** | The VexFlow-rendered symbolic score view in the Tactile Sandbox | HarmonyForge frontend spec |
| **Playhead** | The current playback position tracked in Zustand state, used to synchronize score highlighting with Tone.js | HarmonyForge frontend spec |
| **Symbolic Only** | The constraint that all music data is represented as MusicXML/JSON — no raw audio buffers in the frontend | `.claude/rules/typescript-patterns.md` |
| **Nocturne** | The dark-mode palette in the HarmonyForge design system | `src/app/globals.css`, `design-system.md` |
| **Sonata** | The light-mode palette in the HarmonyForge design system | Ibid. |

---

## Voice-Leading Rules (Canonical Definitions)

| Rule | Definition | Source |
|---|---|---|
| **Parallel Fifths** | Two voices moving in the same direction by a perfect fifth interval in consecutive harmonies | Aldwell & Schachter, *Harmony and Voice Leading*, 4th ed., Ch. 5 |
| **Parallel Octaves** | Two voices moving in the same direction by a perfect octave in consecutive harmonies | Ibid. |
| **Voice Crossing** | A lower voice ascending above a higher voice (e.g., Alto above Soprano) | Ibid. |
| **Voice Overlap** | A voice moving to a pitch beyond where the adjacent voice was in the previous chord | Ibid. |
| **SATB Ranges** | Soprano: B3–G5; Alto: G3–C5; Tenor: C3–G4; Bass: E2–C4 | Ibid., standard reference |

---

## Related Folders

| Folder | Relationship |
|---|---|
| `docs/patterns/` | How entities are implemented in code |
| `docs/research/` | External sources that define or motivate these entities |
| `docs/policies/` | Constraints on how entities may be rendered or computed |
| `docs/adr/` | Decisions made about the architecture of these entities |
| `specs/` | Acceptance criteria that test entity behaviour |
