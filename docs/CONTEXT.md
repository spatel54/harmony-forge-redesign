# CONTEXT.md — docs/

*Project documentation root. Architecture decisions, design artifacts, operational notes, and archived history.*

---

## Ontology

| Term | Definition |
|---|---|
| **ADR** | Architecture Decision Record — permanent, immutable log of why a decision was made |
| **Accepted** | ADR status meaning: in effect, binding, and frozen |
| **Superseded** | ADR status meaning: replaced by a newer ADR; old record is frozen but preserved |
| **Spec** | Separate from docs/ — lives in `specs/` — defines user outcomes and acceptance criteria |
| **Operational Note** | Mutable how-to guidance in `docs/notes/` — updated as workflow evolves |

---

## Decisions

- **`docs/` is read-heavy**: Most files here are reference material and permanent records, not actively edited working files
- **ADRs are immutable once Accepted**: The only edits allowed on an Accepted ADR are the status line (to mark as Superseded), typo fixes, and adding reference links

---

## Patterns

- ADR naming: `ADR-NNN-kebab-case-title.md` in `docs/adr/`
- Operational guides: mutable Markdown in `docs/notes/`
- Design artifacts: `.pen` files and `system.md` in `docs/design/`
- Retired documents: moved (never deleted) to `docs/archive/`

---

## Policies

- **Never delete a document** — archive it instead; history is permanent
- **Never edit rationale, options, or consequences in an Accepted ADR** — supersede it
- **No code in `docs/`** — documentation only

---

## Structure

| Subdirectory | Category | Contents |
|---|---|---|
| `docs/adr/` | **Decisions** | Architecture Decision Records — immutable, permanent |
| `docs/ontology/` | **Ontology** | Domain entity definitions, music theory glossary, entity relationships |
| `docs/patterns/` | **Patterns** | Recurring implementation patterns (VexFlow, Zustand, Tone.js, workflow) |
| `docs/policies/` | **Policies** | Non-negotiable constraints (mirrors `.claude/rules/`) |
| `docs/research/` | **Research** | External sources, NotebookLM registry, academic citations |
| `docs/notes/` | Operational | Mutable how-to guides |
| `docs/design/` | Design | `.pen` files and design system artifacts |
| `docs/archive/` | Archive | Retired documents (never deleted) |

---

## Research

| Resource | Purpose |
|---|---|
| `docs/quick-start.md` | **Operative entry point** — workflow decision tree, Ollama, CONTEXT.md update, git workflow |
| `docs/context-engineering-guide.md` | Full glossary of workflow terms (archive reference) |
| `docs/notes/prompting-guide.md` | Stage-by-stage prompt guide (archive reference) |
| `docs/adr/overview.md` | Index of all ADRs with status |
| `docs/research/CONTEXT.md` | NotebookLM notebook registry and academic citations |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-02-24 | user-opened-file-users-shivpat | Modified files: .claude/settings.js, .claude/rules/hci-protocol.md, .claude/rules/music-theory.md (+1 more) · Agent (claude-sonnet-4-6 2026-02-24 18:13:42Z) Agent - sidechain (2026-02-24 18:13:07Z) The user has a CLAUDE. · They want to know: how can they enforce these instructions so Claude Code reliably follows them? · Execution : Only after approval granted ENFORCE THIS: Never blend preview and execution in same message. · Hook-Based Enforcement (PreToolUse / UserPromptSubmit) Add a UserPromptSubmit hook in . | [history](.specstory/history/2026-02-24_18-10-46Z-the-user-has-a.md) | <!-- 1f3e1535-2fb1-4cf4-9dec-6cfe4c43bc05 -->
| 2026-02-25 | user-opened-file-users-shivpat | Modified files: .claude/mcp.js, .claude/settings.js · Use the claude mcp add command: bash claude mcp add --transport http figma https://mcp. · Add the server bash claude mcp add --transport http figma https://mcp. · Select figma → Authenticate and complete the browser OAuth flow The server will be available across all your projects (user scope). | [history](.specstory/history/2026-02-25_08-07-49Z-how-do-i-enable.md) | <!-- 6726cd94-3626-4543-ae43-80757326f683 -->
| 2026-03-02 | user-opened-file-users-shivpat | Task: `, `<constraints>`, `<output>` tags – 48–53 – High – · Modified files: .claude/plans/crispy-herding-pond.md, .claude/rules/hci-protocol.md, /Users/shivpat/harmony-forge-redesign/.claude/rules/hci-protocol.md (+5 more) · Constraint enforced: ` — no hallucination, cite sources, use intrinsic determinism. · Constraint enforced: 36→3. Deliver without further restructuring unless requested. · A SHAP plot is mathematically valid but requires statistical literacy most end users lack. | [history](.specstory/history/2026-03-02_03-24-18Z-search-for-anthropic-s.md) | <!-- 778555f2-d6d3-4b03-95e8-3b7e13f81c9a -->
| 2026-03-06 | https:-github.com-pablodelucca-pixel-agents.git | Task: Clone the pixel-agents repository and set it up as a runnable local project: · Constraint enforced: Target directory: sibling to harmony-forge-redesign (e.g., ~/pixel-agents) to · Constraint enforced: avoid polluting this workspace · The extensions directory confirms it — /. · Go back to the Pixel Agents panel — click + Agent button — this spawns a Claude Code terminal and creates a character 6. | [history](.specstory/history/2026-03-06_10-20-54Z.md) | <!-- db51d38a-bc95-4313-843f-1250cb466a26 -->
| 2026-03-09 | user-opened-file-users-shivpat | Modified files: docs/ollama-claude-code-setup.md · Agent (claude-sonnet-4-6 2026-03-09 17:52:02Z) The page shows how to configure Claude Code to use Ollama's Anthropic-compatible API. · qwen3-coder pull — running in background (recommended model from the docs) To use once the model downloads: shell Open a new terminal (or source /. · Step 2 — Reload your shell (picks up the env vars we added to . · Agent (claude-sonnet-4-6 2026-03-09 18:06:21Z) Created docs/ollama-claude-code-setup. | [history](.specstory/history/2026-03-09_17-51-02Z-hash-hash-documentation-index.md) | <!-- f8d4871c-2e67-4641-9add-a4f5899b76cf -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Agent (claude-sonnet-4-6 2026-02-24 18:13:42Z) Agent - sidechain (2026-02-24 18:13:07Z) The user has a CLAUDE. · They want to know: how can they enforce these instructions so Claude Code reliably follows them? | [history](.specstory/history/2026-03-10_08-57-14Z-you-are-a-context.md) | <!-- acf71aff-7c82-483e-8b30-e2039e21e03b -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | bash theme={null} Basic syntax claude mcp add --transport http Real example: Connect to Notion claude mcp add --transport http notion https://mcp. · bash theme={null} Basic syntax claude mcp add --transport sse Real example: Connect to Asana claude mcp add --transport sse asana https://mcp. · bash theme={null} Basic syntax claude mcp add options -- args. · For example: claude mcp add --transport stdio myserver -- npx server → runs npx server claude mcp add --transport stdio --env KEY=value myserver -- python server. · To increase this limit, set the MAX MCP OUTPUT TOKENS environment variable (for example, MAX MCP OUTPUT TOKENS=50000 ) Use /mcp to authenticate with remote servers that require OAuth 2. | [history](.specstory/history/2026-03-10_08-57-28Z-you-are-a-context.md) | <!-- 1b607fa3-c02f-43ea-9c78-d2516a4f691c -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Task: Clone the pixel-agents repository and set it up as a runnable local project: · Constraint enforced: Target directory: sibling to harmony-forge-redesign (e.g., ~/pixel-agents) to · Constraint enforced: avoid polluting this workspace · Agent (claude-sonnet-4-6 2026-03-06 10:27:21Z) Tool use: Read . · Run your first skill : 85→ 86→ "Use @brainstorming to plan a SaaS MVP. | [history](.specstory/history/2026-03-10_08-58-53Z-you-are-a-context.md) | <!-- 0b0c58d1-4f4f-43a1-b0d4-bd1ee4fb24eb -->
| 2026-03-10 | user-selected-lines-users-shivpat | Task: `, and `<constraints>` XML structured blocks · Modified files: docs/quick-start.md, docs/context-engineering-guide.md · Constraint enforced: ` XML structured blocks · Constraint enforced: 194→- Derives touched directories from the collected paths · Agent (claude-sonnet-4-6 2026-03-10 09:24:43Z) That error confirms you're still in Ollama mode — Ollama doesn't have a model named claude-sonnet-4-6 . | [history](.specstory/history/2026-03-10_09-22-25Z-how-do-i-exit.md) | <!-- 5cc4504e-d1aa-4082-8d96-c6087a1dca01 -->
| 2026-03-10 | how-use-claude-terminal? | Agent (claude-sonnet-4-6 2026-03-10 14:35:14Z) Agent - sidechain (2026-03-10 14:34:54Z) The user wants to know how to use the Claude Code terminal/CLI tool. · Be specific : Instead of "fix the bug," say "fix the login bug where users see a blank screen after wrong credentials. · Search history efficiently : Use Ctrl+R to reverse-search previous commands. · Project-Specific Configuration Create a . · The keyboard shortcuts and / commands are your fastest paths to power-user workflows. | [history](.specstory/history/2026-03-10_09-26-03Z-hello.md) | <!-- cb8ed93c-1857-4bd2-baf2-597a8641ee4b -->
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
