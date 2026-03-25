# BUILDING MODE

You are in the **execution phase** of the Ralph Wiggum loop (ADR-001). You will
complete exactly one task per iteration. Do not attempt multiple tasks.

---

## Phase 0: Orient

1. Read `specs/` to understand the overall goal.
2. Read `IMPLEMENTATION_PLAN.md` to understand current task status.
3. Read `AGENTS.md` for the exact backpressure commands you must pass before committing.
4. Consult `.claude/rules/typescript-patterns.md` for all stack constraints.
5. Consult `.claude/rules/music-theory.md` for Theory Named strategy requirements.

## Phase 1: Select

Choose the **single most important uncompleted task** from `IMPLEMENTATION_PLAN.md`.
Mark it `[~]` (in progress) before touching any source file.

## Phase 2: Investigate & Implement

Use parallel subagents to study all relevant files before writing any code. Do not
assume anything is unimplemented — verify first.

Implementation rules (all mandatory):

- No `any` types. Define explicit interfaces.
- Tailwind CSS only — Nocturne/Sonata tokens, no ad-hoc hex values.
- VexFlow DOM manipulation inside `useEffect` only.
- Tone.js symbolic events only — no `AudioContext`.
- POUR accessibility: `aria-label`, keyboard nav, `aria-describedby` on all interactive elements.
- Constraint logic stays in the backend — never in the frontend.
- Full output completeness: no `// ...`, no `// TODO`, no skeleton stubs. A partial output is a broken output.

If the task requires a material architectural decision, draft an ADR per `AGENTS.md` rules.

## Phase 3: Validate (Backpressure)

Run all three commands in order:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

If any command fails: analyze the error, fix the implementation, and re-run.
Do not proceed to Phase 4 until all three pass. Do not suppress errors with ignore comments.

For subjective acceptance criteria (visual harmony, tone, layout feel): use
`src/lib/llm-review.ts` to run an LLM-as-a-judge evaluation with specific criteria.
Binary pass/fail required before proceeding.

## Phase 4: Update & Commit

1. Mark the task `[x]` in `IMPLEMENTATION_PLAN.md`.
2. Note any discoveries, new constraints, or follow-up tasks in `IMPLEMENTATION_PLAN.md`.
3. If you updated `AGENTS.md` during this iteration, commit that change first.
4. Commit source changes: `git add <specific files>` then `git commit -m "feat: <task description>"`.

---

## Guardrails

1. **COMPLETE EXACTLY ONE TASK.** Do not start a second task in the same iteration.
2. Ultrathink about edge cases before writing any code.
3. If you discover an operational learning, update `AGENTS.md` before committing code.
4. Never commit without passing all three backpressure commands.
5. Never use `--no-verify` or any flag that bypasses git hooks.
