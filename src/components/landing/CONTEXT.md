# CONTEXT.md — src/components/landing/

*Landing page components. Currently empty — reserved for Phase 1 marketing screen components.*

---

## Ontology

| Term | Definition |
|---|---|
| **Landing Screen** | The entry point at `/` — introduces HarmonyForge to new users before they enter the sandbox |

---

## Decisions

- **Separate from sandbox components** — landing components have no access to score state or playback

---

## Patterns

- (None yet — directory is empty)

---

## Policies

- **No VexFlow or Tone.js imports** — landing is a marketing surface, not the editing environment
- **No Zustand store reads** — landing components are purely presentational

---

## Research

| Resource | Purpose |
|---|---|
| `PLAN.md` | Phase 1 marketing screen scope |
| `src/app/page.tsx` | Root page that will compose landing components |
