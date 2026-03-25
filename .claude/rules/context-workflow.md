# Context Workflow Rules

Source: Notebook 2 — Context Engineering Methodology (`28a3882c-b206-4632-b5d7-b6ff70a4e124`)
Applies to: Every task touching more than 3 files or spanning more than 1 session.

---

## Three-Phase Workflow (Mandatory for Complex Tasks)

### Phase 0: Research (Always Before Planning)

Never write code or a plan without first mapping what exists.

- Launch subagents to explore the repo, trace information flow, and identify existing implementations
- Run a gap analysis: compare every acceptance criterion in `specs/` against what exists in `src/`
- Document findings before generating any plan
- **Why this matters:** Bad research produces thousands of bad lines. One wrong assumption in Phase 0 cascades into an entire wasted loop iteration. High-leverage human review happens here — this is the most valuable phase to inspect before proceeding.

### Phase 1: Planning

Output: `IMPLEMENTATION_PLAN.md` — discrete, prioritized, single-task entries.

Each task must contain:
- Action verb + component name + which acceptance criterion it addresses
- Files to be modified (no guessing — confirmed during Phase 0 research)
- Constraint annotation (which policy or rule applies)
- Programmatic test derivation: what command will confirm this task is done? (`tsc --noEmit`, `npm run build`, or `src/lib/llm-review.ts` for subjective ACs)

**Plan is disposable.** If the AI hallucinates a plan that does not match the codebase, delete `IMPLEMENTATION_PLAN.md` and regenerate. Do not patch a hallucinated plan.

### Phase 2: Implementation

Two execution modes:

**Loop (Unattended — for overnight or background runs):**
```bash
git checkout -b feature/<description>
bash loop.sh
```
- One task per iteration — never compound
- Fresh context window per iteration (loop restarts after each commit)
- Backpressure (`tsc --noEmit` + `npm run build`) before every commit
- CONTEXT.md updated in every directory touched before commit
- Stop on first backpressure failure — fix before restarting loop

**FIC (Supervised — for planning-heavy or multi-session work):**
```
/research_codebase <topic>   → /compact
/create_plan <topic>         → confirm gate → /compact
/implement_plan <topic> phase:1 → /compact
/implement_plan <topic> phase:2 → /compact
```
- Each `/compact` preserves a dense Markdown artifact in `.claude/thoughts/shared/`
- Never blend research, planning, and implementation in a single turn

---

## Context Window Rules

- **Optimal utilization: 40%–60%** — the "smart zone." Below 40% is safe but slow. Above 60% risks "lost in the middle" degradation (Liu et al., 2023).
- **Compact proactively:** Before context becomes noisy, distill grep outputs, test logs, and large JSON blobs into clean Markdown summaries. A 200-line summary beats a 2000-line raw log.
- **Loop = fresh context per task.** The loop's primary benefit is not automation — it is the guaranteed fresh context window at the start of every task.
- **Never accumulate state across tasks in a loop.** Each iteration is stateless; shared state lives in `IMPLEMENTATION_PLAN.md` and CONTEXT.md files only.

---

## ADR Trigger Rule

After any implementation with a material architectural decision, immediately draft an ADR:

1. Read `docs/adr/template.md`
2. Fill in: Context, Options considered (minimum 2), Decision (single unambiguous sentence), Consequences, Revisit trigger
3. Save as `docs/adr/ADR-NNN-verb-object-scope.md`
4. Add a row to `docs/adr/overview.md`
5. Commit the ADR separately from the feature code

**AI-generated ADR drafts are allowed.** The AI can auto-propose an ADR after implementing a feature. Superman reviews and approves before the ADR is committed. A draft is not binding.

---

## Backpressure Before Every Commit (Non-Negotiable)

```bash
npx tsc --noEmit      # Type-check — must pass
npm run build         # Full Next.js build — must pass
```

Do not mark any task `[x]` in `IMPLEMENTATION_PLAN.md` until both commands pass. Do not commit code that fails either check.

---

## Complexity Budget Rule

AI agents can manipulate raw code and Markdown cheaply. Before introducing a new abstraction layer, SaaS dependency, or complex configuration system, ask:

> "Could we spend tokens to manage this as raw files or Markdown instead?"

If yes, prefer the raw approach. Delete abstractions that cost more to maintain than they save. The AI can regenerate boilerplate; it cannot undo a tangled dependency tree.

---

## When to Use Which Mode

| Condition | Mode |
|---|---|
| Task touches ≤ 3 files, clear requirements | Chat directly with Claude Code |
| Need to populate `IMPLEMENTATION_PLAN.md` | `cat PROMPT_plan.md \| claude -p` |
| Unattended execution, feature branch, overnight | `bash loop.sh` |
| Multi-session, planning-heavy, >4 subtasks | FIC (`/research_codebase` → `/create_plan` → `/implement_plan`) |
| Single surgical fix, no planning needed | Direct implementation in chat |
