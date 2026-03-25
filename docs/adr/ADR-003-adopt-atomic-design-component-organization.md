# ADR-003: Adopt Atomic Design Component Organization

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** —

---

## Decision Drivers

- Component reuse requires a clear layering model so that low-level primitives do not import high-level composites
- VexFlow DOM manipulation must be isolated at a single architectural layer (organisms)
- New contributors and agents must be able to locate any component without reading all files

## Context

HarmonyForge's frontend has ~40 React components spanning icon buttons, voice dropdowns, playback bars, score canvases, and full page panels. Without a naming and layering convention, circular imports and misplaced logic accumulate rapidly.

## Options Considered

### Option 1: Atomic Design (atoms / molecules / organisms) — **Selected**

- **Pro:** Well-documented industry standard; clear rules for what belongs at each layer
- **Pro:** VexFlow components naturally belong at organism level — no ambiguity
- **Con:** Boundary calls (is a `ViolationCard` a molecule or organism?) require judgment

### Option 2: Feature-based folders (`/score`, `/playback`, `/inspector`)

- **Pro:** Co-locates all code for a feature
- **Con:** Cross-feature primitives (buttons, dropdowns) have no natural home — duplication risk
- **Con:** Does not scale when features share 60%+ of their UI atoms

## Decision

We will organize all components under `src/components/` as `atoms/` (primitive, stateless, no store reads), `molecules/` (composites of atoms, may read store), and `organisms/` (full UI sections, own layout, VexFlow usage permitted only here).

## Rationale

Atomic Design gives every new component a deterministic home without judgment calls about which feature it belongs to. The VexFlow constraint (DOM manipulation in organisms only) maps cleanly onto the organism layer. We are not optimizing for feature co-location — HarmonyForge's features share too much UI surface for that to scale.

## Consequences

**Positive:**
- VexFlow isolation is structurally enforced (organisms only)
- Agents can search `atoms/` for primitives without scanning organisms
- Circular import risk is reduced by the strict downward-only dependency rule

**Negative:**
- Some components (e.g., `ViolationCard`) sit on the molecule/organism boundary — require judgment
- Atomic Design is a convention, not enforced by TypeScript — discipline required

**Neutral / Follow-ups:**
- Logic must not leak downward: atoms may not import from molecules; molecules may not import from organisms

## Validation / Revisit Criteria

- Revisit if atomic boundaries produce more than 3 ambiguous classification disputes in a single phase
- Revisit if a feature genuinely requires co-location (e.g., a self-contained plugin system)

## References

- `src/components/atoms/`, `molecules/`, `organisms/` — current directory structure
- Brad Frost, *Atomic Design* (2016) — foundational reference
