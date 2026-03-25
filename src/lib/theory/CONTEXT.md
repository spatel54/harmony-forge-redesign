# CONTEXT.md — src/lib/theory/

*Frontend theory display helpers. Currently empty — reserved for Phase 3 utilities that parse and format backend violation JSON for display.*

---

## Ontology

| Term | Definition |
|---|---|
| **Violation JSON** | The structured payload from the backend: `{ measure: number, beat: number, voices: [string, string], ruleLabel: string, definition: string }` |
| **Display Helper** | A pure function that transforms violation JSON into display-ready strings or coordinates |
| **Theory-Named Tag** | A labelled music theory concept with an anchored academic definition (e.g., "Strophic", "Homophonic") |

---

## Decisions

- **Display only — never detect**: This directory holds formatting/parsing utilities. All rule evaluation happens backend-side. This constraint is permanent and enforced by the architecture boundary in `CLAUDE.md`.

---

## Patterns

- (None yet — directory is empty)
- Future pattern: pure functions that accept violation JSON and return display strings:
  ```ts
  export function formatViolationLabel(violation: ViolationJSON): string
  export function getViolationCoordinates(violation: ViolationJSON, scoreLayout: ScoreLayout): { x: number, y: number }
  ```

---

## Policies

- **Never implement parallel fifth detection, voice crossing detection, or any SATB rule logic** — backend only
- **No React imports** — pure TypeScript utilities only
- **No VexFlow or Tone.js imports**

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-003 (violation JSON shape), AC-007 (Theory-Named tags) |
| `.claude/rules/music-theory.md` | Theory Named strategy — definitions must be academically anchored |
