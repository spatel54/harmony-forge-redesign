# FIC: Implement Plan

## Purpose

Phase 3 of the Frequent Intentional Compaction (FIC) workflow.

Read the plan artifact produced by `/create_plan`, execute exactly one phase,
run verification, update the plan artifact status, and then emit a compaction
prompt before the next phase. Each invocation handles exactly one plan phase.

## Usage

```
/implement_plan <topic-or-feature-description> phase:<N>
```

**Examples:**

```
/implement_plan RedLine tooltip rendering for parallel-fifth violations phase:1
/implement_plan RedLine tooltip rendering for parallel-fifth violations phase:2
```

The `phase:<N>` argument is required. If omitted, halt immediately and output:

```
Error: phase number required.
Usage: /implement_plan <topic> phase:<N>
```

## Instructions

When this command is invoked, execute the following procedure exactly.

**Step 0 — Antigravity skill search (MANDATORY)**

Before any implementation, run:

```bash
python3 references/antigravity-awesome-skills/scripts/search.py "$ARGUMENTS" --limit 5
```

Read the top matching SKILL.md at the returned path. Apply its implementation
constraints throughout this phase — particularly any type patterns, hook
conventions, or accessibility requirements it specifies.

**Step 1 — Locate and read the plan artifact**

Parse the topic portion of `$ARGUMENTS` (everything before `phase:`).
Derive the kebab-case slug. Search for:

```
.claude/thoughts/shared/plans/<slug>.md
```

If not found, halt and output exactly:

```
No plan artifact found for: <topic>
Run /create_plan <topic> first, then /compact, then retry /implement_plan.
```

Read the plan artifact completely. Extract the Phase N block that matches the
requested phase number. If Phase N does not exist in the plan, halt and output:

```
Phase <N> not found in plan: .claude/thoughts/shared/plans/<slug>.md
Available phases: <list phase numbers found>
```

**Step 2 — Emit the scope statement**

Before writing any code, output this scope statement and pause:

```
Executing Phase <N>: <Phase Name>

Files in scope:
  - <exact path 1>
  - <exact path 2>
  ...

Verification steps:
  - npm run build
  - npm run lint
  - <feature-specific checks from the plan>

Compaction point follows Phase <N>.
```

If the user objects to the scope, halt and ask them to clarify before proceeding.
If the user confirms or does not object, proceed to Step 3.

**Step 3 — Execute the phase**

Implement every step listed in the Phase N block of the plan. Non-negotiable rules:

- ALWAYS read each target file completely before editing it (CLAUDE.md mandate).
- NEVER introduce ad-hoc hex values or Tailwind color overrides outside the
  Nocturne/Sonata token system.
- NEVER implement constraint-satisfaction logic in the frontend — that belongs
  to the backend TypeScript Logic Core.
- ALL VexFlow DOM manipulation must occur inside `useEffect` only — never in
  render or in event handlers that run synchronously during render.
- ALL Zustand store changes must be typed — no implicit `any` in state or actions.
- Tone.js receives symbolic note events only — no AudioContext or raw buffer access.
- POUR accessibility: every interactive element needs `aria-label`, keyboard nav,
  and screen-reader-compatible annotations.
- NEVER truncate code with `// ...`, `// TODO`, `// rest of code`, or similar
  shortcuts (per `.claude/rules/output-completeness.md`).
- If any ambiguity arises mid-phase that the plan does not resolve, halt
  immediately and output: "I don't know [X]. To resolve this I need [Y]."
  Do not guess.

**Step 4 — Run verification**

After all implementation steps are complete, run:

```bash
npm run build
npm run lint
```

If either command fails, do NOT proceed to the plan status update or the
compaction prompt. Fix the failure completely and re-run both commands.
A phase is not complete until both pass.

Also confirm any feature-specific verification steps listed in the plan's
Phase N block (e.g., "RedLine tooltip renders on beat 3, measure 5"). State
explicitly whether each check passed.

**Step 5 — Update the plan artifact status**

Open `.claude/thoughts/shared/plans/<slug>.md`. Locate the `**Status:**` line
in the header. Update it to reflect completion of Phase N:

- If more phases remain:
  ```
  **Status:** Phase <N> COMPLETE — Phase <N+1> not started
  ```

- If this was the final phase:
  ```
  **Status:** COMPLETE — all phases implemented
  ```

**Step 6 — Emit the compaction prompt**

If more phases remain, output exactly this block and stop:

```
Phase <N> complete. Verification passed.
Plan updated: .claude/thoughts/shared/plans/<slug>.md

Next step: run /compact, then run:
  /implement_plan <topic> phase:<N+1>
```

If this was the final phase, output exactly this block and stop:

```
Phase <N> complete. Verification passed.
All phases implemented.
Plan updated: .claude/thoughts/shared/plans/<slug>.md

Implementation complete. Review the plan artifact for a full audit trail:
  .claude/thoughts/shared/plans/<slug>.md
```

## Architecture Boundary Reminder

This command executes frontend code only. If a plan phase appears to require:

- Constraint-satisfaction logic → halt. Flag as a backend boundary violation.
- LLM Theory Inspector API logic → halt. The frontend only consumes structured
  JSON from the backend — it does not generate explanations.
- Raw AudioContext or audio buffer manipulation → halt. Tone.js symbolic
  scheduling is the only permitted audio mechanism.

In all three cases, output the violation explicitly and request clarification
before proceeding.

## FIC Rationale

Each phase ends with an explicit compaction instruction. The plan artifact is
the authoritative state tracker — it survives every `/compact` call. When the
next `/implement_plan phase:<N+1>` runs, it reads the plan file directly to
know where execution left off. The conversation history is irrelevant; the plan
file is the contract. This pattern prevents drift, reduces rework, and keeps
context utilization in the 40–60% range that the article identifies as optimal
for complex brownfield codebase work.
