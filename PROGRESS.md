# PROGRESS.md — HarmonyForge Session Learning Log

Living record of session-by-session progress, gap discoveries, and key learnings.
**Not** a task list (→ `IMPLEMENTATION_PLAN.md`) or correction log (→ `docs/notes/journey.md`).

---

## [2026-03-10] — Context Engineering Gap Analysis & Remediation

**Session goal:** Reorganize repo to follow advanced context engineering principles.
**Workflow used:** FIC (Phase 0: Research → Phase 1: Plan → Phase 2: Implement)

### Key Finding

The context engineering scaffold is **already well-built**. This was a context *population* task,
not a restructure. The Three Gears workflow was blocked by 3 critical gaps, not by missing structure.

### Gap Analysis Results

| Gap | Priority | Status |
|---|---|---|
| `IMPLEMENTATION_PLAN.md` empty | ★ CRITICAL | Open — requires `cat PROMPT_plan.md \| claude -p` on a feature branch |
| Landing page spec missing | ★ HIGH | ✅ Fixed — `specs/002-landing-page.md` written |
| Document page spec missing | ★ HIGH | ✅ Fixed — `specs/003-document-page.md` written |
| ADR backlog (6 decisions undocumented) | ★ HIGH | ✅ Fixed — ADR-002 through ADR-007 drafted |
| `src/` session insights stale | ▲ MEDIUM | Open — run `bash scripts/specstory-to-context.sh` |
| `src/lib/` CONTEXT.md files unverified | ▲ MEDIUM | ✅ Verified — all 3 are populated |
| `public/` + `scripts/` CONTEXT.md unverified | ▼ LOW | ✅ Verified — both populated |

### What Was Written This Session

| File | Action | Purpose |
|---|---|---|
| `specs/002-landing-page.md` | Created | JTBD + 6 ACs for landing page |
| `specs/003-document-page.md` | Created | JTBD + 4 ACs for document review page |
| `docs/adr/ADR-002-adopt-tailwind-v4-css-first.md` | Created | Documents CSS-first token architecture |
| `docs/adr/ADR-003-adopt-atomic-design-component-organization.md` | Created | Documents atoms/molecules/organisms hierarchy |
| `docs/adr/ADR-004-adopt-zustand-for-editor-state.md` | Created | Documents Zustand over Context API |
| `docs/adr/ADR-005-adopt-nextjs-app-router.md` | Created | Documents App Router over Pages Router |
| `docs/adr/ADR-006-adopt-symbolic-only-media-constraint.md` | Created | Documents no-AudioContext constraint |
| `docs/adr/ADR-007-add-sonata-accent-accessible-wcag-token.md` | Created | Documents WCAG remediation token |
| `docs/adr/overview.md` | Updated | ADR-002 through ADR-007 added to registry |
| `PROGRESS.md` | Created | This file |
| `.claude/thoughts/shared/research/2026-03-10_context-engineering-gap-analysis.md` | Created | FIC Phase 0 research artifact |

### What Remains (Next Session)

1. **Populate `IMPLEMENTATION_PLAN.md`**: `git checkout -b feature/phase-2-sandbox && cat PROMPT_plan.md | claude -p`
2. **Run specstory distillation**: `bash scripts/specstory-to-context.sh` (dry-run first)
3. **Verify AC-004 token fix proposal** with Superman before the planner generates a task for it

### Learnings

- `scripts/CONTEXT.md` was missing `specstory-to-context.sh` and `specstory_analyze.py` from its file inventory — updated
- `src/lib/audio/`, `src/lib/music/`, `src/lib/theory/` CONTEXT.md files are all well-populated — no stubs
- `public/CONTEXT.md` and `scripts/CONTEXT.md` are populated — no action needed
- The specstory Stop hook fires after each session; if not running via `specstory run claude`, run `specstory sync` manually after closing the session

---

## [2026-03-10 Session 2] — Phase 2 Implementation: TASK-A16 through TASK-A21

**Session goal:** Execute Phase 2A–2E tasks from `IMPLEMENTATION_PLAN.md` sequentially.
**Workflow used:** Chat (supervised, one task per turn, preview → gate → execute).

### Tasks Completed

| Task | File(s) | Status |
|---|---|---|
| TASK-A16 | `EnsembleBuilderPanel.tsx` | ✅ aria-disabled + pointer-events-none when no valid upload |
| TASK-A17 | `DocumentView.tsx` (new), `document/page.tsx` (Server Component) | ✅ metadata export + redirect guard |
| TASK-A18 | `ThemeToggle.tsx` | ✅ aria-label + aria-pressed corrected |
| TASK-A18b | `ThemeToggle.tsx` | ✅ All 6 ad-hoc hex values replaced with Nocturne/Sonata tokens |
| TASK-A19 | `ScoreCanvas.tsx` (major rewrite), `ADR-009` (new) | ✅ VexFlow dynamic import, ResizeObserver, SSR-safe |
| TASK-A20 | `ScoreCanvas.tsx` | ✅ Note rendering from static data via Formatter.FormatAndDraw |
| TASK-A21 | `useScoreStore.ts` (new), `ScoreCanvas.tsx` | ✅ NoteData[] Zustand slice, ScoreCanvas reads from store |

### Tasks In Progress / Next

- **TASK-A22** (in preview, awaiting approval): `src/lib/audio/usePlayback.ts` — Tone.js Transport hook
- **TASK-A23**: Wire `SandboxPlaybackBar` to `usePlayback` + aria attributes
- **TASK-A24**: RedLineTooltip [BLOCKED: backend JSON TBD]
- **TASK-A25**: ScorePaginationDock (floating, keyboard nav)
- **TASK-A26**: Score Maximize (expand/collapse + Escape key)

### Key Decisions

- **ADR-009**: VexFlow uses dynamic `import('vexflow')` inside `useEffect` — SSR-safe, code-split, ResizeObserver responsive
- **DocumentView.tsx pattern**: Client logic extracted from Server Component pages (same as HomeView.tsx) to enable Next.js `metadata` export
- **Violation overlays**: Ad-hoc hex colors (`#1976D2`, `#FFB300`) in ScoreCanvas replaced with semantic tokens during VexFlow rewrite

### Learnings

- VexFlow `Formatter.FormatAndDraw` handles Voice creation internally — no need to construct `Voice` objects manually for single-voice-per-stave rendering
- `subscribeWithSelector` middleware required on `useScoreStore` for selective re-render without polling
- Server Component boundary: `metadata` export requires the page file to have no `"use client"` — always extract to a `*View.tsx` sibling

---

## [2026-03-10 Session 3] — TASK-A22 through TASK-A26: Playback hook, wired playbar, pagination dock, score maximize + /wrap command

**Session goal:** Complete Phase 2E (Sandbox Core): Tone.js playback hook, SandboxPlaybackBar wiring, ScorePaginationDock, score maximize toggle. Also created `/wrap` session-close command.
**Workflow used:** Chat (supervised, preview → gate → execute).

### Tasks Completed

| Task | File(s) | Status |
|---|---|---|
| /wrap command | `.claude/commands/wrap.md` | ✅ Session-close automation (specstory + CONTEXT.md + PROGRESS.md + tsc) |
| TASK-A22 | `src/lib/audio/usePlayback.ts` (new) | ✅ Tone.js Transport hook — `play()`, `pause()`, `stop()`; dynamic import; stable refs |
| TASK-A23 | `src/components/molecules/SandboxPlaybackBar.tsx` | ✅ Wired to `usePlayback` + `useSandboxStore`; aria-label + aria-pressed |
| TASK-A25 | `src/components/molecules/ScorePaginationDock.tsx` (new) | ✅ Floating pill, ArrowLeft/Right keyboard, aria-live |
| TASK-A26 | `src/store/useSandboxStore.ts`, `SandboxHeader.tsx`, `sandbox/page.tsx` | ✅ isExpanded + Maximize2/Minimize2 button + Escape key handler |

### Tasks In Progress / Next

- **TASK-A24** (blocked): RedLineTooltip — waiting on backend violation JSON shape
- **TASK-A27** (Phase 3 deferred): TheoryTagList component
- **TASK-A28** (Phase 4 deferred): Hover/focus state audit

### Key Decisions

- **usePlayback stable-refs pattern**: `useRef` wrapping store actions + callbacks so `scheduleRepeat` closure never goes stale without re-registering the event — avoids the "stale closure in Tone.js" footgun
- **SandboxPlaybackBar removed `isPlaying`/`onPlayPause` props**: molecule now owns its playback wiring internally (reads store + calls hook); sandbox/page.tsx orphaned local `isPlaying` state cleaned up
- **ScorePaginationDock keydown on `document`**: global listener with INPUT/TEXTAREA guard — matches Apple Music / Keynote paging convention

### Learnings

- Tone.js 15.x uses `getTransport()` (not `Tone.Transport` static) — confirmed from package.json version 15.1.22
- `play()` must be `async` and await `Tone.start()` to satisfy browser autoplay policy; the button click event is the required user gesture
- `scheduleRepeat` returns a numeric ID — cancel with `transport.cancel()` (clears all events), not by ID, since we clear everything on stop anyway
- `/wrap` works correctly as a Claude Code custom command — executed as skill, no args needed

---

## [2026-03-12 Session 4] — Dev server unblocked: Tailwind v4 / Turbopack CSS parse fix

**Session goal:** Get the Next.js 16.1.6 development server running after a Tailwind v4 + Turbopack CSS parsing error blocked all page compilation.
**Workflow used:** Chat (iterative diagnosis → targeted fix)

### Tasks Completed

| Task | File(s) | Status |
|---|---|---|
| Kill stale dev lock | `.next/dev/lock` removed | ✅ Cleared lock held by orphaned process |
| Diagnose CSS parse error | `src/app/globals.css`, `node_modules/tailwindcss` | ✅ Root-caused to Tailwind v4.2.x generating `.font-[family-name:var(...)]` template class |
| Move `--font-*` out of `@theme` | `src/app/globals.css` | ✅ Font vars now in `:root {}` to avoid Tailwind utility class generation |
| Add manual `.font-sans` class | `src/app/globals.css` | ✅ Replaces Tailwind built-in (reset with `--font-sans: initial` in `@theme`) |
| Replace `postcss.config.mjs` with CJS | `postcss.config.js` (new) | ✅ CJS format; adds `removeBrokenFontTemplate` plugin to strip broken class post-Tailwind |
| Server verified 200 | `http://localhost:3000` | ✅ HTTP 200, no CSS errors, tsc passes |

### Tasks In Progress / Next

- **TASK-A24** (still blocked): RedLineTooltip — waiting on backend violation JSON shape
- **Dev server**: running on localhost:3000 (Turbopack, port 3000 free)

### Key Decisions

- **PostCSS plugin must use CSS-escaped selector match**: Tailwind stores the selector as `.font-\[family-name\:var\(\.\.\.\)\]` in the PostCSS AST — check for `\\(\\.\\.\\.\\)` not `var(...)`.
- **Turbopack bypasses PostCSS for its own Tailwind transform**: Only the plugins in `postcss.config.js` that run in Next.js's PostCSS chain are applied. Turbopack does NOT use the plugin for its native Tailwind path, so the plugin must catch output after `@tailwindcss/postcss` transforms.
- **Webpack (`next dev --webpack`) broken in Next.js 16.1.6**: `/_app` error in App Router — webpack path not maintained. Turbopack is the only viable dev runtime.

### Learnings

- Tailwind v4.2.x generates `.font-[family-name:var(...)]` as a CSS variable shorthand template class for **every** run — it is not triggered by user `@theme` variables alone. Always present when using `@import "tailwindcss"` with Turbopack.
- `--font-*` in `@theme` is Tailwind's reserved namespace for font-family utilities. Any value there causes the template class generation, even with `initial`.
- PostCSS plugin selector matching must handle CSS escape sequences. `var(...)` in a class selector is stored as `var\(\.\.\.\)` in the PostCSS Rule AST.
- `postcss.config.mjs` (ESM) causes "Malformed PostCSS Configuration" in webpack context (next/font-loader). Use `postcss.config.js` (CJS) for maximum compatibility.
