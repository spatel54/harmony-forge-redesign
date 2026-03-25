# CONTEXT.md — specs/

*JTBD specification documents. The contract between Superman and the loop. Specs define what "done" means — observable user outcomes with testable acceptance criteria.*

---

## Ontology

| Term | Definition |
|---|---|
| **Spec** | A document that defines what a user should be able to do when a feature is complete — observable outcomes, not implementation steps |
| **JTBD** | Job to Be Done — the framing for each spec: "A composer opens HarmonyForge and can [observable result]" |
| **Acceptance Criterion (AC)** | A single, testable pass/fail condition — one checkbox per AC |
| **`[x]`** | Done and compliant |
| **`[~]`** | Partially implemented — gaps noted inline |
| **`[ ]`** | Not started |
| **`[!]`** | Exists but violates a constraint — must fix before shipping |

---

## Decisions

- **Specs written before code** (Gear 1): No implementation begins without a reviewed spec. The planner reads specs to write `IMPLEMENTATION_PLAN.md`.
- **Specs are the loop's contract**: The loop is only accountable to what the ACs define. A vague AC produces vague output.
- **ACs are checkboxes, not prose**: If an AC requires human judgment to evaluate, it belongs in `src/lib/llm-review.ts` as an LLM-as-judge call.

---

## Patterns

- Spec file naming: `NNN-kebab-case-feature.md` (zero-padded three digits)
- Status key at top of every spec (the four checkbox types above)
- Each AC section: numbered (`AC-001`, `AC-002`), with existing file references and status markers
- JTBD format: "A [user] opens HarmonyForge and [observable outcome]"

---

## Policies

- **No implementation details in specs** — "what", not "how"
- **Never delete an AC** — mark as `[x]` when done; `[!]` when violated
- **ACs must be verifiable without human judgment** (or delegate to `llm-review.ts`)
- **Vague ACs are broken ACs** — "looks good" is not an AC; "VexFlow renders four staves at distinct y-positions" is

---

## Files

| File | Scope | Status |
|---|---|---|
| `001-satb-sandbox.md` | Phase 2–4 — full Tactile Sandbox feature set | Active — Phase 2 in progress |

---

## Research

| Resource | Purpose |
|---|---|
| `docs/context-engineering-guide.md` | Spec and JTBD definitions, common mistakes |
| `PROMPT_plan.md` | The planner reads this directory to generate `IMPLEMENTATION_PLAN.md` |
| `docs/notes/prompting-guide.md` | Stage 5 — how to write a new spec |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-09 | user-opened-file-temp-readonly | Task: Introduce a single new token --sonata-accent-accessible in globals · Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+69 more) · Constraint enforced: Only globals.css changes — no component files touched · Constraint enforced: --sonata-accent: #ffb300 is preserved; only the two WCAG-critical usages are · Agent (claude-sonnet-4-6 2026-03-09 09:13:09Z) All 9 files created and verified. | [history](.specstory/history/2026-03-09_08-19-49Z-your-task-is-to.md) | <!-- d8ed8743-2cb1-4aa0-be80-c6d18b6b1381 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+4 more) | [history](.specstory/history/2026-03-10_08-59-04Z-you-are-a-context.md) | <!-- 8eed7d8a-a9ea-422c-bdd1-86027780f9f2 -->
| 2026-03-10 | user-selected-lines-users-shivpat | Task: `, and `<constraints>` XML structured blocks · Modified files: docs/quick-start.md, docs/context-engineering-guide.md · Constraint enforced: ` XML structured blocks · Constraint enforced: 194→- Derives touched directories from the collected paths · Agent (claude-sonnet-4-6 2026-03-10 09:24:43Z) That error confirms you're still in Ollama mode — Ollama doesn't have a model named claude-sonnet-4-6 . | [history](.specstory/history/2026-03-10_09-22-25Z-how-do-i-exit.md) | <!-- 5cc4504e-d1aa-4082-8d96-c6087a1dca01 -->
| 2026-03-10 | most-recent-explicit-guidance-superman | Task: (1) Run `bash scripts/specstory-to-context · Modified files: src/store/useUploadStore.ts, src/store/useEnsembleStore.ts, src/store/useSandboxStore.ts (+32 more) · Constraint enforced: Planning phase only — zero source code generated · Constraint enforced: Tasks scoped to single component/hook, completable in one context window · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-10_15-57-11Z-the-most-recent-explicit.md) | <!-- 817084a8-8da2-4624-933e-639945f36647 -->
| 2026-03-10 | user-opened-file-users-shivpat | Modified files: specs/001-satb-sandbox.md, docs/adr/overview.md, specs/002-theory-tags.md (+5 more) · Skills (invoked with /skill-name ) are extensible workflows you or Claude can create: - Stored in . · Best for straightforward tasks like simple refactors or basic explanations. · Recommended for complex architectural decisions, challenging bugs, or multi-step implementation planning. · On other models (Haiku, older Sonnet/Opus versions), thinking uses a fixed budget instead. | [history](.specstory/history/2026-03-10_15-28-35Z-https-notebooklm-google-com.md) | <!-- a2ca65f7-c568-41ba-bae9-03420179d99a -->
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
| 2026-03-17 | user-selected-lines-users-shivpat | It answers: What does this feature do, from the user's perspective? | [history](.specstory/history/2026-03-17_18-40-35Z-explain-adr-versus-spec.md) | <!-- f9b2931c-8226-4a5a-88b9-b952dea278ec -->
