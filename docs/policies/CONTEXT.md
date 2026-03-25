# CONTEXT.md — docs/policies/

*Non-negotiable constraints and behavioral rules. The "what you must never do" layer — hard boundaries that cannot be overridden by convenience or time pressure.*

---

## Purpose

This folder is the **human-readable source of truth** for HarmonyForge's non-negotiable rules. The operative agent versions live in `.claude/rules/`; this folder provides the full rationale and scope for each policy. When a rule in `.claude/rules/` and a policy here conflict, resolve the conflict by updating both to match — never silently diverge.

---

## What Belongs Here

- Stack constraints (no `any`, Tailwind only, no frontend constraint logic)
- Accessibility requirements (POUR)
- Output completeness rules
- Design token constraints
- Backpressure gates (required commands before every commit)
- Security constraints (no secrets in source, no `.env` commits)
- Architecture boundary rules (what lives in frontend vs. backend)

## What Does NOT Belong Here

- How to implement within these constraints → `docs/patterns/`
- Why these constraints were chosen → `docs/adr/`
- Domain concept definitions → `docs/ontology/`

---

## Policy Registry

### P-001: Architecture Boundary
**Rule:** The frontend exclusively renders, schedules, and surfaces. Constraint-satisfaction logic, SATB validation, and violation detection live in the backend.
**Scope:** All files in `src/`
**Violation indicator:** Any import of a music theory solver, constraint engine, or rule-checking function in `src/`
**Source:** CLAUDE.md § Architecture Boundaries; ADR-001

---

### P-002: TypeScript Strict Mode — No `any`
**Rule:** No `any` type in any source file. All props, state, and API responses must have explicit interfaces.
**Scope:** All `.ts` and `.tsx` files in `src/`
**Violation indicator:** TypeScript emitting `error TS7057` or `error TS2345` with `any` involved
**Source:** `.claude/rules/typescript-patterns.md`

---

### P-003: Tailwind CSS Only — No Ad-hoc Hex Values
**Rule:** All styling uses Tailwind utility classes referencing Nocturne/Sonata design tokens. No inline styles, no ad-hoc hex values, no `style={{}}` with color literals.
**Scope:** All `.tsx` files
**Violation indicator:** Any `#` hex value or `rgb()` literal in a component file; six known violations in `ThemeToggle.tsx` (flagged `[!]` in spec AC-004)
**Source:** `.claude/rules/typescript-patterns.md`; `design-system.md`

---

### P-004: VexFlow DOM Manipulation in useEffect Only
**Rule:** All VexFlow renderer construction, stave/note mutation, and SVG manipulation must occur inside `useEffect`. Never access VexFlow outside the effect lifecycle.
**Scope:** All components that render score content
**Violation indicator:** VexFlow `Renderer` or `Stave` constructor calls outside a `useEffect` block
**Source:** `.claude/rules/typescript-patterns.md`

---

### P-005: Tone.js Symbolic Events Only
**Rule:** Tone.js may only schedule symbolic note events (pitch, duration, start time). No `AudioContext` construction, raw buffer access, or audio synthesis in the frontend.
**Scope:** `src/lib/audio/`, any hook that calls Tone.js
**Violation indicator:** `new AudioContext()`, `AudioBuffer`, or `createOscillator` in any `src/` file
**Source:** `.claude/rules/typescript-patterns.md`

---

### P-006: POUR Accessibility (Mandatory)
**Rule:** All interactive elements must satisfy POUR: Perceivable, Operable, Understandable, Robust.
**Required:** `aria-label` on all icon-only buttons; `aria-pressed` on toggles; `aria-describedby` pointing to tooltip content; keyboard navigation for all interactive elements; focus-visible ring on all focusable elements.
**Scope:** All components in `src/components/`
**Violation indicator:** Interactive element without `aria-label`; missing `tabIndex`; no focus-visible ring
**Source:** CLAUDE.md § UI/UX Constraints; `.claude/rules/typescript-patterns.md`

---

### P-007: Output Completeness — No Truncation
**Rule:** No `// ...`, `// rest of code`, `// TODO`, `/* ... */`, bare `...`, or "for brevity" shortcuts in any code delivery. Full output or a clean breakpoint with `[PAUSED — X of Y complete]`.
**Scope:** All AI-generated code in this repository
**Violation indicator:** Any banned pattern present in a code block
**Source:** `.claude/rules/output-completeness.md`

---

### P-008: Backpressure Gates (Pre-Commit Required)
**Rule:** Run all three commands in order before any commit. Do not mark a task complete if any command fails.
```bash
npx tsc --noEmit      # Type-check
npm run lint          # ESLint (currently fails on zod module — known pre-existing issue)
npm run build         # Full Next.js build
```
**Note on lint:** `npm run lint` currently fails due to a Node 25 / eslint-config-next 16.1.6 incompatibility with `zod-validation-error`. This is a pre-existing issue. Do not mark it as a blocker for unrelated tasks; track fix separately.
**Source:** `AGENTS.md`; ADR-001

---

### P-009: No Secrets in Source
**Rule:** Never hardcode API keys, tokens, or credentials in any source file. Never commit `.env` files. Never stage files containing secrets.
**Scope:** All files in the repository
**Violation indicator:** Any string literal that looks like an API key, JWT, or password in a non-`.env` file
**Source:** CLAUDE.md § Security Rules

---

### P-010: Design Token Constraint — Nocturne/Sonata Only
**Rule:** All color values, spacing, shadow, and radius tokens must come from the Nocturne/Sonata palette defined in `src/app/globals.css`. Never introduce values from outside the design system.
**Scope:** All styling in `src/`; all design files in `docs/design/`
**Exception process:** Any deviation requires Superman's explicit approval. Present the proposed token, its rationale, and the specific existing token it overrides.
**Source:** `.claude/rules/typescript-patterns.md` § Design Token Rule; `design-system.md`

---

### P-011: One Task Per Loop Iteration
**Rule:** The Ralph Wiggum Loop picks exactly one task from `IMPLEMENTATION_PLAN.md` per iteration. Compound task selection is prohibited.
**Scope:** Loop execution, `PROMPT_build.md`
**Source:** AGENTS.md § Loop Hygiene; Notebook 2 (context engineering methodology)

---

### P-012: Theory Named Strategy (Mandatory)
**Rule:** Every music theory claim in source comments, tooltips, violation labels, or documentation must be anchored in a rigorous academic definition: "X is defined as [definition], per [Author, *Title*, edition]."
**Scope:** All files containing music theory reasoning
**Source:** `.claude/rules/music-theory.md`; CLAUDE.md § Key Enforcement Rules

---

## Related Folders

| Folder | Relationship |
|---|---|
| `.claude/rules/` | Agent-operative versions of these policies (loaded every session) |
| `docs/adr/` | Decisions that established why these policies exist |
| `docs/patterns/` | How to implement correctly within these policy bounds |
| `AGENTS.md` | Operative backpressure commands and loop hygiene rules |
