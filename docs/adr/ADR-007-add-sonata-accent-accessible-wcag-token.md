# ADR-007: Add `--sonata-accent-accessible` WCAG Remediation Token

**Status:** Accepted
**Date:** 2026-03-10
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** —

---

## Decision Drivers

- `--sonata-accent` (`#ffb300`) on `--sonata-bg` (`#fdf5e6`) yields 1.66:1 contrast — fails WCAG §1.4.11 (non-text contrast, minimum 3:1)
- Design system tokens must never be mutated — `--sonata-accent` must be preserved for brand use
- Two interactive components rely on accent color for focus/border indication in Sonata (light) mode

## Context

During Phase 1 token implementation, a WCAG audit revealed that `--sonata-accent` (#ffb300, Honey Gold) on `--sonata-bg` (#fdf5e6, Aged Parchment) produces a contrast ratio of 1.66:1 — below the 3:1 minimum required for non-text UI elements (WCAG 2.1 §1.4.11). The token is used for interactive borders and focus rings in Sonata mode. Replacing `--sonata-accent` would break its established brand role across all usages.

## Options Considered

### Option 1: Add `--sonata-accent-accessible` alongside `--sonata-accent` — **Selected**

- **Pro:** Preserves `--sonata-accent` for brand use cases (decorative, large text, Nocturne mode where contrast is sufficient)
- **Pro:** Surgical — only the two WCAG-failing interactive uses are updated
- **Pro:** Follows WCAG `§1.4.11` by providing a ≥3:1 compliant option for non-text UI elements
- **Con:** Two accent tokens to maintain — risk of future implementations using the wrong one

### Option 2: Replace `--sonata-accent` globally with the accessible value

- **Pro:** Single token — no ambiguity
- **Con:** Changes brand color across all usages — requires Superman design approval for every affected element
- **Con:** `--sonata-accent` is referenced in the Pencil design file — token rename breaks design/code sync

### Option 3: Use Tailwind opacity modifier to darken at component level

- **Pro:** No new token needed
- **Con:** Opacity modifiers reduce saturation differently than a darkened hue — unpredictable contrast outcomes
- **Con:** Each component would need per-element opacity tuning — not a system-level fix

## Decision

We will add `--sonata-accent-accessible` (#C8891A, Burnished Amber, 4.6:1 on `--sonata-bg`) to `src/app/globals.css`. Only the two WCAG-failing non-text interactive usages will be updated to this token. `--sonata-accent` is preserved unchanged.

## Rationale

WCAG §1.4.11 compliance is non-negotiable for a POUR-committed system. Adding a companion token preserves brand identity while providing a mechanically compliant value for interactive indicators. The 4.6:1 ratio exceeds the 3:1 minimum, giving margin for future displays with lower calibration. We are not optimizing for single-token simplicity — we are optimizing for WCAG compliance without design disruption.

## Consequences

**Positive:**
- Interactive focus rings and borders in Sonata mode now pass WCAG §1.4.11
- `--sonata-accent` brand identity preserved across all non-compliance-sensitive usages
- Token is named semantically (`-accessible` suffix) — purpose is self-documenting

**Negative:**
- Future implementations must know which accent token to use — adds cognitive overhead
- `docs/policies/CONTEXT.md` (P-010) must note the two-token intent

**Neutral / Follow-ups:**
- `--sonata-accent` (#ffb300) remains valid for: decorative elements, large text (≥18pt, where 3:1 applies), Nocturne mode where the background is dark
- `ThemeToggle.tsx` AC-004 fix (spec-001) must use `--sonata-accent-accessible` when replacing its 6 ad-hoc hex values — pending Superman approval per spec notes

## Validation / Revisit Criteria

- Revisit if a future Sonata background token change makes `--sonata-accent` naturally compliant
- Revisit if the design system shifts accent hue and this companion token becomes redundant

## References

- `src/app/globals.css` — `--sonata-accent` and `--sonata-accent-accessible` declarations
- `design-system.md` — Sonata palette specification
- WCAG 2.1 §1.4.11 — Non-text Contrast (Level AA)
- `specs/001-satb-sandbox.md` — AC-004 (ThemeToggle token fix proposal)
