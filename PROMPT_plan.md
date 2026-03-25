# PLANNING MODE

You are in the **planning phase** of the Ralph Wiggum loop (ADR-001). Your sole job
is to update `IMPLEMENTATION_PLAN.md`. Do not write any source code.

---

## Phase 0: Orient & Clarify

1. Read `specs/` to understand all Jobs to Be Done (JTBD).
2. Read `IMPLEMENTATION_PLAN.md` to understand the current state of work.
3. Study `src/` using parallel subagents to map the current codebase against the specs.
4. Consult `.claude/rules/typescript-patterns.md` and `AGENTS.md` for stack constraints.
5. If any requirement, edge case, or acceptance criterion is vague or ambiguous, use
   `AskUserQuestionTool` to interview Superman before proceeding. Do not assume.

## Phase 1: Gap Analysis

Compare every spec in `specs/` against the current `src/` codebase. For each spec item, determine:

- **Implemented:** exists and matches spec
- **Partial:** exists but missing edge cases or acceptance criteria
- **Missing:** not implemented at all
- **Broken:** implemented but violates stack constraints or accessibility rules

## Phase 2: Task Generation

Update `IMPLEMENTATION_PLAN.md`. For each gap found, create one discrete task entry:

```
- [ ] [TASK-NNN] <action verb> <component or feature>
      Acceptance: <exact, testable criterion derived from spec>
      Files: <files to create or modify>
      Constraint: <relevant rule from AGENTS.md or typescript-patterns.md>
```

Tasks must be:

- **Scoped to a single component, hook, or utility** — completable in one context window
- **Ordered by dependency** (blocked tasks listed after their blockers)
- **Tagged** with the spec file they derive from (e.g., `[spec:001]`)

## Phase 3: Test Derivation

For every task, explicitly write the required test or validation step. Options:

- **Programmatic:** `tsc --noEmit` + `npm run lint` + `npm run build` (always required)
- **Visual/subjective:** Note that `src/lib/llm-review.ts` must be used with specific criteria
- **Accessibility:** Note the specific `aria-*` attribute or keyboard behavior to verify

---

## Guardrails

1. **DO NOT IMPLEMENT ANY CODE.** Your only output is an updated `IMPLEMENTATION_PLAN.md`.
2. Keep tasks small enough to complete in a single context window.
3. If a task requires a material architectural decision, note it as `[ADR-NEEDED]` — the build agent will draft the ADR.
4. Do not proceed if acceptance criteria cannot be derived from the spec. Ask Superman first.
