# CONTEXT.md — scripts/

*Utility scripts — non-application automation. Currently contains a single test helper.*

---

## Ontology

| Term | Definition |
|---|---|
| **Utility Script** | A standalone script that automates a development task — not part of the application bundle |

---

## Decisions

- **Scripts are dev tooling only** — not imported by application code

---

## Patterns

- Scripts are standalone (`.js` or `.ts`) files — not wrapped in a framework
- Scripts may import from `node_modules` but not from `src/`

---

## Policies

- **No application logic in `scripts/`** — scripts automate development tasks, not feature behavior
- **No secrets or credentials** — scripts that need env vars read from `.env.local` via `process.env`

---

## Files

| File | Purpose |
|---|---|
| `test-export-modal.js` | Manual test helper for the Export Modal component |
| `specstory-to-context.sh` | SpecStory → CONTEXT.md distiller — reads `.specstory/history/`, extracts insights via `specstory_analyze.py`, appends session rows to relevant `*/CONTEXT.md` files. Run with `--dry-run` to preview. Registered as a `Stop` hook in `.claude/settings.json`. |
| `specstory_analyze.py` | Rule-based SpecStory Markdown parser — extracts touched files, XML task blocks, constraint enforcements, and agent decisions from history files. Outputs structured JSON. Called by `specstory-to-context.sh`; can be run directly: `python3 scripts/specstory_analyze.py --file .specstory/history/<file>.md` |

---

## Research

| Resource | Purpose |
|---|---|
| `package.json` | `npm run` script definitions |

---

## Session Insights

*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*

| Date       | Session               | Insights                          | Source |
| ---------- | --------------------- | --------------------------------- | ------ |
| 2026-03-02 | https:-github.com-ruvnet-ruflo-analyze | Shallow-clone ruvnet/ruflo (--depth 1) into /Users/shivpat/ruflo/ (sibling to harmony-forge-redesign) 2. · Shall I proceed with the implementation as described above? · Recommendation: Do not run npm install inside /Users/shivpat/ruflo/ . · The MCP server is invoked via npx (which runs from the registry, not from this local clone) so no install is needed to use Ruflo. · Agent (claude-sonnet-4-6 2026-03-02 01:06:50Z) Repo is at /Users/shivpat/ruflo/ (shallow, read-only). | [history](.specstory/history/2026-03-02_00-55-08Z-command-message-ui-ux.md) | <!-- d6a8d525-626e-4b50-a9e7-8d7bccfa39a8 -->
| 2026-03-02 | user-opened-file-temp-readonly | Modified files: .claude/rules/typescript-patterns.md, .claude/skills/ui-ux-pro-max/scripts/auto_search.py, .claude/settings.js (+6 more) · task: Assess what the skill actually offers, run its search CLI against HarmonyForge use-cases, and identify which skill capabilities are net-additive vs. · Install report (what uipro init adds to . · Integration recommendation: which skill features to use, which to guard against --- Meta-Rewrite What is the user actually asking for? · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-02_00-57-10Z.md) | <!-- 7287ed76-f923-471b-ab75-2fc62b756a44 -->
| 2026-03-09 | user-opened-file-temp-readonly | Task: Introduce a single new token --sonata-accent-accessible in globals · Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+69 more) · Constraint enforced: Only globals.css changes — no component files touched · Constraint enforced: --sonata-accent: #ffb300 is preserved; only the two WCAG-critical usages are · Agent (claude-sonnet-4-6 2026-03-09 09:13:09Z) All 9 files created and verified. | [history](.specstory/history/2026-03-09_08-19-49Z-your-task-is-to.md) | <!-- d8ed8743-2cb1-4aa0-be80-c6d18b6b1381 -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Shallow-clone ruvnet/ruflo (--depth 1) into /Users/shivpat/ruflo/ (sibling to harmony-forge-redesign) 2. · Shall I proceed with the implementation as described above? · Agent (claude-sonnet-4-6 2026-03-02 01:04:17Z) Tool use: Read /Users/shivpat/ruflo/CLAUDE. · Spawn teammates in background : Use run in background: true for parallel work 636→2. · Create tasks first : Use TaskCreate before spawning teammates so they have work 637→3. | [history](.specstory/history/2026-03-10_08-57-53Z-you-are-a-context.md) | <!-- e0359d9b-5682-4820-a5cf-c114e164db6d -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | task: Assess what the skill actually offers, run its search CLI against HarmonyForge use-cases, and identify which skill capabilities are net-additive vs. · Install report (what uipro init adds to . · Integration recommendation: which skill features to use, which to guard against --- Meta-Rewrite What is the user actually asking for? · Shall I proceed with the implementation as described above? · Agent (claude-sonnet-4-6 2026-03-02 01:07:04Z) Tool use: Bash Search WCAG color contrast guidelines python3 /tmp/uipro-test/. | [history](.specstory/history/2026-03-10_08-57-56Z-you-are-a-context.md) | <!-- 86be8988-f324-4154-b985-e5bc13a67ecc -->
| 2026-03-10 | context-distiller-harmonyforge-project-typescript, | Modified files: docs/adr/overview.md, docs/adr/template.md, docs/adr/ADR-001-adopt-ralph-wiggum-loop.md (+4 more) | [history](.specstory/history/2026-03-10_08-59-04Z-you-are-a-context.md) | <!-- 8eed7d8a-a9ea-422c-bdd1-86027780f9f2 -->
| 2026-03-10 | processing-user-has-a.md-bytes, | Modified files: scripts/specstory_analyze.py, scripts/specstory-to-context.sh, .claude/settings.js (+3 more) · Agent (claude-sonnet-4-6 2026-03-10 09:01:02Z) Tool use: Bash ls /Users/shivpat/harmony-forge-redesign/. · Agent (claude-sonnet-4-6 2026-03-10 09:02:09Z) Tool use: Bash head -200 "/Users/shivpat/harmony-forge-redesign/. · Constraints from XML — enforced rules insights. · Agent (claude-sonnet-4-6 2026-03-10 09:11:03Z) Confirmed empty. | [history](.specstory/history/2026-03-10_09-00-29Z-command-name-compact-command.md) | <!-- 63eaf8f4-b65c-4f38-97fd-cbefcb234916 -->
| 2026-03-10 | user-selected-lines-users-shivpat | Task: `, and `<constraints>` XML structured blocks · Modified files: docs/quick-start.md, docs/context-engineering-guide.md · Constraint enforced: ` XML structured blocks · Constraint enforced: 194→- Derives touched directories from the collected paths · Agent (claude-sonnet-4-6 2026-03-10 09:24:43Z) That error confirms you're still in Ollama mode — Ollama doesn't have a model named claude-sonnet-4-6 . | [history](.specstory/history/2026-03-10_09-22-25Z-how-do-i-exit.md) | <!-- 5cc4504e-d1aa-4082-8d96-c6087a1dca01 -->
| 2026-03-10 | most-recent-explicit-guidance-superman | Task: (1) Run `bash scripts/specstory-to-context · Modified files: src/store/useUploadStore.ts, src/store/useEnsembleStore.ts, src/store/useSandboxStore.ts (+32 more) · Constraint enforced: Planning phase only — zero source code generated · Constraint enforced: Tasks scoped to single component/hook, completable in one context window · Shall I proceed with the implementation as described above? | [history](.specstory/history/2026-03-10_15-57-11Z-the-most-recent-explicit.md) | <!-- 817084a8-8da2-4624-933e-639945f36647 -->
| 2026-03-10 | user-opened-file-users-shivpat | Modified files: specs/001-satb-sandbox.md, docs/adr/overview.md, specs/002-theory-tags.md (+5 more) · Skills (invoked with /skill-name ) are extensible workflows you or Claude can create: - Stored in . · Best for straightforward tasks like simple refactors or basic explanations. · Recommended for complex architectural decisions, challenging bugs, or multi-step implementation planning. · On other models (Haiku, older Sonnet/Opus versions), thinking uses a fixed budget instead. | [history](.specstory/history/2026-03-10_15-28-35Z-https-notebooklm-google-com.md) | <!-- a2ca65f7-c568-41ba-bae9-03420179d99a -->
| 2026-03-11 | caveat:-messages-below-were-generated | Task: Create src/lib/audio/usePlayback · Modified files: src/store/CONTEXT.md, src/components/organisms/CONTEXT.md, src/lib/audio/CONTEXT.md (+18 more) · Constraint enforced: Dynamic import: import('tone') inside useEffect to avoid SSR crash · Constraint enforced: Symbolic scheduling only — no AudioContext, no AudioBuffer, no raw sample loading · Create src/lib/audio/usePlayback. | [history](.specstory/history/2026-03-10_20-56-45Z-command-name-compact-command.md) | <!-- 153e7f6a-3f48-4e69-b764-40c201f0a20b -->
| 2026-03-17 | user-selected-lines-users-shivpat | It answers: What does this feature do, from the user's perspective? | [history](.specstory/history/2026-03-17_18-40-35Z-explain-adr-versus-spec.md) | <!-- f9b2931c-8226-4a5a-88b9-b952dea278ec -->
