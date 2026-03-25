# HarmonyForge — Quick-Start Guide

*Operative entry point. Combines workflow decision tree, Ollama setup, CONTEXT.md maintenance, and git workflow into one scannable reference.*

Full reference docs: [`docs/context-engineering-guide.md`](context-engineering-guide.md) · [`docs/notes/prompting-guide.md`](notes/prompting-guide.md) · [`docs/ollama-claude-code-setup.md`](ollama-claude-code-setup.md)

---

## 1. Choose Your Workflow

```
What are you doing?
│
├─ Exploring or asking a question?
│   └─ Chat directly with Claude Code
│
├─ One small fix (≤ 3 files, clear requirements)?
│   └─ Chat directly, or: FIC surgical fix (Stage 7 below)
│
├─ Need to plan Phase N from specs?
│   └─ Stage 1 → run planner → review IMPLEMENTATION_PLAN.md
│
├─ Ready to build (plan exists, feature branch ready)?
│   ├─ Supervised  → FIC: /research_codebase → /create_plan → /implement_plan
│   └─ Unattended  → git checkout -b feature/<name> && bash loop.sh
│
└─ Reviewing what was built?
    └─ Stage 3 → git log, read ADRs and CONTEXT.md updates
```

### IDE vs Terminal

| Phase | Environment | Why |
|---|---|---|
| **Gear 2 — Planning** (`cat PROMPT_plan.md \| claude -p`) | Terminal | Pipe-native; clean process separation |
| **Gear 3 — Loop execution** (`bash loop.sh`) | Terminal | Unattended; fresh context per iteration; git hooks fire correctly |
| **Antigravity skill search** | Terminal | `python3 references/antigravity-awesome-skills/scripts/search.py` runs in shell |
| **FIC research + plan phases** (`/research_codebase`, `/create_plan`) | Terminal | Artifact files written cleanly; no IDE overhead |
| **Phase 2 implementation** (interactive, surgical edits) | IDE (VSCode extension) | `ide_selection` passes highlighted code automatically; clickable file refs; diff visibility |

Both environments load `CLAUDE.md`, rules files, and memory automatically. Use the IDE for interactive implementation turns; use the terminal for loop runs, piped commands, and FIC planning phases.

---

## 2. Stage Reference (8 Stages)

| Stage | Goal | Command / Action |
|---|---|---|
| **0 — Orient** | Check current state before any work | Read `IMPLEMENTATION_PLAN.md` and recent `git log --oneline` |
| **1 — Plan** | Populate task list from specs | `cat PROMPT_plan.md \| claude -p` |
| **2 — Loop** | Execute tasks unattended | `git checkout -b feature/<name> && bash loop.sh` |
| **3 — Review** | Inspect what the loop built | `git log --oneline`, read ADRs, read CONTEXT.md diffs |
| **4 — Correct** | Fix a wrong task without manual edits | Add correction task to `IMPLEMENTATION_PLAN.md`, restart loop |
| **5 — Spec** | Write acceptance criteria for the next phase | Edit `specs/001-satb-sandbox.md` with new JTBD + ACs |
| **6 — ADR** | Document an architectural decision | Copy `docs/adr/template.md`, save as `ADR-NNN-...md`, add to `overview.md` |
| **8 — CONTEXT** | Update per-directory context files | See Section 4 below |

*(Stage 7 is surgical fix — use FIC for a single targeted change: `/research_codebase` → `/create_plan` → `/implement_plan phase:1`.)*

---

## 3. Ollama — Local Claude Code

Use Ollama to run Claude Code against a local model instead of the Anthropic cloud API.

### Start Ollama

```bash
# Start the Ollama service (persistent — survives terminal close)
brew services start ollama

# Verify it's running
curl http://localhost:11434/api/version
# Expected: {"version":"0.x.x"}

# Launch Claude Code with local model
claude --model qwen3-coder
```

Recommended model for 16GB M2 MacBook: **`qwen3-coder`** (~6GB RAM, coding-specialized).

### Pull a Model (First Time Only)

```bash
ollama pull qwen3-coder
ollama list   # Confirm download complete
```

### Exit an Ollama Claude Session

- Type `/exit` in the Claude terminal, **or** press `Ctrl+C`
- The Ollama service keeps running in the background — that is normal

### Stop the Ollama Service

```bash
brew services stop ollama
```

### Switch Back to Anthropic Cloud API

In the current terminal session only (temporary):

```bash
unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_API_KEY
```

To make it permanent, remove these three lines from `~/.zshrc`:

```bash
export ANTHROPIC_AUTH_TOKEN=ollama
export ANTHROPIC_API_KEY=""
export ANTHROPIC_BASE_URL=http://localhost:11434
```

### Troubleshooting

| Problem | Fix |
|---|---|
| `connection refused` on port 11434 | `brew services restart ollama` |
| Model not found | `ollama pull qwen3-coder` |
| Slow responses | Close browsers/apps to free RAM |
| Out of memory crash | Switch to `qwen3-coder` (smallest at ~6GB) |

---

## 4. Updating CONTEXT.md from SpecStory

Every coding session generates entries in `.specstory/history/`. The distillation script propagates insights into the relevant `*/CONTEXT.md` files.

### Auto-Distillation

```bash
bash scripts/specstory-to-context.sh
```

Run this after every session that touched files in multiple directories.

### Manual Update (Per Directory)

After touching any directory, open its `CONTEXT.md` and update:

- **Patterns**: any new recurring approach discovered
- **Decisions**: any inline architectural choice made
- **Research**: any external source consulted
- **Ontology**: any new domain term introduced

Treat CONTEXT.md updates as a **backpressure step** — do not commit a feature without updating the CONTEXT.md in every directory you modified.

### Which CONTEXT.md Files Exist

```
/                          ← project-wide ontology and decisions
src/                       ← frontend boundary and component rules
src/app/                   ← Next.js App Router routes and globals
src/components/            ← component organization
src/components/atoms/
src/components/molecules/
src/components/organisms/
src/components/landing/
src/lib/                   ← utilities, hooks
src/store/                 ← Zustand state
src/styles/                ← font and token files
docs/                      ← documentation hub
docs/adr/                  ← architecture decisions
docs/ontology/             ← domain entity definitions
docs/patterns/             ← recurring implementation patterns
docs/policies/             ← non-negotiable constraints
docs/research/             ← external sources and NotebookLM registry
docs/design/               ← .pen files and design system
docs/notes/                ← operational guides
docs/archive/              ← retired docs
specs/                     ← JTBD specifications
scripts/                   ← build and automation scripts
public/                    ← static assets
public/assets/
```

### Auto-Hook — Runs After Every Claude Response

The script is registered as a `Stop` hook in `.claude/settings.json`. It fires automatically when Claude finishes each response — no manual invocation needed during normal sessions.

```json
{ "type": "command", "command": "bash scripts/specstory-to-context.sh", "timeout": 30000 }
```

The current session's history file is written by `specstory sync` *after* the session ends, so the hook picks it up on the **next** session's first response. Every previous session is always fully captured.

### Monitoring Hook Activity

```bash
cat .specstory/run.log          # one timestamped line per run
tail -f .specstory/run.log      # watch live
```

Each log line shows: `2026-03-10T09:14:35Z  new=2  skipped=33  errors=0`

A line without `[dry-run]` confirms the hook fired and writes are real. If `new=0` every time, no unprocessed sessions exist — that is correct behaviour.

### Analysis Layer

The script delegates to `scripts/specstory_analyze.py`, a rule-based Markdown parser that requires no LLM:

- Extracts file paths from `Edit`, `Write`, and `Bash` `<tool-use>` blocks
- Extracts decisions from `<context>`, `<task>`, and `<constraints>` XML structured blocks
- Derives touched directories from the collected paths
- Generates a session slug from the first user message

Pass `--dry-run` to preview what would be written without touching any CONTEXT.md:

```bash
bash scripts/specstory-to-context.sh --dry-run
```

### Is the Current Session Being Recorded?

**No — not yet.** The current session's history file is written by specstory *after* the session ends. The hook will pick it up on the next session's first response.

For this to work automatically you must launch Claude Code via:

```bash
specstory run claude
```

If you launched with plain `claude`, run this manually after closing the session:

```bash
specstory sync
```

To confirm a past session was captured, check whether its UUID appears in `.specstory/.processed`:

```bash
grep <session-uuid> .specstory/.processed
```

---

## 5. Git Workflow

### Always Work on a Feature Branch

```bash
git checkout -b feature/<phase>-<description>
# Example: git checkout -b feature/phase2-vexflow-score-canvas
```

Never commit directly to `main`. Loop runs automatically create a branch when started via `loop.sh`.

### Backpressure Gates (Required Before Every Commit)

```bash
npx tsc --noEmit      # Must pass — no type errors
npm run build         # Must pass — full Next.js build succeeds
```

Do not commit if either command fails. Fix the error first.

*Note: `npm run lint` currently fails due to a Node 25 / eslint-config-next incompatibility with `zod-validation-error`. This is a pre-existing issue — do not block unrelated commits on it.*

### Stage Files Explicitly (Never `git add -A`)

```bash
# Stage only the files you modified
git add src/components/ScoreCanvas.tsx
git add docs/adr/ADR-002-vexflow-wrapper.md
git add docs/adr/overview.md
git add src/components/CONTEXT.md

# Never:
# git add -A    ← risks committing .env or large binaries
# git add .     ← same risk
```

### Commit Format

```bash
git commit -m "feat: <description>"
# Examples:
# git commit -m "feat: implement VexFlow score canvas with symbolic note data"
# git commit -m "fix: remove ad-hoc hex values from ThemeToggle (AC-004)"
# git commit -m "docs: add ADR-002 for VexFlow wrapper pattern"
# git commit -m "chore: update CONTEXT.md in src/components after score canvas work"
```

Prefix options: `feat` (new), `fix` (bug), `refactor` (restructure), `docs` (docs only), `chore` (maintenance), `test` (test only).

### Push and Open a PR

```bash
git push -u origin feature/<name>
gh pr create \
  --title "feat: <short description (under 70 chars)>" \
  --body "$(cat <<'EOF'
## Summary
- <bullet 1>
- <bullet 2>

## Acceptance Criteria Addressed
- AC-00X: <description> ✅

## Test Plan
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] Reviewed ADRs for any architectural decisions made
EOF
)"
```

### PR Review Focus

When reviewing a PR, **do not review line-by-line syntax**. Review:

1. Does `IMPLEMENTATION_PLAN.md` show the task as `[x]`?
2. Are any new ADRs present and correctly formatted?
3. Are CONTEXT.md files updated in every directory touched?
4. Do the changes satisfy the acceptance criterion they target?

---

## 6. NotebookLM Quick Access

Query the HarmonyForge research notebook:

```bash
cd .claude/skills/notebooklm
python scripts/run.py auth_manager.py status
python scripts/run.py ask_question.py \
  --question "Your question here" \
  --notebook-url "https://notebooklm.google.com/notebook/e093ae79-f26b-43f5-90a7-340876833238"
```

See `docs/research/CONTEXT.md` for the full notebook registry.

---

## 7. Key File Cheat Sheet

| File | Purpose | When to Read |
|---|---|---|
| `IMPLEMENTATION_PLAN.md` | Current task queue (`[ ]` pending, `[~]` in progress, `[x]` done) | Start of every session |
| `AGENTS.md` | Backpressure commands, stack constraints, loop hygiene rules | Loop runs; before implementing |
| `specs/001-satb-sandbox.md` | All acceptance criteria for Phases 2–4 | When selecting or writing tasks |
| `PROMPT_plan.md` | Planner instructions | Run via `cat PROMPT_plan.md \| claude -p` |
| `PROMPT_build.md` | Build loop instructions | Used by `loop.sh` automatically |
| `loop.sh` | Ralph Wiggum Loop script | Run directly: `bash loop.sh` |
| `docs/adr/overview.md` | Index of all architecture decisions | Before making a new architectural choice |
| `docs/context-engineering-guide.md` | Full glossary of all workflow terms | When a term is unclear |
| `docs/quick-start.md` | This file | First stop |

---

## 8. Antigravity Hero Skills

HarmonyForge utilizes a library of 1,000+ expert skills to handle specialized tasks with academic rigor. These live in `references/antigravity-awesome-skills/skills/`.

### Specialist Discovery

If you need an expert on a specific topic (e.g., accessibility or VexFlow), search the repository:

```bash
python3 references/antigravity-awesome-skills/scripts/search.py "accessibility"
```

### Protocol for Ingestion

When asking a question or tasking an agent with a specialized component:

1. Identify the specialist ID (e.g., `@wcag-audit-patterns`).
2. Explicitly command the agent to read the corresponding `SKILL.md`.
3. This ensures the agent follows strict **Banned Patterns** and **Required Axioms** for that domain.

### Common HarmonyForge Specialists

- **`@vexflow-expert`**: For score rendering logic.
- **`@theory-named-strategy`**: For academic music theory explainability.
- **`@ui-ux-pro-max`**: For premium visual standards.
- **`@framer-motion-patterns`**: For micro-animations and physics-based UI.
