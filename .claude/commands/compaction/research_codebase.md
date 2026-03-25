# FIC: Research Codebase

## Purpose

Phase 1 of the Frequent Intentional Compaction (FIC) workflow.

Conduct a thorough, subagent-driven exploration of the codebase for the given
topic. Produce a structured research artifact that survives context compaction.
After this command completes, run `/compact` so that Phase 2 (`/create_plan`)
begins with a dense, clean context rather than a full conversation history.

## Usage

```
/research_codebase <topic-or-feature-description>
```

**Example:**

```
/research_codebase RedLine tooltip rendering for parallel-fifth violations
```

## Artifact Location

Artifacts are written to:

```
.claude/thoughts/shared/research/YYYY-MM-DD_HH-MM-SS_<slug>.md
```

The timestamp prefix guarantees uniqueness and allows multiple research passes
for the same topic to coexist without overwriting earlier findings.

## Instructions

When this command is invoked, execute the following procedure exactly.

**Step 0 — Antigravity skill search (MANDATORY)**

Before any exploration, run:

```bash
python3 references/antigravity-awesome-skills/scripts/search.py "$ARGUMENTS" --limit 5
```

Read the top matching SKILL.md at the returned path. Apply its constraints and
patterns throughout all research steps. Record the skill name for the artifact header.

**Step 1 — Spawn parallel research subagents**

Spawn all of the following subagents in a SINGLE message using `run_in_background: true`.
Do NOT check status after spawning — wait for all results before proceeding.

- **Agent A — Architecture Surveyor**: Map the top-level directory structure.
  Identify all modules, components, hooks, and Zustand store slices related to
  the topic `$ARGUMENTS`. Trace import graphs and data-flow paths. Output a
  component tree and data-flow summary with exact file paths.

- **Agent B — Pattern Miner**: Use Glob and Grep to find all existing
  implementations, TypeScript type definitions, hooks, utility functions, and
  design token usage in `src/app/globals.css` that are relevant to `$ARGUMENTS`.
  Identify naming conventions and file-naming patterns. Output a pattern inventory
  with file paths and line-number references.

- **Agent C — Constraint Auditor**: Read `.claude/rules/music-theory.md`,
  `.claude/rules/typescript-patterns.md`, `.claude/rules/hci-protocol.md`,
  `.claude/rules/output-completeness.md`, and `CLAUDE.md`. Extract every
  constraint that applies to the feature area described in `$ARGUMENTS`.
  Output a constraint checklist with the rule source file cited for each item.

- **Agent D — Test and Build Scanner**: Scan the `/tests` directory (if present),
  check `package.json` scripts, and identify existing test coverage relevant to
  the topic. Note any build dependencies or configuration that the feature would
  need to respect. Output a test coverage map and build dependency notes.

**Step 2 — Collect and synthesize**

After all four agents return, synthesize their outputs into a unified view.
Do not discard any finding — completeness is required per `.claude/rules/output-completeness.md`.
If agent outputs conflict (e.g., Agent A and Agent B identify different canonical
locations for the same functionality), record both and flag the conflict in the
Open Questions section.

**Step 3 — Write the research artifact**

Compute the current timestamp. Derive a kebab-case slug from `$ARGUMENTS`
(e.g., `red-line-tooltip-parallel-fifth`). Write the artifact to:

```
.claude/thoughts/shared/research/YYYY-MM-DD_HH-MM-SS_<slug>.md
```

Create `.claude/thoughts/shared/research/` if it does not yet exist.

The artifact must use this exact structure — no sections may be omitted:

```markdown
# Research: <topic>

**Date:** YYYY-MM-DD HH:MM:SS
**Topic:** <$ARGUMENTS verbatim>
**Skill applied:** <name of Antigravity skill read in Step 0>

## Architecture Map
<Agent A output — component tree and data-flow summary with exact file paths>

## Pattern Inventory
<Agent B output — file paths and line-number references required for every item>

## Constraint Checklist
<Agent C output — each constraint cited with its rule source file>

## Test Coverage Map
<Agent D output — coverage gaps and build dependency notes>

## Synthesis — Open Questions
<List every ambiguity, gap, or conflict that the /create_plan phase must resolve.
If there are none, write "None identified.">

## Recommended Next Step
Run `/create_plan <topic>` and reference this file at:
`.claude/thoughts/shared/research/YYYY-MM-DD_HH-MM-SS_<slug>.md`
```

**Step 4 — Emit the compaction prompt**

After writing the artifact, output exactly this block and stop:

```
Research artifact written to:
  .claude/thoughts/shared/research/YYYY-MM-DD_HH-MM-SS_<slug>.md

Next step: run /compact, then run:
  /create_plan <topic>
```

## FIC Rationale

Running `/compact` after research discards conversation noise (tool call logs,
grep output, glob results) and compresses what remains. The research artifact is
the durable, compaction-safe knowledge base. `/create_plan` reads the artifact
file directly — it does not depend on what survived the context window — so the
plan is built from verified, persisted findings rather than degraded recall.
