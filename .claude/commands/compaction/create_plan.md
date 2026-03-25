# FIC: Create Plan

## Purpose

Phase 2 of the Frequent Intentional Compaction (FIC) workflow.

Read the research artifact produced by `/research_codebase` and produce a
concrete, phase-gated implementation plan with exact file paths, code surface
area, and verification steps. After this command completes, run `/compact` so
that Phase 3 (`/implement_plan`) begins with only the plan file in context —
not the full planning conversation.

## Usage

```
/create_plan <topic-or-feature-description>
```

**Example:**

```
/create_plan RedLine tooltip rendering for parallel-fifth violations
```

The topic must match the topic used in the preceding `/research_codebase` call.
This command locates the most recent matching research artifact automatically.

## Artifact Location

Plans are written to:

```
.claude/thoughts/shared/plans/<kebab-slug>.md
```

If a plan for this slug already exists, it is overwritten with the regenerated
plan using the latest research artifact. Plans are idempotent by design.

## Instructions

When this command is invoked, execute the following procedure exactly.

**Step 0 — Antigravity skill search (MANDATORY)**

Before any planning, run:

```bash
python3 references/antigravity-awesome-skills/scripts/search.py "$ARGUMENTS" --limit 5
```

Read the top matching SKILL.md at the returned path. Apply its constraints to
the plan structure and to the `<constraints>` block. Record the skill name for
the artifact header.

**Step 1 — Locate the research artifact**

Derive the kebab-case slug from `$ARGUMENTS`
(e.g., `red-line-tooltip-parallel-fifth`). Search
`.claude/thoughts/shared/research/` for the most recent file whose name
contains that slug (sort by timestamp prefix, descending).

If no matching artifact is found, halt and output exactly:

```
No research artifact found for: $ARGUMENTS
Run /research_codebase <topic> first, then /compact, then retry /create_plan.
```

Read the located artifact completely before proceeding.

**Step 2 — Resolve Open Questions**

The research artifact contains a "Synthesis — Open Questions" section.
For each open question:

- Answer it from the artifact's own evidence (Pattern Inventory, Architecture Map,
  Constraint Checklist), or
- Mark it as a constraint assumption with an explicit stated risk.

Do NOT defer open questions silently. Every one must be addressed before the
plan is written. A silent assumption is a future bug.

**Step 3 — Draft the implementation plan**

Produce the HCI protocol preview:

```xml
<context>
  What is being built, why, and how it fits into the Glass Box architecture.
  Reference the research artifact path.
</context>
<task>
  The specific components, hooks, or types being created or modified.
</task>
<constraints>
  - Stack: Next.js App Router, TypeScript strict mode, Tailwind CSS (Nocturne/Sonata tokens only)
  - No ad-hoc hex values or Tailwind color overrides outside the token system
  - VexFlow DOM manipulation inside useEffect only
  - Tone.js symbolic events only — no AudioContext or raw buffer manipulation
  - All Zustand state changes must be typed — no implicit any
  - Constraint-satisfaction logic stays in the backend — never implemented frontend
  - POUR accessibility: aria-label, keyboard nav, screen-reader annotations on all interactive elements
  - Antigravity skill applied: <skill name from Step 0>
  - [Additional constraints from the research artifact's Constraint Checklist]
</constraints>
<output>
  Enumerated list of every file to be created or modified, with one-line descriptions.
</output>
```

Immediately after the XML block, produce the phased implementation plan.
Use this exact structure for each phase:

```markdown
### Phase N — <Phase Name>

**Files to create or modify (≤4 per phase):**
- `src/exact/path/to/file.ts` — <one-line description of change>

**Implementation steps:**
1. <Concrete step with exact function names, type names, or design token names>
2. ...

**Verification:**
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] <Feature-specific check — e.g., "RedLine tooltip renders on beat 3, measure 5">

**Compaction point:** After Phase N verification passes, run `/compact` then:
  `/implement_plan <topic> phase:<N+1>`
```

Hard constraints on the plan:

- Every file path must be absolute from the repository root
  (e.g., `src/components/canvas/RedLineTooltip.tsx`).
- No phase may contain more than 4 files created or modified (Liu et al. "lost in the
  middle" constraint — CLAUDE.md).
- Every phase ends with an explicit compaction point instruction.
- The confirmation gate (below) must be the final line of this preview.

**Step 4 — End with the confirmation gate**

The final line of the preview reply must be verbatim:

> **Shall I proceed with the implementation as described above? (Yes / No / Request changes)**

Do NOT write the plan artifact until this gate is cleared with "Yes", "Proceed",
or "Approved". If changes are requested, revise the structured block and plan,
then return to the gate.

**Step 5 — Write the plan artifact (after gate cleared)**

Create `.claude/thoughts/shared/plans/` if it does not yet exist.
Write the complete plan to:

```
.claude/thoughts/shared/plans/<slug>.md
```

The plan file must begin with this header:

```markdown
# Plan: <topic>

**Research artifact:** `.claude/thoughts/shared/research/YYYY-MM-DD_HH-MM-SS_<slug>.md`
**Created:** YYYY-MM-DD HH:MM:SS
**Skill applied:** <Antigravity skill name>
**Status:** READY — Phase 1 not started
```

Follow the header immediately with the full plan (XML block + all phase blocks).

**Step 6 — Emit the compaction prompt**

After writing the plan, output exactly this block and stop:

```
Plan written to:
  .claude/thoughts/shared/plans/<slug>.md

Next step: run /compact, then run:
  /implement_plan <topic> phase:1
```

## FIC Rationale

The plan file is the compaction-safe contract between planning and execution.
Each phase ends with a compaction point, so each `/implement_plan` invocation
starts with only the plan (dense, structured) in context — not the full planning
conversation. This prevents the "lost in the middle" degradation that occurs
when implementation spans many turns in one context window (Liu et al., 2023,
as noted in CLAUDE.md).
