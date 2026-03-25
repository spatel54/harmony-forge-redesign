# CONTEXT.md — docs/adr/

*Architecture Decision Records. Permanent, immutable logs of why technical decisions were made. The audit trail that answers "why" for all time.*

---

## Ontology

| Term | Definition |
|---|---|
| **ADR** | Architecture Decision Record — one document per architectural decision; records context, options, rationale, and consequences |
| **Status: Proposed** | Draft — not yet binding; may be changed or withdrawn |
| **Status: Accepted** | In effect — rationale, options, and consequences are frozen; only status line may be edited |
| **Status: Superseded by ADR-NNN** | Replaced — old record preserved as-is; new ADR references it |
| **Status: Deprecated** | No longer relevant — not replaced |
| **Supersede** | The only correct way to "update" a decision: write a new ADR, freeze the old one |
| **Decision Driver** | The forcing function that made the decision necessary |
| **Consequence** | The observable outcome (positive or negative) of adopting the decision |

---

## Decisions

- **ADR-001**: Adopt Ralph Wiggum Loop as primary autonomous execution pattern — [Accepted](ADR-001-adopt-ralph-wiggum-loop.md)

---

## Patterns

- File naming: `ADR-NNN-kebab-case-title.md` (zero-padded three digits)
- Template: use `template.md` for every new ADR
- After writing a new ADR: update `overview.md` index immediately
- Status line format: `**Status:** Accepted` — bold, on line 4 of the file

---

## Policies

- **Never edit rationale, options, or consequences of an Accepted ADR**
- **Never delete an ADR** — change status to Superseded or Deprecated only
- **Supersede, don't patch**: when a decision changes, write ADR-NNN+1 that explicitly states "Supersedes ADR-NNN"
- **One decision per ADR** — compound decisions get separate records

---

## Files

| File | Purpose |
|---|---|
| `overview.md` | ADR index — all ADRs with status, date, and owners |
| `template.md` | Canonical Master template for new ADRs |
| `ADR-001-adopt-ralph-wiggum-loop.md` | First ADR — Ralph Wiggum Loop adoption (Accepted) |

---

## Research

| Resource | Purpose |
|---|---|
| `docs/context-engineering-guide.md` | ADR Lifecycle section, Supersede definition |
| `docs/notes/prompting-guide.md` | Stage 6 — how to write an ADR via prompt |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-09 | user-opened-file-temp-readonly | Task: Introduce a single new token --sonata-accent-accessible in globals · Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+69 more) · Constraint enforced: Only globals.css changes — no component files touched · Constraint enforced: --sonata-accent: #ffb300 is preserved; only the two WCAG-critical usages are · Agent (claude-sonnet-4-6 2026-03-09 09:13:09Z) All 9 files created and verified. | [history](.specstory/history/2026-03-09_08-19-49Z-your-task-is-to.md) | <!-- d8ed8743-2cb1-4aa0-be80-c6d18b6b1381 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+4 more) | [history](.specstory/history/2026-03-10_08-59-04Z-you-are-a-context.md) | <!-- 8eed7d8a-a9ea-422c-bdd1-86027780f9f2 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
| 2026-03-10 | user-selected-lines-users-shivpat | Task: `, and `<constraints>` XML structured blocks · Modified files: docs/quick-start.md, docs/context-engineering-guide.md · Constraint enforced: ` XML structured blocks · Constraint enforced: 194→- Derives touched directories from the collected paths · Agent (claude-sonnet-4-6 2026-03-10 09:24:43Z) That error confirms you're still in Ollama mode — Ollama doesn't have a model named claude-sonnet-4-6 . | [history](.specstory/history/2026-03-10_09-22-25Z-how-do-i-exit.md) | <!-- 5cc4504e-d1aa-4082-8d96-c6087a1dca01 -->
| 2026-03-10 | most-recent-explicit-guidance-superman | Task: (1) Run `bash scripts/specstory-to-context · Modified files: src/store/useUploadStore.ts, src/store/useEnsembleStore.ts, src/store/useSandboxStore.ts (+32 more) · Constraint enforced: Planning phase only — zero source code generated · Constraint enforced: Tasks scoped to single component/hook, completable in one context window · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-10_15-57-11Z-the-most-recent-explicit.md) | <!-- 817084a8-8da2-4624-933e-639945f36647 -->
| 2026-03-10 | user-opened-file-users-shivpat | Modified files: specs/001-satb-sandbox.md, docs/adr/overview.md, specs/002-theory-tags.md (+5 more) · Skills (invoked with /skill-name ) are extensible workflows you or Claude can create: - Stored in . · Best for straightforward tasks like simple refactors or basic explanations. · Recommended for complex architectural decisions, challenging bugs, or multi-step implementation planning. · On other models (Haiku, older Sonnet/Opus versions), thinking uses a fixed budget instead. | [history](.specstory/history/2026-03-10_15-28-35Z-https-notebooklm-google-com.md) | <!-- a2ca65f7-c568-41ba-bae9-03420179d99a -->
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
| 2026-03-12 | when-write-adr,-when-write | User request: When to write an ADR, when to write a spec --- | [history](.specstory/history/2026-03-12_21-22-55Z.md) | <!-- 3aa7c995-2127-4de9-8b19-b85a72489f1e -->
| 2026-03-17 | user-selected-lines-users-shivpat | It answers: What does this feature do, from the user's perspective? | [history](.specstory/history/2026-03-17_18-40-35Z-explain-adr-versus-spec.md) | <!-- f9b2931c-8226-4a5a-88b9-b952dea278ec -->
