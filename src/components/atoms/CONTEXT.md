# CONTEXT.md — src/components/atoms/

*Primitive, indivisible UI elements. Each atom is stateless beyond a mounting guard. No atoms write to Zustand or call APIs.*

---

## Ontology

| Term | Definition |
|---|---|
| **Atom** | The smallest reusable UI unit — wraps a single HTML element or SVG with HarmonyForge styling applied |
| **Mounting Guard** | A `React.useState(false)` + `useEffect(() => setMounted(true), [])` pattern used to prevent SSR hydration mismatches (see `ThemeToggle`) |
| **Token Reference** | A Tailwind class that resolves to a CSS custom property (e.g., `bg-[--hf-accent-accessible]`) |
| **SMUFL** | Standard Music Font Layout — the glyph standard used by `SmuflIcon` for musical symbols |

---

## Decisions

- **`ThemeToggle` uses `next-themes` `useTheme()`** — theme state lives in the `next-themes` provider, not Zustand
- **`ThemeToggle` token fix complete** (TASK-A18b ✅): all 6 ad-hoc hex values replaced with Nocturne/Sonata tokens (`--nocturne-detail`, `--nocturne-surface-40`, `--neutral-200`, `--sonata-detail`, `--hf-accent`, `--neutral-900`, `--neutral-700`, `--text-on-light`). Zero hex violations remain.

---

## Patterns

- `forwardRef` + `displayName` on every interactive atom
- `cn()` for all class composition
- Mounting guard pattern in `ThemeToggle` to prevent CLS:
  ```tsx
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-[72px] h-[32px] rounded-full" />;
  ```
- `aria-label` required on every button atom; `aria-pressed` on toggle buttons

---

## Policies

- **No Zustand store reads or writes** — atoms are controlled via props only
- **No hardcoded hex values** — replace with token references (`--nocturne-*`, `--sonata-*`, `--hf-*`)
- **No `useEffect` side effects beyond mounting guards** — atoms do not fetch data or schedule timers
- **No VexFlow or Tone.js imports**

---

## Files

| File | Purpose | Spec AC |
|---|---|---|
| `BrandTitle.tsx` | Logotype text atom | — |
| `ChatFAB.tsx` | Floating action button for Theory Inspector | — |
| `ExportFormatCard.tsx` | Card atom for export format selection | — |
| `LogoLockup.tsx` | Logo + brand name lockup | — |
| `PartChip.tsx` | Voice/part label chip | AC-007 |
| `SmuflIcon.tsx` | SMUFL musical glyph renderer | — |
| `ThemeProvider.tsx` | `next-themes` provider wrapper | AC-004 |
| `ThemeToggle.tsx` | Light/dark toggle — tokens fixed, aria-label + aria-pressed correct | AC-004 ✅ |
| `Tooltip.tsx` | Generic tooltip atom | AC-003 |
| `UploadIcon.tsx` | Upload icon atom | — |

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-004 (ThemeToggle token fix), AC-007 (PartChip theory tags) |
| `src/app/globals.css` | All valid token names to replace hardcoded values |
| `.claude/rules/typescript-patterns.md` | Token rule, forwardRef pattern |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-06 | list-all-files-components-directory | User request: list all files in components directory --- | [history](.specstory/history/2026-03-06_16-49-24Z-list-all-files-in.md) | <!-- 916f654b-77ad-4233-86c1-f9d0765bd229 -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
