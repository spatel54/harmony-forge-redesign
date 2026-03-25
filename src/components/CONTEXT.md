# CONTEXT.md — src/components/

*Component library root. All UI building blocks live here, organized by Atomic Design: atoms → molecules → organisms.*

---

## Ontology

| Term | Definition |
|---|---|
| **Atom** | The smallest indivisible UI element — a button, icon, chip, toggle. Stateless beyond mounting. |
| **Molecule** | A compound of atoms serving a single user task — a playback bar, a violation card, a step navigator |
| **Organism** | A full UI section that may own layout and store reads — the score canvas, the Theory Inspector panel, the sandbox header |
| **`cn()`** | The class name merging utility from `src/lib/utils.ts` — always use this for conditional Tailwind classes |
| **`forwardRef`** | React pattern for exposing a ref on interactive elements — required for atoms and molecules that wrap native elements |
| **Display Name** | `ComponentName.displayName = "ComponentName"` — required on every `forwardRef` component for DevTools readability |

---

## Decisions

- **Atomic Design (not feature-based folders)**: Components are organized by complexity, not by screen. This prevents coupling and enables composition.
- **No index barrel exports**: Import directly from the component file path — avoids circular dependency and tree-shaking issues
- **`cn()` over string concatenation**: All conditional class logic goes through `cn()` to preserve Tailwind's PurgeCSS compatibility

---

## Patterns

- File naming: `PascalCase.tsx` — one component per file
- Export pattern: named export (not default) — `export const MyComponent = ...`
- Props: explicit interface `interface MyComponentProps extends React.HTMLAttributes<HTMLElement>`
- Class merging: `className={cn("base-classes", conditionalClass && "conditional", className)}`
- Interactive elements: always include `aria-label` and `focus-visible:` Tailwind class

---

## Policies

- **No business logic in any component** — components render state; they do not compute it
- **No direct Zustand store mutations in atoms** — atoms receive callbacks via props
- **No hardcoded hex values anywhere** — every color must resolve to a Nocturne/Sonata token
- **No VexFlow in atoms or molecules** — VexFlow DOM manipulation belongs in organisms only
- **No API calls** — components are purely presentational; data fetching belongs in hooks or server components

---

## Research

| Resource | Purpose |
|---|---|
| `.claude/rules/typescript-patterns.md` | Code style, prop typing, token rules |
| `src/lib/utils.ts` | `cn()` implementation |
| `src/app/globals.css` | All available design tokens |
| `specs/001-satb-sandbox.md` | Acceptance criteria that map to specific components |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | want-export-these-designs-code | Task: Explain the reliable design-to-code export process — tools, workflow order, and · Modified files: src/app/globals.css, src/app/layout.ts, src/app/page.ts (+4 more) · Constraint enforced: Must stay within the existing stack: Next.js App Router, TypeScript, Tailwind v4 · Constraint enforced: Design tokens in the .pen file map to CSS custom properties in globals.css · Agent (claude-sonnet-4-6 2026-03-04 05:21:51Z) The user approved "Start with globals. | [history](.specstory/history/2026-03-04_05-17-28Z-your-task-is-to.md) | <!-- d39e462f-c089-45ef-83ee-296da1b0ddc0 -->
| 2026-03-04 | user-opened-file-users-shivpat | Task: Wire up click-to-upload on ScoreDropzone and route to /document after a file is accepted · Modified files: src/components/atoms/LogoLockup.ts, src/components/atoms/PartChip.ts, src/components/molecules/StepBar.ts (+23 more) · Constraint enforced: Next.js App Router — use router.push('/document'), no server action needed. Input type=file accepts PDF/XML/MIDI. Symbolic only — no audio processing. No new store yet. State is local/transient at this stage. · Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. · Agent (claude-sonnet-4-6 2026-03-04 09:44:55Z) Markdown lint warnings on the plan file — these are style-only, no impact on implementation. | [history](.specstory/history/2026-03-04_09-38-16Z-explore-the-codebase-at.md) | <!-- e5649f80-04cd-45c9-b587-a278c7dbbccd -->
| 2026-03-04 | user-opened-file-users-shivpat | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. · Design Token Injection All colors use CSS custom properties ( var(--hf-bg) , var(--hf-accent) , etc. · Client Component Boundaries Components requiring theme or state hooks ( ThemeToggle , EnsembleBuilderPanel , ScoreDropzone ) marked "use client" . · Hydration-Safe : Theme toggle uses useEffect to prevent SSR mismatch. · Store is Empty : Zustand is installed but unused. | [history](.specstory/history/2026-03-04_11-13-32Z-explore-the-users-shivpat.md) | <!-- 40341308-b464-47ca-8410-69350b48c821 -->
| 2026-03-04 | tool-result-get-variables-calling | User request: Tool result of get variables . Calling get variables is not necessary anymore. {"variables":{"nocturne-accent":{"type":"color","value":" FFB300"},"noc | [history](.specstory/history/2026-03-04_11-34-12Z.md) | <!-- d602340c-3a40-4692-ad87-1337653ddde7 -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 09:39:32Z) Agent - sidechain (2026-03-04 09:39:11Z) Explore the codebase at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-35Z-you-are-a-context.md) | <!-- 3921f461-d452-4160-96c6-9604b82a65ab -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:16:28Z) Agent - sidechain (2026-03-04 11:14:14Z) Explore the /Users/shivpat/harmony-forge-redesign/src directory. | [history](.specstory/history/2026-03-10_08-58-44Z-you-are-a-context.md) | <!-- 99082051-ed6d-4930-a506-c1105cd88498 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | User request: You are a context distiller for the HarmonyForge project (Next.js, TypeScript, VexFlow, Tone.js, Zustand). Read the session transcript below. Return a | [history](.specstory/history/2026-03-10_08-58-50Z-you-are-a-context.md) | <!-- a398becb-2124-4e86-a892-3444ecea2340 -->
| 2026-03-10 | user-selected-lines-users-shivpat | Task: `, and `<constraints>` XML structured blocks · Modified files: docs/quick-start.md, docs/context-engineering-guide.md · Constraint enforced: ` XML structured blocks · Constraint enforced: 194→- Derives touched directories from the collected paths · Agent (claude-sonnet-4-6 2026-03-10 09:24:43Z) That error confirms you're still in Ollama mode — Ollama doesn't have a model named claude-sonnet-4-6 . | [history](.specstory/history/2026-03-10_09-22-25Z-how-do-i-exit.md) | <!-- 5cc4504e-d1aa-4082-8d96-c6087a1dca01 -->
| 2026-03-10 | user-opened-file-users-shivpat | Modified files: specs/001-satb-sandbox.md, docs/adr/overview.md, specs/002-theory-tags.md (+5 more) · Skills (invoked with /skill-name ) are extensible workflows you or Claude can create: - Stored in . · Best for straightforward tasks like simple refactors or basic explanations. · Recommended for complex architectural decisions, challenging bugs, or multi-step implementation planning. · On other models (Haiku, older Sonnet/Opus versions), thinking uses a fixed budget instead. | [history](.specstory/history/2026-03-10_15-28-35Z-https-notebooklm-google-com.md) | <!-- a2ca65f7-c568-41ba-bae9-03420179d99a -->
