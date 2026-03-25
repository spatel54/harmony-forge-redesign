# ADR-009: VexFlow SVG Backend via Dynamic Import + useEffect

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** HarmonyForge HCI Team
**Supersedes / Superseded by:** N/A

---

## Decision Drivers

- Score rendering must be accessible (SVG text nodes readable by screen readers)
- Rendering must adapt to container width (responsive, not fixed-px)
- VexFlow accesses `document` at import time — SSR must not fail
- Theme switching (Nocturne ↔ Sonata) must propagate to rendered staves
- DOM manipulation must remain inside React's render cycle boundary

---

## Context

The `ScoreCanvas` organism renders the SATB grand staff. The initial implementation
used a static SVG with hardcoded absolute-pixel coordinates matching the Pencil design
spec exactly. This approach:

- Does not scale to real note data (static coordinates cannot be computed from symbolic input)
- Cannot reflow at non-1060px container widths
- Is incompatible with VexFlow's layout engine (Formatter + Voice)

VexFlow 5.0.0 is already installed. The decision is how to integrate it safely within
Next.js App Router (where Server Components cannot use browser APIs).

---

## Options Considered

### Option 1: Static import + `"use client"` directive

```typescript
import { Renderer, Stave } from 'vexflow';
```

- **Pro:** Synchronous — no loading flash; full TypeScript types available at compile time.
- **Con:** VexFlow may access `document` or `window` at module evaluation time, causing SSR failure.
- **Risk:** Build-time error on Next.js server bundle if VexFlow contains top-level browser API calls.

### Option 2: Dynamic import inside `useEffect` (chosen)

```typescript
React.useEffect(() => {
  import('vexflow').then(({ Renderer, Stave, StaveConnector }) => { ... });
}, []);
```

- **Pro:** Guaranteed client-only execution — SSR safe by design. No `typeof window` guard needed.
- **Pro:** VexFlow chunk is code-split, not bundled into the initial JS payload.
- **Con:** Brief render-before-VexFlow window (container empty until effect fires).
- **Risk:** None material — the container shows `--hf-canvas-bg` while VexFlow loads.

### Option 3: `next/dynamic` with `ssr: false`

Wrap `ScoreCanvas` itself in `dynamic(() => import(...), { ssr: false })`.

- **Pro:** Idiomatic Next.js pattern for client-only components.
- **Con:** Adds a wrapper component; makes it harder to attach a `ref` to the inner component.
- **Con:** Does not solve the resize-reactive rendering problem — still needs internal `useEffect`.

---

## Decision

We will use **Option 2**: dynamic `import('vexflow')` called inside `useEffect`, with a
`ResizeObserver` triggering re-renders when the container dimensions change.

---

## Rationale

- SSR safety is non-negotiable in Next.js App Router — Option 1's risk is unacceptable without
  verifying VexFlow's module evaluation path in v5.
- Option 3 adds indirection without eliminating the need for `useEffect`, so Option 2 is simpler.
- The brief empty-container window is acceptable: `score-canvas-container` shows `--hf-canvas-bg`
  (the score paper color), which matches the expected appearance before any notes load.
- SVG backend (not Canvas) is chosen for the `Renderer`: SVG text nodes inherit font/color from
  CSS, and are readable by screen readers when the parent has `aria-hidden="false"`. Canvas pixels
  are opaque to assistive technology.

We are **not** optimizing for peak render performance (>100 measures with many notes). If
performance becomes a constraint, migrating to the Canvas backend is the ADR-009 revisit trigger.

---

## Consequences

**Positive:**
- No SSR crashes — VexFlow is only evaluated in the browser.
- Stave width is computed from `clientWidth` at render time — responsive at all viewport sizes.
- SVG output inherits CSS custom properties (`--hf-text-primary`, `--hf-staff-line`) enabling
  seamless Nocturne/Sonata theme switching without a re-render.
- Code-splitting reduces initial JS bundle size.

**Negative:**
- Dynamic import creates an async seam — tests that assert stave presence must account for
  the import promise resolving (use `waitFor` in RTL or mock the module).
- TypeScript types from the dynamic import are inferred, not statically available at the call
  site without explicit type imports.

**Neutral / Follow-ups:**
- TASK-A20 (note rendering) and TASK-A21 (ScoreState Zustand slice) build directly on the
  `Renderer` + `Stave` objects created in this effect.
- TASK-A24 (RedLineTooltip coordinates) depends on the `Stave` instance's `getX()` / `getY()`
  methods being accessible — they will be via a store ref exposed in TASK-A21.

---

## Validation / Revisit Criteria

- Revisit if VexFlow SVG rendering degrades at >50 measures (> ~200 note objects per stave).
- Revisit if a VexFlow Canvas backend wrapper with `aria-label` annotation achieves parity
  with the SVG approach for screen reader support.
- Revisit if Next.js adds first-class support for a safer SSR-exempt static import path.
