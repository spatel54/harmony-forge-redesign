# CONTEXT.md — src/

*Frontend source root. All React components, hooks, stores, utilities, and styles live here. This directory is the entire frontend boundary.*

---

## Ontology

| Term | Definition |
|---|---|
| **Frontend Boundary** | The explicit line: frontend renders, schedules, and surfaces. It never computes music theory. |
| **Component-Driven** | UI is composed of atomic, reusable TypeScript components — no monolithic page files |
| **Strict TypeScript** | `tsconfig.json` has `"strict": true` — no `any`, no implicit `undefined`, explicit interfaces everywhere |
| **Tailwind CSS** | Utility-class-only styling — no CSS-in-JS, no inline styles, no ad-hoc color values |
| **"use client"** | Next.js directive placed at the component level, not the page level, for granular hydration control |
| **Token** | A named CSS custom property from `globals.css` representing a design system value (color, spacing, etc.) |

---

## Decisions

- **App Router (not Pages Router)**: All routes use Next.js App Router conventions (`layout.tsx`, `page.tsx`, route segments)
- **Zustand over Context API**: Selected for performance (selective subscription) and TypeScript ergonomics
- **Tailwind v4 CSS-first**: No `tailwind.config.js` — tokens are declared in `src/app/globals.css` as CSS custom properties
- **Atomic Design**: Components organized as `atoms/` → `molecules/` → `organisms/` with no logic leaking downward

---

## Patterns

- All components: `React.forwardRef` for interactive elements; `cn()` from `src/lib/utils.ts` for class merging
- All props: explicit TypeScript interfaces — never `React.FC<any>` or prop spreading without a type
- All state: reads from Zustand via `useStore(selector)` — components are stateless except for mounting guards
- All VexFlow DOM manipulation: inside `useEffect` only, never in render
- All Tone.js scheduling: symbolic events only via `usePlayback` hook — no `AudioContext` or raw buffer access
- Accessibility: `aria-label`, `aria-pressed`, `role`, and `focus-visible:` classes required on all interactive elements

---

## Policies

- **No constraint logic** — no parallel fifth detection, voice crossing detection, or SATB validation in any `src/` file
- **No ad-hoc hex values** — every color reference must resolve to a `--nocturne-*` or `--sonata-*` token
- **No `any` types** — define explicit interfaces; use `unknown` + type narrowing if the shape is uncertain
- **No direct DOM manipulation** outside of `useEffect` in VexFlow components
- **No raw audio** — `AudioContext`, `createOscillator`, `decodeAudioData`, and similar Web Audio API calls are banned
- **No API calls inside Zustand stores** — stores hold state and synchronous actions only

---

## Research

| Resource | Purpose |
|---|---|
| `.claude/rules/typescript-patterns.md` | Code style, stack constraints, token rules |
| `src/app/globals.css` | All design tokens (Nocturne/Sonata palettes, spacing, radius, shadows) |
| `src/styles/fonts.css` | Font imports (Instrument Serif, Inter, Satoshi) |
| `src/lib/utils.ts` | `cn()` class merging utility |
| `specs/001-satb-sandbox.md` | Acceptance criteria for every component in this directory |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-02 | https:-github.com-ruvnet-ruflo-analyze | Shallow-clone ruvnet/ruflo (--depth 1) into /Users/shivpat/ruflo/ (sibling to harmony-forge-redesign) 2. · Shall I proceed with the implementation as described above? · Recommendation: Do not run npm install inside /Users/shivpat/ruflo/ . · The MCP server is invoked via npx (which runs from the registry, not from this local clone) so no install is needed to use Ruflo. · Agent (claude-sonnet-4-6 2026-03-02 01:06:50Z) Repo is at /Users/shivpat/ruflo/ (shallow, read-only). | [history](.specstory/history/2026-03-02_00-55-08Z-command-message-ui-ux.md) | <!-- d6a8d525-626e-4b50-a9e7-8d7bccfa39a8 -->
| 2026-03-02 | user-opened-file-temp-readonly | Modified files: .claude/rules/typescript-patterns.md, .claude/skills/ui-ux-pro-max/scripts/auto_search.py, .claude/settings.js (+6 more) · task: Assess what the skill actually offers, run its search CLI against HarmonyForge use-cases, and identify which skill capabilities are net-additive vs. · Install report (what uipro init adds to . · Integration recommendation: which skill features to use, which to guard against --- Meta-Rewrite What is the user actually asking for? · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-02_00-57-10Z.md) | <!-- 7287ed76-f923-471b-ab75-2fc62b756a44 -->
| 2026-03-04 | want-export-these-designs-code | Task: Explain the reliable design-to-code export process — tools, workflow order, and · Modified files: src/app/globals.css, src/app/layout.ts, src/app/page.ts (+4 more) · Constraint enforced: Must stay within the existing stack: Next.js App Router, TypeScript, Tailwind v4 · Constraint enforced: Design tokens in the .pen file map to CSS custom properties in globals.css · Agent (claude-sonnet-4-6 2026-03-04 05:21:51Z) The user approved "Start with globals. | [history](.specstory/history/2026-03-04_05-17-28Z-your-task-is-to.md) | <!-- d39e462f-c089-45ef-83ee-296da1b0ddc0 -->
| 2026-03-06 | https:-github.com-pablodelucca-pixel-agents.git | Task: Clone the pixel-agents repository and set it up as a runnable local project: · Constraint enforced: Target directory: sibling to harmony-forge-redesign (e.g., ~/pixel-agents) to · Constraint enforced: avoid polluting this workspace · The extensions directory confirms it — /. · Go back to the Pixel Agents panel — click + Agent button — this spawns a Claude Code terminal and creates a character 6. | [history](.specstory/history/2026-03-06_10-20-54Z.md) | <!-- db51d38a-bc95-4313-843f-1250cb466a26 -->
| 2026-03-09 | how-ensure-context.md-updated-every | Task: (A) Answer: how to ensure CONTEXT · Modified files: docs/notes/prompting-guide.md, docs/context-engineering-guide.md, scripts/specstory-to-context.sh · Constraint enforced: No new files — edit existing docs only · Constraint enforced: Docs live in docs/ — never root folder · Claude Code hook (interactive-session-side) Add a PostToolUse hook in . | [history](.specstory/history/2026-03-09_17-41-05Z-how-do-i-ensure.md) | <!-- 8e2c9b25-37dc-4e57-8ca3-14c9a11e53ef -->
| 2026-03-09 | advanced-context-engineering-decision-records) | Modified files: .claude/rules/context-workflow.md, docs/ontology/CONTEXT.md, docs/patterns/CONTEXT.md (+26 more) · Agent (claude-sonnet-4-6 2026-03-09 18:24:32Z) Agent - sidechain (2026-03-09 18:20:12Z) Explore the HarmonyForge repository at /Users/shivpat/harmony-forge-redesign and map the current structure. · AC-004: Theme Toggle — exists but uses 6 ad-hoc hex values (violates token constraint) 5. · Workflow summary (Three Gears): Gear 1: Specification ← You write specs/ (observable outcomes) ↓ Gear 2: Planning ← Supervised (run planner, review IMPLEMENTATION PLAN. · Stage 0: Check current state ( Read IMPLEMENTATION PLAN. | [history](.specstory/history/2026-03-09_18-13-52Z-advanced-context-engineering-architecture.md) | <!-- 4d2cce03-e6d3-492f-b8f5-6463e5ab25c9 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Shallow-clone ruvnet/ruflo (--depth 1) into /Users/shivpat/ruflo/ (sibling to harmony-forge-redesign) 2. · Shall I proceed with the implementation as described above? · Agent (claude-sonnet-4-6 2026-03-02 01:04:17Z) Tool use: Read /Users/shivpat/ruflo/CLAUDE. · Spawn teammates in background : Use run in background: true for parallel work 636→2. · Create tasks first : Use TaskCreate before spawning teammates so they have work 637→3. | [history](.specstory/history/2026-03-10_08-57-53Z-you-are-a-context.md) | <!-- e0359d9b-5682-4820-a5cf-c114e164db6d -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | task: Assess what the skill actually offers, run its search CLI against HarmonyForge use-cases, and identify which skill capabilities are net-additive vs. · Install report (what uipro init adds to . · Integration recommendation: which skill features to use, which to guard against --- Meta-Rewrite What is the user actually asking for? · Shall I proceed with the implementation as described above? · Agent (claude-sonnet-4-6 2026-03-02 01:07:04Z) Tool use: Bash Search WCAG color contrast guidelines python3 /tmp/uipro-test/. | [history](.specstory/history/2026-03-10_08-57-56Z-you-are-a-context.md) | <!-- 86be8988-f324-4154-b985-e5bc13a67ecc -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Task: Clone the pixel-agents repository and set it up as a runnable local project: · Constraint enforced: Target directory: sibling to harmony-forge-redesign (e.g., ~/pixel-agents) to · Constraint enforced: avoid polluting this workspace · Agent (claude-sonnet-4-6 2026-03-06 10:27:21Z) Tool use: Read . · Run your first skill : 85→ 86→ "Use @brainstorming to plan a SaaS MVP. | [history](.specstory/history/2026-03-10_08-58-53Z-you-are-a-context.md) | <!-- 0b0c58d1-4f4f-43a1-b0d4-bd1ee4fb24eb -->
