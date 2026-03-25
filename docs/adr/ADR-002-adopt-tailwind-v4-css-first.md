# ADR-002: Adopt Tailwind v4 CSS-First Token Architecture

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** —

---

## Decision Drivers

- Design tokens must be maintainable as CSS custom properties, not JavaScript config objects
- Tailwind v4 removes `tailwind.config.js` in favor of `@theme` blocks in CSS
- Design system spec (Nocturne/Sonata) requires ~60 named tokens — JS config would require a custom plugin layer
- Next.js 15 / Tailwind v4 pairing is the current stable recommended stack

## Context

HarmonyForge requires a two-palette design system (Nocturne dark, Sonata light) with ~60 named tokens spanning color, spacing, radius, shadow, and motion. Tokens must be accessible as CSS custom properties for runtime theme switching without JavaScript. At project start, Tailwind v4 was selected as the CSS framework.

## Options Considered

### Option 1: Tailwind v4 CSS-first (`@theme` in `globals.css`) — **Selected**

- **Pro:** Tokens are plain CSS custom properties; no build step; runtime theme switching via `data-theme` attribute without JS
- **Pro:** No `tailwind.config.js` to maintain; single source of truth in `src/app/globals.css`
- **Con:** Tailwind v4 is newer; some plugins have not yet updated to the CSS-first API

### Option 2: Tailwind v3 with `tailwind.config.js` `theme.extend`

- **Pro:** Mature ecosystem; wide plugin compatibility
- **Con:** Tokens live in JS — runtime theme switching requires CSS variable injection layer
- **Con:** Two sources of truth (config + CSS variables) increase sync errors

## Decision

We will use Tailwind v4's CSS-first configuration, declaring all HarmonyForge design tokens as CSS custom properties inside `@theme` blocks in `src/app/globals.css`. No `tailwind.config.js` will be maintained.

## Rationale

CSS custom properties enable runtime theme switching with a single `data-theme` attribute toggle, no JavaScript re-render required. The single-file token source of truth eliminates the config/CSS sync risk. We are not optimizing for Tailwind plugin ecosystem breadth — HarmonyForge uses a narrow, controlled token set.

## Consequences

**Positive:**
- Runtime theme toggle is a pure CSS operation — no hydration risk
- All design tokens are auditable in one file (`globals.css`)
- New agents can read the entire token set in a single file read

**Negative:**
- Some Tailwind v3 plugins incompatible with v4 CSS-first API
- `@theme` syntax is less familiar to developers accustomed to `tailwind.config.js`

**Neutral / Follow-ups:**
- `npm run lint` currently fails due to `eslint-config-next` incompatibility with `zod-validation-error` on Node 25 — tracked in AGENTS.md, unrelated to this decision

## Validation / Revisit Criteria

- Revisit if a required Tailwind plugin (e.g., typography, forms) cannot be adapted to v4 CSS-first
- Revisit if Next.js drops Tailwind v4 support before v4 reaches stable

## References

- `src/app/globals.css` — all token declarations
- `design-system.md` — token specification
- Tailwind v4 release notes: CSS-first configuration
