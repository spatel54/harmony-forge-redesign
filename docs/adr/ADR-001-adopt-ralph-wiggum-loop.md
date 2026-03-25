# ADR-001: Adopt Ralph Wiggum Loop for HarmonyForge Autonomous Development

**Status:** Accepted
**Date:** 2026-03-09
**Owners:** Superman, Claude Code
**Supersedes / Superseded by:** N/A

---

## Decision Drivers

- Prevent context window degradation across long multi-turn development sessions (Liu et al. 2023, "Lost in the Middle" — quality collapses outside the 40%–60% context zone)

## Context

HarmonyForge Phase 2 requires implementing approximately 10 React components, 4 Zustand
stores, VexFlow score rendering integration, and Tone.js symbolic playback scheduling.
The current workflow is ad-hoc, single-session Claude prompting with manual state
tracking between turns.

As session length grows, two failure modes emerge: (1) context dilution — the model
loses track of earlier decisions; (2) task bleed — unfinished tasks from one turn leak
into the next, corrupting state. The HCI protocol (`.claude/rules/hci-protocol.md`)
partially addresses this through the preview → gate → execute pattern and the FIC
workflow, but neither enforces programmatic backpressure before commits, nor does either
prevent context pollution across iterations.

The **Ralph Wiggum loop** (from Anthropic-aligned context engineering practice, sourced
from the NotebookLM notebook below) addresses both failure modes:

- Each loop iteration gets a **fresh, unpolluted context window** — one task, one commit.
- **AGENTS.md** specifies the exact `npm run test` / `npm run lint` commands the agent
  must pass before it is permitted to commit. Failure is a hard stop, not a soft warning.
- The loop runs headlessly via `claude -p --dangerously-skip-permissions`, enabling
  unattended overnight execution on a clean branch.

HarmonyForge stack constraints (must be respected by all agents in the loop):
Next.js App Router, TypeScript strict mode, Tailwind CSS (Nocturne/Sonata tokens only),
VexFlow (symbolic rendering), Tone.js (symbolic scheduling only), Zustand state.
All LLM calls are REST/streaming API consumers — no constraint logic in the frontend.

PRD reference: `PLAN.md` (4-phase HarmonyForge redesign roadmap)

## Options Considered

### Option 1: Do Nothing (continue ad-hoc single-session prompting)

- **Pro:** Zero setup cost; pattern is already familiar
- **Con:** Context degrades after ~4 subtasks per session (Liu et al. 2023)
- **Con:** No audit trail of decisions; no backpressure guarantee before commit
- **Risk:** Compounding hallucination as session length grows — model fills gaps with
  confident confabulation, bypassing the Theory Named strategy

### Option 2: FIC Workflow Only (manual compaction, no automation)

- **Pro:** Already documented in `CLAUDE.md`; zero new tooling required
- **Pro:** Preserves human control at every phase boundary
- **Con:** Compaction is manually triggered — easy to skip under time pressure
- **Con:** No enforcement of test/lint backpressure before commit; relies on discipline
- **Con:** Single-session execution; fresh-context guarantee requires manual discipline

### Option 3: Full Ralph Wiggum Loop — loop.sh + AGENTS.md + backpressure (chosen)

- **Pro:** Fresh-context-per-task guarantee is structural, not behavioral
- **Pro:** AGENTS.md enforces `npm run test` + `npm run lint` deterministically before commit
- **Pro:** `loop.sh` enables unattended overnight runs on a clean feature branch
- **Pro:** FIC workflow remains active as the upstream **planning** layer; the loop
  handles downstream **execution** — they are complementary, not competing
- **Con:** Requires bootstrap investment: this scaffold (8 files)
- **Con:** `--dangerously-skip-permissions` bypasses Claude Code's safety prompts —
  must only run on an isolated branch, never directly on `main`

## Decision

We will adopt the Ralph Wiggum loop — `loop.sh` + `AGENTS.md` + programmatic
backpressure — as the primary autonomous execution pattern for HarmonyForge Phase 2
and beyond, layered on top of the existing FIC planning workflow.

## Rationale

The fresh-context-per-task constraint eliminates the primary failure mode of long
sessions. AGENTS.md backpressure makes a failing test a hard stop before any commit
can land. The FIC workflow (`/research_codebase` → `/create_plan` → `/implement_plan`)
is preserved as the upstream planning layer; `loop.sh` runs inside a confirmed plan phase.

We are explicitly **not** optimizing for:
- (a) Minimal tooling footprint — the 8-file bootstrap is acceptable for the reliability gain.
- (b) Human approval at every single commit — the loop is designed for supervised-unattended execution within an already-approved plan phase. Superman retains authority at the phase boundary (FIC gate), not at the commit level.

## Consequences

**Positive:**

- Every commit is gate-kept by `npm run test` + `npm run lint` before it lands
- Planning and execution phases are structurally separated (`PROMPT_plan.md` vs `PROMPT_build.md`) — no task bleed
- ADR generation is embedded in `AGENTS.md` as an operational rule, making architectural documentation continuous rather than deferred
- `specs/` directory seeds a JTBD-driven source of truth that survives context resets

**Negative:**

- `--dangerously-skip-permissions` disables Claude Code's interactive safety prompts — this is intentional and understood; it **must** be run only on a clean, non-main branch with Superman's explicit authorization per session
- `loop.sh` cannot be steered mid-run without a manual `Ctrl+C` — direction changes require stopping the loop, updating `IMPLEMENTATION_PLAN.md`, and restarting

**Neutral / Follow-ups:**

- `src/lib/llm-review.ts` is created as a typed stub; implementation is deferred until the first acceptance criterion that cannot be verified programmatically (e.g., visual harmony of the score canvas)
- `specs/001-satb-sandbox.md` seeds the `specs/` directory; additional spec files are added at each FIC planning phase

## Validation / Revisit Criteria

- Loop produces more than 2 broken commits in a 24-hour unattended run → pause and audit backpressure rules in `AGENTS.md`
- Agent repeatedly modifies files outside the declared task scope → tighten guardrails in `AGENTS.md` and reduce task granularity in `IMPLEMENTATION_PLAN.md`
- Manual steering overhead exceeds autonomous output within one sprint → revert to FIC-only workflow (Option 2)
- A new Claude capability (persistent memory, multi-turn tool use) makes fresh-context loops obsolete → supersede with ADR-002

## References

- NotebookLM source: <https://notebooklm.google.com/notebook/28a3882c-b206-4632-b5d7-b6ff70a4e124>
- `CLAUDE.md` — FIC Workflow (existing complementary planning layer)
- `PLAN.md` — HarmonyForge 4-phase redesign roadmap (PRD)
- `.claude/rules/hci-protocol.md` — Preview → gate → execute HCI protocol
- Liu et al. (2023), "Lost in the Middle: How Language Models Use Long Contexts"
- Aldwell & Schachter, *Harmony and Voice Leading*, 4th ed. (SATB constraint reference for `specs/`)
