# Claude Code Configuration - Claude Flow V3

## Always-Active Rules (MANDATORY — load every session)

The following rule files are always in effect. Read each one before taking any action:

- Interaction workflow (preview → gate → execute): `.claude/rules/hci-protocol.md`
- Music theory constraints (Theory Named strategy, SATB, Glass Box): `.claude/rules/music-theory.md`
- Code style and architecture boundaries (TypeScript, Tailwind, VexFlow, Tone.js): `.claude/rules/typescript-patterns.md`
- Output completeness (no `// ...`, no skipped sections, no partial code): `.claude/rules/output-completeness.md`
- Structured block few-shot examples: `.claude/rules/examples.md`
- Context workflow (Research → Plan → Implement, loop vs. FIC, ADR trigger, context window rules): `.claude/rules/context-workflow.md`

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (\*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## 🛠 Skill Trigger Protocol

- **Syntax**: Trigger specialists using `@skill-name`.
- **Primary Repos**:
  - `.claude/skills/`: Local orchestration agents (e.g., `@swarm-orchestration`).
  - `references/antigravity-awesome-skills/`: 1000+ engineering specialists (e.g., `@typescript-expert`).
  - `references/ui-ux-pro-max-skill/`: Design intelligence (e.g., `@taste-skill`).
- **Commands**:
  - Engineering/specialist skills: `python3 references/antigravity-awesome-skills/scripts/search.py <query> --limit 5`
  - Design research: `python3 references/ui-ux-pro-max-skill/scripts/search.py`

### Antigravity Skills Enforcement (ALWAYS REQUIRED)

BEFORE starting any specialist task — coding, architecture, security, testing, DevOps, accessibility, or domain-specific work — you MUST:

1. Run `python3 references/antigravity-awesome-skills/scripts/search.py <relevant-keywords> --limit 5`
2. Read the top matching `SKILL.md` file at the returned path
3. Apply the skill's constraints and patterns to your implementation

Do NOT skip this step. It applies to every non-trivial task. The catalog has 1006 skills — there is almost always a relevant specialist. Surface the top results before writing any code.

## 🚀 Top Orchestration & Core Skills

| Trigger                            | Focus           | Purpose                                       |
| :--------------------------------- | :-------------- | :-------------------------------------------- |
| **`@swarm-orchestration`**         | Multi-Agent     | Spawn complex parallel development tasks.     |
| **`@v3-ddd-architecture`**         | Domain Design   | Enforce DDD for music theory core logic.      |
| **`@agentdb-memory-patterns`**     | Project Memory  | Manage HNSW search and hybrid memory context. |
| **`@verification-quality`**        | QA/Testing      | Automated verification and linting protocols. |
| **`@sparc-methodology`**           | Workflow        | Systemic Spec -> Plan -> Action -> Review.    |
| **`@pair-programming`**            | Collaboration   | Optimized mode for real-time pairing.         |
| **`@skill-builder`**               | Customization   | Create new, permanent project skills.         |
| **`rule:music-theory.md`**         | Academic        | Enforce strict "Theory Named" definitions.    |
| **`rule:hci-protocol.md`**         | UI/UX           | Modular, "Glass Box" UI engineering rules.    |
| **`rule:typescript-patterns.md`**  | Code Quality    | Strict typing and performance for Next.js 15. |
| **`@github-code-review`**          | Code Review     | Systematic, line-by-line repo audits.         |
| **`@v3-swarm-coordination`**       | Advanced Swarm  | Parallelize tasks across 15+ agents.          |
| **`@stream-chain`**                | Visualization   | Trace complex logical flows during execution. |
| **`@browser`**                     | UI Verification | Automated Playwright verification.            |
| **`@v3-performance-optimization`** | Optimization    | Next.js bundle and hydration tuning.          |

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier  | Handler              | Latency | Cost         | Use Cases                                           |
| ----- | -------------------- | ------- | ------------ | --------------------------------------------------- |
| **1** | Agent Booster (WASM) | <1ms    | $0           | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku                | ~500ms  | $0.0002      | Simple tasks, low complexity (<30%)                 |
| **3** | Sonnet/Opus          | 2-5s    | $0.003-0.015 | Complex reasoning, architecture, security (>30%)    |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command     | Subcommands | Description                        |
| ----------- | ----------- | ---------------------------------- |
| `init`      | 4           | Project initialization             |
| `agent`     | 8           | Agent lifecycle management         |
| `swarm`     | 6           | Multi-agent swarm coordination     |
| `memory`    | 11          | AgentDB memory with HNSW search    |
| `task`      | 6           | Task creation and lifecycle        |
| `session`   | 7           | Session state management           |
| `hooks`     | 17          | Self-learning hooks + 12 workers   |
| `hive-mind` | 6           | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development

`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized

`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination

`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository

`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology

`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: <https://github.com/ruvnet/claude-flow>
- Issues: <https://github.com/ruvnet/claude-flow/issues>

## Frequent Intentional Compaction (FIC) Workflow

FIC is a three-phase workflow for complex, multi-turn implementation tasks.
Each phase ends with an explicit `/compact` call, so the next phase begins with
a dense, structured context (the artifact file) rather than a degraded
conversation history. Use FIC for any task that spans more than one session or
touches more than ~4 subtasks (Liu et al., 2023 — "lost in the middle").

### When to Use FIC

- Feature implementation touching more than 3 files
- Bug investigations requiring codebase exploration before a fix
- Refactors needing a plan before any code is written
- Any task where context degradation across turns is a realistic risk

### The Three Commands

| Command | Purpose | Run `/compact` after? |
| --- | --- | --- |
| `/research_codebase <topic>` | Explore codebase; write timestamped research artifact | Yes — always |
| `/create_plan <topic>` | Read research; write phased plan artifact with confirmation gate | Yes — always |
| `/implement_plan <topic> phase:<N>` | Execute one plan phase; verify; update artifact status | Yes — if more phases remain |

### Artifact Locations

All FIC artifacts live inside `.claude/thoughts/shared/` — never in the root folder.

```text
.claude/thoughts/shared/
  research/   ← YYYY-MM-DD_HH-MM-SS_<slug>.md  (timestamped, one per research pass)
  plans/      ← <slug>.md  (overwritten on re-plan — idempotent)
```

Directories are created automatically on first use.

### Standard FIC Sequence

```text
1. /research_codebase <topic>
2. /compact
3. /create_plan <topic>
   → confirm gate → "Yes"
4. /compact
5. /implement_plan <topic> phase:1
6. /compact
7. /implement_plan <topic> phase:2
8. /compact
   ... (repeat for each phase)
```

### Integration with HCI Protocol

FIC does not bypass the preview → gate → execute workflow. `/create_plan`
produces the XML structured block (`<context>`, `<task>`, `<constraints>`,
`<output>`) and ends with the verbatim confirmation gate before writing any
plan. `/implement_plan` emits a scope statement and pauses before executing.

### Integration with Antigravity Skills

All three FIC commands begin with a mandatory Antigravity skill search (Step 0).
The skill name is recorded in every artifact header so the constraint source is
auditable across sessions. The search command:

```bash
python3 references/antigravity-awesome-skills/scripts/search.py <topic> --limit 5
```
