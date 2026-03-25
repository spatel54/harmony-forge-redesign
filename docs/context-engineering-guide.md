# Context Engineering — Reference Guide

*The complete reference for the Ralph Wiggum loop workflow: concepts, key terms, purpose, and the mindset shift required to use it effectively.*

---

## Key Terms Glossary

### ADR (Architecture Decision Record)

A permanent, immutable document that records *why* a technical decision was made — not what was built, but why it was built that way. An ADR captures the options considered, the trade-offs evaluated, and the conditions under which the decision would be reversed. Once accepted, an ADR is never edited. When a decision changes, a new ADR supersedes the old one.

**Why it matters:** Without ADRs, architectural reasoning lives only in your head and in conversation history that disappears. ADRs give every future agent — and future you — the same context that existed at the moment of decision.

**Lives in:** `docs/adr/` | **Template:** `docs/adr/template.md` | **Index:** `docs/adr/overview.md`

---

### Spec (Specification)

A document that defines *what a user should be able to do* when a feature is complete. A spec is written in terms of observable, testable outcomes — not implementation details. Each outcome becomes an acceptance criterion with a pass/fail checkbox.

**Why it matters:** A spec is the contract between you and the loop. The loop cannot reliably build what hasn't been defined. Vague specs produce vague code. A well-written spec means the loop can work autonomously without asking you what "done" means.

**Lives in:** `specs/` | **Example:** `specs/001-satb-sandbox.md`

---

### JTBD (Job to Be Done)

The framing convention used inside each spec. A JTBD describes a complete user outcome: "A composer opens HarmonyForge and can play back an SATB arrangement symbolically." It names the user, the context, and the observable result — no implementation details.

**Why it matters:** JTBD keeps specs focused on user value rather than technical tasks. It prevents specs from accidentally encoding implementation decisions that belong to the loop.

---

### Acceptance Criterion (AC)

A single, testable condition inside a spec that defines pass/fail for one aspect of a feature. Each AC maps to exactly one checkbox. An AC is only valid if it can be verified without human judgment. If it requires judgment, it belongs in an LLM-as-judge call via `llm-review.ts`.

**Why it matters:** ACs are the only thing the loop is held accountable to. If an AC is vague, the loop will pass it incorrectly. If an AC is untestable, it cannot be verified programmatically.

---

### Backpressure

The mechanism that prevents the loop from committing broken code. Before every commit, the loop must pass all commands listed in `AGENTS.md` — currently `npx tsc --noEmit` and `npm run build`. If any command fails, the loop must fix the error before it is permitted to commit. Failure is a hard stop, not a warning.

**Why it matters:** Backpressure is what separates this workflow from "vibe coding." Without it, the loop can commit plausible-looking but broken code at high speed. With it, every commit is guaranteed to have passed the type-checker and build.

**Defined in:** `AGENTS.md`

---

### Context Window

The finite working memory available to a Claude model in any single session. Once consumed, earlier content is compressed or dropped. The loop is designed around this constraint: each iteration starts with a fresh, empty context window, fed only the current task via `PROMPT_build.md`. This eliminates context degradation entirely.

**Why it matters:** Every failure mode of long interactive sessions — task bleed, compounding hallucination, forgetting earlier decisions — is a context window problem. The loop's atomicity (one task, one context, one commit) is the engineering solution.

---

### The Ralph Wiggum Loop

The autonomous execution pattern at the core of this workflow. A bash script (`loop.sh`) continuously feeds `PROMPT_build.md` to Claude in headless mode. Claude picks one task from `IMPLEMENTATION_PLAN.md`, implements it, runs backpressure checks, commits, and exits. The loop immediately restarts with a fresh context for the next task.

**Why it matters:** The loop converts a prioritized task list into a stream of verified commits with no human involvement required per commit. It is the execution engine. Planning and steering happen outside it.

**Named after:** The Simpsons character — the loop is deterministic, simple, and repeats exactly what you tell it to. | **Runs via:** `bash loop.sh`

---

### AGENTS.md

The operational rulebook read by every agent in every loop iteration. It contains the exact backpressure commands, stack constraints, accessibility rules, and ADR generation rules the agent must follow. When you discover a new constraint or fix a broken assumption, you update `AGENTS.md` — the next iteration picks it up automatically.

**Why it matters:** AGENTS.md is how you steer the loop without interrupting it. It is the persistent memory that survives context resets. Every rule you add here is enforced on every future iteration.

---

### IMPLEMENTATION_PLAN.md

The shared task list between you and the loop. The planning agent writes it; the build agent executes from it. Each task is a single, scoped unit of work with explicit acceptance criteria. The loop picks the top uncompleted task each iteration, marks it done, and moves on.

**Why it matters:** This file is the state of the current phase. It answers "what's left to build?" at any point. It is also the steering wheel — editing it changes what the loop does next without interrupting a running iteration.

---

### LLM-as-Judge (`llm-review.ts`)

A typed stub in `src/lib/llm-review.ts` that, when implemented, allows the loop to evaluate subjective acceptance criteria it cannot verify programmatically. It spins up a multimodal model, passes it an artifact (screenshot, text, URL) and a plain-language criterion, and returns a binary pass/fail.

**Why it matters:** Some ACs — "the score canvas renders all voices with distinct colors and no overlapping noteheads" — cannot be expressed as a type-check. The LLM-as-judge gives those criteria the same hard-stop backpressure as programmatic checks.

**Currently:** A typed stub. Will be implemented when the first subjective AC is encountered.

---

### CONTEXT.md (Distributed Context Chain)

A per-directory Markdown file that records the purpose, key files, patterns, and active decisions for that directory and its contents. Every agent operating in that directory reads its `CONTEXT.md` first — it is the durable context that survives every context-window reset.

**Why it matters:** Without CONTEXT.md, each new agent (and each loop iteration) must re-infer the purpose of a directory from its files. With it, the directory's intent is explicit and stable. A stale CONTEXT.md is as dangerous as no CONTEXT.md — it feeds false premises to the loop at high speed.

**Maintenance:** After every session, run `bash scripts/specstory-to-context.sh` to distill the session's decisions and file changes into the relevant CONTEXT.md files automatically. For manual updates, edit the CONTEXT.md in the directory you touched before committing.

**Lives in:** Every directory under `src/`, `docs/`, `specs/`, `scripts/`, `public/`, and root.

### SpecStory Analysis Layer (`scripts/specstory_analyze.py`)

The rule-based parser that `specstory-to-context.sh` delegates to. Reads a SpecStory Markdown history file and produces structured JSON — no LLM required.

**Extraction pipeline:**

1. Parses `<tool-use>` blocks, identifying `Edit`, `Write`, and `Bash` calls
2. Collects file paths from tool bodies using regex against known repo-root prefixes (`src/`, `docs/`, `scripts/`, etc.)
3. Extracts `<context>`, `<task>`, and `<constraints>` XML structured-block content from agent turns
4. Derives touched directories from the collected file paths
5. Generates a session slug from the first substantive user message
6. Ranks and caps insights: XML task block (highest signal) → files written → XML constraints → agent decision sentences → notable bash commands

**Output schema:**

```json
{
  "session_uuid":        "<uuid>",
  "session_slug":        "<3-5 word lowercase-hyphenated description>",
  "directories_touched": ["src/components", "docs/adr"],
  "insights":            ["Task: …", "Modified files: …", "Constraint enforced: …"]
}
```

**Lives in:** `scripts/specstory_analyze.py` — run directly:

```bash
python3 scripts/specstory_analyze.py --file .specstory/history/<file>.md
```

### Stop Hook (Automatic CONTEXT.md Distillation)

`specstory-to-context.sh` is registered as a `Stop` hook in `.claude/settings.json`. It fires once after every Claude response. When there are no new sessions it exits in milliseconds. New sessions are written by `specstory sync` after a session ends and are picked up on the next hook fire.

**Monitor hook activity:**

```bash
cat .specstory/run.log          # one timestamped line per run
tail -f .specstory/run.log      # watch live
```

**`--dry-run` flag:** previews what would be written without modifying any CONTEXT.md. Does not record sessions as processed, so a real run will still pick them up.

**Idempotency:** processed session UUIDs are recorded in `.specstory/.processed`. Re-running the script never duplicates a table row.

**When is the current session captured?** Not during the session — specstory writes the history file only after the session ends. The hook picks it up on the next session's first response. This requires launching Claude Code via `specstory run claude` (automatic) or running `specstory sync` manually after closing the session (if launched with plain `claude`).

**Verify a session was captured:**

```bash
grep <session-uuid> .specstory/.processed   # present = captured
cat .specstory/run.log                       # new=N confirms N sessions were written
```

---

### FIC (Frequent Intentional Compaction)

The manual planning workflow already documented in `CLAUDE.md` that pre-dates the loop. FIC uses `/research_codebase` → `/create_plan` → `/implement_plan` to periodically summarize session state into artifact files, preventing context degradation in interactive sessions. FIC is the **upstream planning layer**; the loop is the **downstream execution layer**. They are complementary.

**Why it matters:** FIC governs what goes into `IMPLEMENTATION_PLAN.md`. The loop governs how that plan gets executed.

---

### HCI Protocol

The interactive session protocol defined in `.claude/rules/hci-protocol.md`: **preview → gate → execute**. Every change proposed in a direct Claude session must go through a structured XML preview, receive explicit approval, and only then be executed. The loop operates outside this protocol because it executes within an already-approved plan.

**Why it matters:** The gate prevents automation bias — the tendency to approve changes without reading them. The loop is authorized at the phase level; individual commits do not require per-commit approval.

---

### Supersede

The correct way to update an ADR. When a decision changes, a new ADR is written that states "Supersedes ADR-00X." The old ADR's status line is changed from `Accepted` to `Superseded by ADR-00Y`. Everything else in the old ADR is frozen permanently.

**Why it matters:** The immutability of accepted ADRs is what makes them trustworthy. If ADRs could be quietly edited, you could never know whether the recorded reasoning reflected what was actually decided at the time.

---

## The Workflow, End to End

```
You decide what to build
        ↓
Write a spec in specs/           ← Gear 1: Specification
(observable outcomes + ACs)
        ↓
Run the planner                  ← Gear 2: Planning (supervised)
cat PROMPT_plan.md | claude -p
        ↓
Planner asks you questions
You answer, it writes
IMPLEMENTATION_PLAN.md
        ↓
You review the task list
Edit it if needed
        ↓
git checkout -b feature/phase
bash loop.sh                     ← Gear 3: Execution (unattended)
        ↓
Loop: pick task → implement
→ tsc + build → commit → repeat
        ↓
Review: git log --oneline        ← Review
Read diffs, read new ADRs
        ↓
Phase done → write next spec
Repeat from top
```

---

## Purpose and Importance of Each File

| File | Purpose | Importance |
|---|---|---|
| `specs/*.md` | Defines what "done" means | **Critical upstream.** Vague spec = vague code. |
| `IMPLEMENTATION_PLAN.md` | Ordered task list for the loop | **The steering wheel.** Edit to change direction. |
| `AGENTS.md` | Rules every agent reads | **Persistent memory.** Survives every context reset. |
| `PROMPT_plan.md` | Planning session instructions | Write once, reuse every phase. |
| `PROMPT_build.md` | Per-iteration instructions | Write once, loop uses it forever. |
| `loop.sh` | Execution script | Run it. Only edit to upgrade the model. |
| `docs/adr/*.md` | Permanent architectural reasoning | **The audit trail.** Answers "why" for all time. |
| `docs/adr/overview.md` | ADR index | Scan to understand every major decision at a glance. |
| `src/lib/llm-review.ts` | Subjective AC evaluator | Implement when first visual or tone AC appears. |
| `*/CONTEXT.md` | Per-directory context chain | Update after every task that touches files in that directory. |
| `scripts/specstory-to-context.sh` | SpecStory → CONTEXT.md distiller | Runs automatically via `Stop` hook. Run manually with `--dry-run` to preview. |
| `scripts/specstory_analyze.py` | Rule-based SpecStory Markdown parser | Called by the shell script; run directly to inspect a single history file. |
| `.specstory/run.log` | Hook activity log | `cat .specstory/run.log` to confirm the hook is firing. |

---

## The Mindset Shift

The core reframe: **you no longer write code by talking to Claude. You write context — and Claude writes the code.**

> "Specs are the new code. ADRs are the new commit messages. Your job is upstream."

| Old job | New job |
|---|---|
| Describe the task in a message | Write acceptance criteria in `specs/` |
| Review code in the chat window | Review commits and ADRs in git |
| Correct Claude mid-session | Stop the loop, update `IMPLEMENTATION_PLAN.md`, restart |
| Hold architectural decisions in your head | Write them as ADRs in `docs/adr/` |
| Re-explain context every session | Context lives in files; files survive resets |

The session is no longer the unit of work. **The commit is the unit of work.**

---

## The Three Gears

### Gear 1: Specification

**You write, Claude reads later.**
Write `specs/` files before any code is touched. Focus on observable user outcomes, not implementation. Think like a product manager writing acceptance tests, not a developer describing a function.

### Gear 2: Planning (supervised)

**You supervise, Claude analyzes.**
Run `cat PROMPT_plan.md | claude -p`. Claude compares `specs/` against `src/`, asks you questions, writes `IMPLEMENTATION_PLAN.md`. You review and approve the task list before the loop runs.

### Gear 3: Execution (unattended)

**Claude works, you review output.**
Run `bash loop.sh` on a feature branch. One task per iteration, one commit per task, fresh context every time. Review the git log when you're ready. Never intervene mid-iteration.

---

## The Architecture of Control

```
UPSTREAM (you write)            DOWNSTREAM (you review)
────────────────────            ───────────────────────
specs/                          git log
IMPLEMENTATION_PLAN.md          docs/adr/
AGENTS.md                       src/ (the code itself)
```

Upstream changes are safe and cheap. Downstream edits — touching code mid-loop — undermine the audit trail and reintroduce context bleed.

---

## What Stays Interactive

Use a direct Claude session (not the loop) for:

- Design decisions that require your judgment before a spec exists
- Debugging a specific broken component surgically
- Writing an ADR for a decision made in conversation
- One-off changes faster to do interactively
- Anything where the acceptance criterion is "Superman approves this"

The HCI protocol (preview → gate → execute) governs all interactive sessions.

### IDE vs Terminal for Interactive Sessions

When running an interactive session, the environment matters:

| Task | Preferred environment |
|---|---|
| Phase 2 implementation (surgical edits, component work) | **IDE** — `ide_selection` passes highlighted code automatically; file refs are clickable |
| FIC research/plan phases (`/research_codebase`, `/create_plan`) | **Terminal** — artifact files written cleanly; pipe-friendly |
| Antigravity skill search | **Terminal** — `python3` scripts run in shell |
| Loop execution (`bash loop.sh`, `cat PROMPT_plan.md \| claude -p`) | **Terminal** — process-native; clean context separation |

Both environments load `CLAUDE.md`, rules files, and memory automatically. The difference is ergonomic: the IDE adds selection context and navigation; the terminal enables piping and unattended runs.

---

## ADR Lifecycle

| Stage | Meaning |
|---|---|
| `Proposed` | Draft, not yet binding |
| `Accepted` | In effect, **immutable** |
| `Superseded by ADR-00N` | Replaced; this record is frozen |
| `Deprecated` | No longer relevant, not replaced |

**Allowed edits on an Accepted ADR:** status line only, typo fixes, adding reference links. Rationale, options, and consequences are immutable.

---

## Common Mistakes

**Mixing gears.** Trying to steer during execution by editing files mid-loop. Stop the loop, edit, restart.

**Vague specs.** Writing "the canvas should look good." Rewrite: "VexFlow renders all four SATB voices at distinct y-positions with no overlapping noteheads."

**Patching loop output manually.** Reverting a commit without adding a correction task. The loop will repeat the wrong behavior unless `IMPLEMENTATION_PLAN.md` reflects what correct looks like.

**Forgetting to update AGENTS.md.** If the loop keeps making the same mistake, it means AGENTS.md is missing the rule that prevents it. Update it immediately.

**Skipping the spec.** Running the planner with vague or missing specs. The planner is only as good as its input.

**Not updating CONTEXT.md after a task.** The loop commits code; the context chain does not update itself. A CONTEXT.md that lags behind by a few tasks becomes a source of false premises for every subsequent agent. Treat it as a mandatory post-task step — same weight as `npx tsc --noEmit`. Run `bash scripts/specstory-to-context.sh` or edit manually, but always update before the next task starts.

---

## Overnight Run Checklist

Before `bash loop.sh` unattended:

- [ ] `IMPLEMENTATION_PLAN.md` is populated and reviewed
- [ ] On a feature branch — not `main`
- [ ] `npx tsc --noEmit` passes clean
- [ ] ADR-001 revisit criteria are filled in
- [ ] `AGENTS.md` constraints are current
- [ ] You know how to read the results (`git log --oneline`)

---

## The One-Sentence Version

> Write specs upstream, let the loop execute downstream, review commits not conversations.

---

## Antigravity Hero Skills (Cognitive Engine)

The specialized skills in `references/antigravity-awesome-skills/` serve as the cognitive backbone of HarmonyForge, bridging the "Black Box" of generic LLM reasoning with the "Glass Box" deterministic music symbolic logic.

### 1. The Skill Trigger Protocol

Before significant architectural or theoretical tasks, the **Skill Trigger Protocol** is invoked to discover the relevant specialist.

- **Search**: `python3 references/antigravity-awesome-skills/scripts/search.py <keywords>`
- **Ingestion**: The agent reads the corresponding `SKILL.md` to load non-negotiable constraints, banned patterns, and rigorous academic definitions.

### 2. Skill Stacking (Swarm Architecture)

Complex features often require coordination between multiple specialists. We "stack" skills to ensure cross-domain integrity.

| Specialist | Responsibility |
|---|---|
| `@vexflow-expert` | Symbolic rendering of MusicXML/JSON data |
| `@zustand-store-ts` | Type-safe state synchronization |
| `@ui-ux-pro-max` | Premium aesthetics and "Glass Box" transparency |
| `@wcag-audit-patterns` | MANDATORY accessibility compliance (POUR) |

### 3. Glass Box Integration

Skills are the tool we use to enforce the **Red Line** of explainability. By loading a specialist (e.g., `@theory-named-logic`), we ensure the agent cites academic sources for symbolic insights rather than hallucinating "vibe-based" music theory.
