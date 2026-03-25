# CONTEXT.md — docs/patterns/

*Recurring implementation patterns verified across multiple interactions. The "how" layer — concrete, reusable approaches that do not rise to the level of an ADR but are stable enough to standardize.*

---

## Purpose

This folder documents **recurring patterns** — solutions that have been applied more than once and should be applied consistently going forward. Patterns are prescriptive but not immutable; they can be updated as better approaches emerge (unlike ADRs, which are frozen on acceptance).

---

## What Belongs Here

- Verified component implementation patterns (VexFlow wrapper, Zustand slice, Tone.js hook)
- Workflow patterns (Preview→Gate→Execute, Ralph Wiggum Loop, FIC)
- Citation and documentation patterns (Theory Named, CONTEXT.md maintenance)
- Cross-cutting conventions confirmed across multiple files or sessions

## What Does NOT Belong Here

- One-off solutions that have not been generalized
- Architectural decisions with rationale → `docs/adr/`
- Non-negotiable constraints → `docs/policies/`
- Domain concept definitions → `docs/ontology/`

---

## Pattern Index

### Frontend Patterns

#### VexFlow Component Pattern
Wrap all VexFlow DOM manipulation inside `useEffect`. Never access refs or mutate SVG elements outside the effect lifecycle.

```tsx
// ✅ Pattern
useEffect(() => {
  if (!containerRef.current) return;
  const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
  // ... VexFlow setup
  return () => { /* cleanup */ };
}, [staveData]);
```

Files: Any component in `src/components/` that renders a score stave.

---

#### Zustand Slice Pattern
Each store slice is a typed interface with explicit action signatures. No implicit `any`. Actions are defined inline in the slice factory.

```ts
interface ScoreSlice {
  voices: Voice[];
  setVoices: (voices: Voice[]) => void;
}
```

Files: `src/store/`

---

#### Tone.js Symbolic Hook Pattern
Schedule only symbolic events (note pitch, duration, start time). Never access `AudioContext` directly or manipulate raw buffers.

```ts
// ✅ Pattern
Tone.Transport.schedule((time) => {
  synth.triggerAttackRelease(note.pitch, note.duration, time);
}, note.startTime);
```

Files: `src/lib/audio/` hooks.

---

#### Theory Named Citation Pattern
Every music theory claim in comments, tooltips, violation labels, or documentation must follow this format:

> "X is defined as [academic definition], per [Author, *Title*, edition, chapter]."

Example: "A parallel fifth is defined as two voices moving in the same direction by a perfect fifth interval, per Aldwell & Schachter, *Harmony and Voice Leading*, 4th ed., Ch. 5."

Files: All files in `src/`, `docs/`, `.claude/rules/`.

---

### Workflow Patterns

#### Preview → Gate → Execute
Every response to a user request follows three phases, never blended in a single turn:
1. **Preview**: XML structured block (`<context>`, `<task>`, `<constraints>`, `<output>`) + meta-rewrite
2. **Gate**: Confirmation question — "Shall I proceed?" — as the final line, verbatim
3. **Execute**: Implementation only after explicit "Yes / Proceed / Approved"

Source: `.claude/rules/hci-protocol.md`

---

#### Ralph Wiggum Loop Pattern
Unattended single-task execution cycle:

```bash
# loop.sh feeds PROMPT_build.md to Claude headlessly
while true; do
  cat PROMPT_build.md | claude --dangerously-skip-permissions -p
  # Claude: orient → select 1 task → implement → backpressure → commit → exit
done
```

Invariants:
- One task per iteration — never compound
- Fresh context window per iteration
- Backpressure (`tsc --noEmit` + `npm run build`) before every commit
- CONTEXT.md updates in every directory touched

---

#### FIC Pattern (Frequent Intentional Compaction)
Supervised planning and implementation with context resets between phases:

```
/research_codebase <topic>   → compact
/create_plan <topic>         → confirm gate → compact
/implement_plan <topic> phase:1 → compact
/implement_plan <topic> phase:2 → compact
```

Use FIC for: multi-session tasks, tasks touching > 4 subtasks, tasks requiring exploration before planning.

---

#### CONTEXT.md Maintenance Pattern
After every session that touches files in a directory:
1. Update `*/CONTEXT.md` in every directory modified
2. Run `bash scripts/specstory-to-context.sh` to distill session insights
3. Treat CONTEXT.md updates as a backpressure step — commit them alongside the feature

---

### ADR Generation Pattern
After implementing any feature with a material architectural decision:
1. Read `docs/adr/template.md`
2. Draft ADR with: Context, Options (min 2), Decision sentence (unambiguous), Consequences, Revisit trigger
3. Save as `docs/adr/ADR-NNN-verb-object-scope.md`
4. Add row to `docs/adr/overview.md`
5. Commit ADR separately from the feature code

---

## Related Folders

| Folder | Relationship |
|---|---|
| `docs/ontology/` | What the entities are that these patterns operate on |
| `docs/policies/` | Constraints these patterns must respect |
| `docs/adr/` | Decisions that motivated or superseded a pattern |
| `.claude/rules/` | Agent-operative versions of some patterns |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
