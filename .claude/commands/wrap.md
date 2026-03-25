# /wrap — Session Close & Context Sync

## Purpose

One-command session hygiene. Run this before every `/compact` call.

Sequence (automated, no user input needed):
1. Run `bash scripts/specstory-to-context.sh` — populate Session Insights in CONTEXT.md files
2. Detect which source directories were touched this session via `git status`
3. Update the **Files** and **Decisions** tables in each stale CONTEXT.md for those directories
4. Append a dated session block to `PROGRESS.md`
5. Run `npx tsc --noEmit` — confirm no type regressions
6. Emit the `/compact` prompt

## Usage

```
/wrap
```

No arguments. Run at the end of any session where code was written.

---

## Instructions

When this command is invoked, execute the following steps exactly.

---

### Step 1 — Run specstory sync

```bash
bash scripts/specstory-to-context.sh
```

Report the output: how many sessions were newly processed vs. already processed.
If it fails, report the error and continue (non-blocking).

---

### Step 2 — Identify touched directories

Run:

```bash
git status --short
```

Parse the output. Collect the **unique parent directories** of every modified or
new (`M`, `A`, `??`) file under `src/`. For example:

- `M src/components/organisms/ScoreCanvas.tsx` → `src/components/organisms/`
- `A src/store/useScoreStore.ts` → `src/store/`
- `M src/lib/audio/usePlayback.ts` → `src/lib/audio/`

Also collect touched directories under `docs/adr/` (new ADR files) and
`src/app/` subdirectories.

---

### Step 3 — Update CONTEXT.md for each touched directory

For each directory identified in Step 2:

1. Read the directory's `CONTEXT.md` (e.g., `src/store/CONTEXT.md`).
2. Read each modified/new file in that directory to understand its current state.
3. Update the **Files** table to reflect the actual current status of each file:
   - Mark completed files ✅
   - Remove "needs" columns where the need is now satisfied
   - Add new files that were created this session
4. Update the **Decisions** section if a new architectural decision was made
   (e.g., new ADR, new Zustand pattern, new VexFlow pattern).
5. Do NOT change Session Insights (those are auto-populated by specstory).
6. Do NOT change Ontology, Patterns, or Policies unless they are factually wrong
   given the current state of the code.

Apply the same update to `src/components/organisms/CONTEXT.md`,
`src/lib/CONTEXT.md`, `src/app/CONTEXT.md`, and `src/app/document/CONTEXT.md`
as needed based on what changed.

---

### Step 4 — Append session block to PROGRESS.md

Read `PROGRESS.md`. Append a new dated section at the bottom using this template:

```markdown
---

## [YYYY-MM-DD Session N] — <one-sentence session goal>

**Session goal:** <derived from the tasks completed this session>
**Workflow used:** <Chat / FIC / Loop>

### Tasks Completed

| Task | File(s) | Status |
|---|---|---|
| <TASK-ID> | `<file>` | ✅ <brief description> |

### Tasks In Progress / Next

- **<TASK-ID>** (<in preview / in progress>): <brief description>

### Key Decisions

- <Any new ADRs drafted or architectural choices made>

### Learnings

- <Any patterns, gotchas, or corrections from this session>
```

Rules for filling the template:
- **Session goal**: derive from the task IDs completed (e.g., "TASK-A22 through TASK-A23 — Tone.js playback hook + playbar wiring")
- **Tasks Completed**: read `IMPLEMENTATION_PLAN.md` to find which tasks were marked `[x]` in this session
- **Tasks In Progress**: any task that was previewed but not yet approved, or started but not complete
- **Key Decisions**: any new ADR files in `docs/adr/` touched this session
- **Learnings**: derive from patterns or corrections applied during the session (read git diff to infer)

If `IMPLEMENTATION_PLAN.md` does not exist or is empty, derive task list from `git status` and `git diff --stat`.

Determine the session number N by counting existing `## [` blocks in `PROGRESS.md` and adding 1.

Determine today's date from the system date (use `date +%Y-%m-%d` via Bash).

---

### Step 5 — Backpressure check

Run:

```bash
npx tsc --noEmit
```

Report the result:
- ✅ Pass: "Type check passed — no errors."
- ❌ Fail: List each error. Do NOT proceed to Step 6 until all type errors are fixed.
  Fix them now, then re-run.

---

### Step 6 — Emit compact prompt

Output exactly this block and stop:

```
─────────────────────────────────────────────
✅  /wrap complete

  specstory    →  <N new sessions processed>
  CONTEXT.md   →  <list of directories updated>
  PROGRESS.md  →  session block appended
  tsc          →  passed (0 errors)

Run /compact now to preserve this session's context.
─────────────────────────────────────────────
```

If tsc failed and errors were fixed in Step 5, replace `tsc → passed (0 errors)`
with `tsc → 1 error fixed before wrap completed`.

---

## What This Command Does NOT Do

- Does NOT run `/compact` itself — that is a separate built-in command the user runs manually.
- Does NOT commit code — use the standard git commit flow after `/compact`.
- Does NOT modify `IMPLEMENTATION_PLAN.md` task statuses — that is done during `/implement_plan` execution.
- Does NOT modify the `docs/notes/journey.md` correction log — that is done only after Superman corrections.

---

## Rationale

Per `.claude/rules/context-workflow.md`, optimal context utilization is 40–60%.
Running `/wrap` + `/compact` at the end of each session:

1. Flushes specstory session insights into CONTEXT.md files (so the next session
   starts with accurate directory-level context, not stale pre-session state).
2. Appends a typed session block to PROGRESS.md before the conversation is
   compressed (the PROGRESS.md entry survives compaction as a file artifact).
3. Verifies type correctness before context is discarded (easier to fix now than
   after a fresh context window where the error origin is unknown).

This replaces the manual three-step end-of-session ritual that was previously
required after every compaction.
