# CONTEXT.md — src/lib/

*Utilities, adapters, and stubs. Pure TypeScript — no React components, no Zustand stores, no DOM access.*

---

## Ontology

| Term | Definition |
|---|---|
| **Utility** | A pure function with no side effects — `utils.ts` exports `cn()` for class merging |
| **Adapter** | A typed interface between a third-party API and the HarmonyForge domain — e.g., a Tone.js scheduling adapter |
| **Stub** | A typed placeholder that throws `not implemented` — `llm-review.ts` is a stub until a visual AC requires it |
| **LLM-as-Judge** | The pattern of using a multimodal model to evaluate subjective acceptance criteria (screenshot → pass/fail) |

---

## Decisions

- **`llm-review.ts` is a stub** (ADR-001 consequence): implemented only when the first acceptance criterion cannot be verified programmatically (e.g., "score canvas renders voices with distinct colors and no overlapping noteheads")
- **`utils.ts` exports `cn()`**: uses `clsx` + `tailwind-merge` — the single class merging utility for the entire project

---

## Patterns

- All lib functions are pure (no side effects at module load, no global state mutation)
- All lib exports are typed — no `any`, explicit return types on all public functions
- Subdirectory organization: `audio/` for Tone.js adapters, `music/` for data structures, `theory/` for display helpers

---

## Policies

- **No React hooks** in `lib/` — hooks live in `src/hooks/` (when created) or co-located with components
- **No Zustand store imports** in `lib/` — lib is framework-agnostic utility code
- **No DOM access** — lib functions run in any environment (Node, browser, test runner)
- **No constraint logic** — `src/lib/theory/` holds display helpers only; detection logic is backend-only

---

## Files

| File | Purpose |
|---|---|
| `utils.ts` | `cn()` class merging utility (`clsx` + `tailwind-merge`) |
| `llm-review.ts` | LLM-as-judge stub — not yet implemented |
| `audio/` | Tone.js symbolic scheduling adapters (empty — Phase 2) |
| `music/` | Music data structures and factory functions (`noteFactory.ts`) |
| `theory/` | Frontend theory display helpers (empty — Phase 3) |

---

## Research

| Resource | Purpose |
|---|---|
| `specs/001-satb-sandbox.md` | AC-001 visual correctness (trigger for `llm-review.ts` implementation) |
| `docs/adr/ADR-001-adopt-ralph-wiggum-loop.md` | Rationale for `llm-review.ts` stub decision |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-04 | user-opened-file-users-shivpat | Modified files: src/components/atoms/ModalOverlay.ts, src/components/atoms/ExportOptionCard.ts, src/components/atoms/ExportSectionHeader.ts (+15 more) · Agent (claude-sonnet-4-6 2026-03-04 11:32:37Z) Agent - sidechain (2026-03-04 11:31:28Z) Explore the project at /Users/shivpat/harmony-forge-redesign. · The system is ready for Phase 2 implementation. | [history](.specstory/history/2026-03-04_11-31-11Z-explore-the-project-at.md) | <!-- 23f49955-3311-427e-9634-8498c7355976 -->
| 2026-03-09 | user-opened-file-temp-readonly | Task: Introduce a single new token --sonata-accent-accessible in globals · Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+69 more) · Constraint enforced: Only globals.css changes — no component files touched · Constraint enforced: --sonata-accent: #ffb300 is preserved; only the two WCAG-critical usages are · Agent (claude-sonnet-4-6 2026-03-09 09:13:09Z) All 9 files created and verified. | [history](.specstory/history/2026-03-09_08-19-49Z-your-task-is-to.md) | <!-- d8ed8743-2cb1-4aa0-be80-c6d18b6b1381 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-03-04 11:32:37Z) Agent - sidechain (2026-03-04 11:31:28Z) Explore the project at /Users/shivpat/harmony-forge-redesign. | [history](.specstory/history/2026-03-10_08-58-47Z-you-are-a-context.md) | <!-- 286aad38-3b01-410a-9b48-f2c1e806f67f -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+4 more) | [history](.specstory/history/2026-03-10_08-59-04Z-you-are-a-context.md) | <!-- 8eed7d8a-a9ea-422c-bdd1-86027780f9f2 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
| 2026-03-10 | user-opened-file-users-shivpat | Modified files: specs/001-satb-sandbox.md, docs/adr/overview.md, specs/002-theory-tags.md (+5 more) · Skills (invoked with /skill-name ) are extensible workflows you or Claude can create: - Stored in . · Best for straightforward tasks like simple refactors or basic explanations. · Recommended for complex architectural decisions, challenging bugs, or multi-step implementation planning. · On other models (Haiku, older Sonnet/Opus versions), thinking uses a fixed budget instead. | [history](.specstory/history/2026-03-10_15-28-35Z-https-notebooklm-google-com.md) | <!-- a2ca65f7-c568-41ba-bae9-03420179d99a -->
| 2026-03-17 | user-selected-lines-users-shivpat | It answers: What does this feature do, from the user's perspective? | [history](.specstory/history/2026-03-17_18-40-35Z-explain-adr-versus-spec.md) | <!-- f9b2931c-8226-4a5a-88b9-b952dea278ec -->
