# CONTEXT.md — docs/design/

*Design artifacts. The `.pen` file (Pencil design tool) and the design system specification. Reference-only — never derive tokens from here without Superman approval.*

---

## Ontology

| Term | Definition |
|---|---|
| **`.pen` file** | A Pencil design tool file — contains the visual design of HarmonyForge screens |
| **`system.md`** | The design system specification — palette, typography, spacing, radius, motion |
| **Nocturne** | The dark theme palette defined in this spec |
| **Sonata** | The light theme palette defined in this spec |
| **Token** | A named value from the design system (color, spacing, radius) — the source of truth for `globals.css` |

---

## Decisions

- **Design tokens flow one way**: `docs/design/system.md` → `src/app/globals.css` → Tailwind utility classes. Never reverse this flow.
- **WCAG §1.4.11 fix**: `--sonata-accent-accessible: #b87800` was added to `globals.css` as a compliant alternative to `#ffb300` (1.66:1 → 3.37:1 contrast ratio on Sonata background)

---

## Patterns

- When a new token is needed: propose it in chat referencing `system.md`, get Superman approval, then add to `globals.css`
- When comparing design vs. implementation: read `HarmonyForge.pen` via Pencil MCP tools (not text editors)

---

## Policies

- **Never auto-apply color values from design files** — surface as `[ui-ux-pro-max suggestion]` and wait for approval
- **Never edit `system.md` as a code change** — design system changes require Superman approval and a corresponding `globals.css` update
- **Read `.pen` files only via Pencil MCP tools** — they are encrypted binary files

---

## Files

| File | Purpose |
|---|---|
| `HarmonyForge.pen` | Pencil design file — visual screens (read via Pencil MCP only) |
| `system.md` | Design system specification — authoritative source for all tokens |

---

## Research

| Resource | Purpose |
|---|---|
| `src/app/globals.css` | The implemented token set |
| `.claude/rules/typescript-patterns.md` | Token rule, ui-ux-pro-max suggestion protocol |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-09 | user-opened-file-temp-readonly | Task: Introduce a single new token --sonata-accent-accessible in globals · Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+69 more) · Constraint enforced: Only globals.css changes — no component files touched · Constraint enforced: --sonata-accent: #ffb300 is preserved; only the two WCAG-critical usages are · Agent (claude-sonnet-4-6 2026-03-09 09:13:09Z) All 9 files created and verified. | [history](.specstory/history/2026-03-09_08-19-49Z-your-task-is-to.md) | <!-- d8ed8743-2cb1-4aa0-be80-c6d18b6b1381 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+4 more) | [history](.specstory/history/2026-03-10_08-59-04Z-you-are-a-context.md) | <!-- 8eed7d8a-a9ea-422c-bdd1-86027780f9f2 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
