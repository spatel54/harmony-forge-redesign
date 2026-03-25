# CONTEXT.md — docs/research/

*External knowledge sources grounding project decisions. Primary literature, user study data, reference implementations, and curated knowledge bases.*

---

## Purpose

This folder indexes **external sources** — materials that did not originate in the HarmonyForge project but inform it. Research entries are reference pointers, not content copies. Each entry records what the source contains and how it connects to project decisions.

---

## What Belongs Here

- Academic paper citations (music theory textbooks, HCI papers, XAI surveys)
- NotebookLM notebook registry (URLs, content summaries, last queried date)
- Reference implementation notes (HarmonySolver, SchenkComposer, DeepBach)
- User study data references (interview transcripts, Think-Aloud sessions)
- Methodology sources (qualitative coding protocols, JTBD framework refs)

## What Does NOT Belong Here

- Project-internal decisions → `docs/adr/`
- Domain entity definitions derived from research → `docs/ontology/`
- Implementation patterns → `docs/patterns/`
- Operational constraints → `docs/policies/`

---

## NotebookLM Notebook Registry

| ID | URL | Content Summary | Classification | Last Queried |
|---|---|---|---|---|
| `notebook-hf-academic` | [e093ae79...](https://notebooklm.google.com/notebook/e093ae79-f26b-43f5-90a7-340876833238) | HarmonyForge academic research for CHI/UIST paper. Contains: literature review (DeepBach, Anticipatory Music Transformer, ComposerX, XAI surveys), user study transcripts (Think-Aloud interviews), qualitative codebooks, technical blueprints for deterministic SATB engine, Schenkerian analysis sources, CSP implementation references. | **Research** | 2026-03-09 |
| `notebook-context-engineering` | [28a3882c...](https://notebooklm.google.com/notebook/28a3882c-b206-4632-b5d7-b6ff70a4e124) | Context engineering & spec-driven AI development methodology. Covers: Research→Plan→Implement 3-phase workflow, Ralph Wiggum Loop, FIC, ADR-as-code, backpressure gating, complexity budgets, context window management (40–60% smart zone). Informed `.claude/rules/context-workflow.md`. | **Methodology** (→ Claude Rules) | 2026-03-09 |

---

## Academic Sources (Music Theory)

| Source | Relevance | Used In |
|---|---|---|
| Aldwell, E. & Schachter, C. *Harmony and Voice Leading*, 4th ed. | SATB voice ranges, parallel fifths/octaves, doubling rules — Axiomatic Ground Truths | `.claude/rules/music-theory.md`, `docs/ontology/` |
| Fux, J. J. *Gradus ad Parnassum* (1725) | 18th-century counterpoint rules; source for strict species counterpoint constraints | Backend constraint engine (reference only) |
| Schoenberg, A. *Fundamentals of Musical Composition* | Form analysis; informing Glass Box explanation generation | Theory Inspector API design |

---

## Academic Sources (HCI & XAI)

| Source | Relevance | Used In |
|---|---|---|
| Arrieta, A.B. et al. "Explainable AI: Concepts, taxonomies, opportunities." *Information Fusion*, 2020 | Defines ante-hoc vs. post-hoc explainability; Glass Box taxonomy | `docs/ontology/` (Glass Box definition) |
| Liu, N.F. et al. "Lost in the Middle: How Language Models Use Long Contexts." *TACL*, 2023 | Motivates fresh-context-per-task (Ralph Wiggum Loop), FIC workflow, ADR-001 | ADR-001; CLAUDE.md; `docs/context-engineering-guide.md` |
| Nielsen, J. Heuristic #5 (Error Prevention) | Motivates Preview→Gate→Execute protocol | `.claude/rules/hci-protocol.md` |

---

## Reference Implementations

| System | Description | Relevance |
|---|---|---|
| HarmonySolver | CSP-based SATB harmony solver | Reference architecture for HarmonyForge backend constraint engine |
| SchenkComposer | Schenkerian analysis automation | Reference for structural reduction in Glass Box explanations |
| DeepBach (Hadjeres et al., 2017) | Deep learning SATB harmonization | Foil/contrast in academic argument — "Black Box" alternative |
| Anticipatory Music Transformer | Probabilistic sequence generation | Foil in academic argument; illustrates "Structural Drift" failure mode |

---

## Qualitative Research Data

| Dataset | Type | Location | Notes |
|---|---|---|---|
| Think-Aloud Interview Transcripts | User study — composer workflows | NotebookLM `notebook-hf-academic` | Raw transcripts; demonstrate "Repair Phase Bottleneck" pain points |
| LLM-Assisted Qualitative Codebook | Thematic analysis codes | NotebookLM `notebook-hf-academic` | Coded using "Theory Named" prompting to prevent hallucination in qualitative analysis |

---

## Querying the NotebookLM Library

```bash
cd .claude/skills/notebooklm
python scripts/run.py auth_manager.py status
python scripts/run.py ask_question.py \
  --question "Your question here" \
  --notebook-url "https://notebooklm.google.com/notebook/e093ae79-f26b-43f5-90a7-340876833238"
```

Rate limit: 50 queries/day on free Google accounts. Prefer batch questions over multiple single queries.

---

## Related Folders

| Folder | Relationship |
|---|---|
| `docs/ontology/` | Domain entities defined using these research sources |
| `docs/adr/` | Architectural decisions motivated by research findings |
| `docs/patterns/` | Patterns derived from methodology research (Notebook 2) |
| `.claude/skills/notebooklm/` | Browser automation skill for querying notebooks |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-10 | user-selected-lines-users-shivpat | Task: `, and `<constraints>` XML structured blocks · Modified files: docs/quick-start.md, docs/context-engineering-guide.md · Constraint enforced: ` XML structured blocks · Constraint enforced: 194→- Derives touched directories from the collected paths · Agent (claude-sonnet-4-6 2026-03-10 09:24:43Z) That error confirms you're still in Ollama mode — Ollama doesn't have a model named claude-sonnet-4-6 . | [history](.specstory/history/2026-03-10_09-22-25Z-how-do-i-exit.md) | <!-- 5cc4504e-d1aa-4082-8d96-c6087a1dca01 -->
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
