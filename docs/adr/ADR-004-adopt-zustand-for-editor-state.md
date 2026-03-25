# ADR-004: Adopt Zustand for Editor State Management

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** —

---

## Decision Drivers

- Editor state (voices, selection, playhead, violation flags) must be accessible across the component tree without prop drilling
- TypeScript ergonomics are critical — state slices must be strictly typed
- Performance: score canvas re-renders must be selective (only on relevant state changes)

## Context

HarmonyForge requires shared editor state spanning the score canvas, playback bar, Theory Inspector sidebar, and ensemble builder. React Context re-renders all consumers on any state change — unacceptable for a score canvas that must respond only to note changes.

## Options Considered

### Option 1: Zustand — **Selected**

- **Pro:** Selective subscription (`useStore(selector)`) prevents unnecessary re-renders
- **Pro:** TypeScript-native; slice pattern maps cleanly to typed interfaces
- **Pro:** No provider wrapping required — stores are singletons accessible anywhere
- **Con:** Global singletons can be harder to test in isolation

### Option 2: React Context + `useReducer`

- **Pro:** Zero dependencies; built into React
- **Con:** All consumers re-render on every dispatch — fatal for score canvas performance
- **Con:** Typed reducers with complex state shapes are verbose

## Decision

We will use Zustand for all shared editor state. Each state domain (score, playback, ensemble, violations) will be a separately typed Zustand slice with explicit action signatures. No `any` types in store definitions.

## Rationale

Selective subscription is non-negotiable for a live score editor. React Context's broadcast re-render model would cause the VexFlow canvas to re-render on every theory inspector update, producing visible lag. Zustand's selector pattern makes each component subscribe only to the slice it needs. We are not optimizing for zero-dependency — we are optimizing for rendering performance and TypeScript ergonomics.

## Consequences

**Positive:**
- Score canvas re-renders only when `ScoreState` changes — not on playback position or violation updates
- Typed slices catch state shape errors at compile time
- Easy to add devtools (`zustand/middleware`) for debugging

**Negative:**
- Global singletons: test isolation requires explicit store reset between tests
- Zustand's store-as-module pattern unfamiliar to developers expecting Redux-style containers

**Neutral / Follow-ups:**
- `src/store/` directory holds all Zustand slices; no API calls inside stores — stores hold synchronous state only

## Validation / Revisit Criteria

- Revisit if React Server Components require a server-compatible state solution
- Revisit if store count exceeds 8 slices (complexity threshold for considering modularization)

## References

- `src/store/` — Zustand slice implementations
- `src/CONTEXT.md` — "Zustand over Context API" decision entry
- Zustand documentation — `create`, `useStore`, `subscribeWithSelector`
