#!/usr/bin/env python3
"""
scripts/specstory_analyze.py

Rule-based parser for SpecStory Markdown history files.

Extracts structured insights WITHOUT requiring claude -p:
  - Files created/modified (from tool-use blocks: Edit, Write, Bash)
  - Directories touched (inferred from file paths)
  - Key decisions (from XML structured blocks and agent text)
  - Session slug (from first user message)

Output: JSON matching the schema expected by specstory-to-context.sh
  {
    "session_uuid":        "<uuid or null>",
    "session_slug":        "<3-5 word lowercase-hyphenated description>",
    "directories_touched": ["src/components", "docs/adr", ...],
    "insights":            ["<one concrete decision or pattern per item>"]
  }

Usage:
  python3 scripts/specstory_analyze.py --file .specstory/history/2026-03-09_…md
  cat history.md | python3 scripts/specstory_analyze.py
  python3 scripts/specstory_analyze.py --file history.md --repo-root /path/to/repo
"""

import sys
import re
import json
import os
import argparse
from pathlib import Path
from collections import OrderedDict


# ---------------------------------------------------------------------------
# Regex constants
# ---------------------------------------------------------------------------

SESSION_UUID_RE = re.compile(
    r'Claude Code Session\s+([\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})',
    re.IGNORECASE,
)

# Turn boundaries — user and agent
USER_TURN_RE  = re.compile(r'_\*\*User\s*\(([^)]+)\)\*\*_')
AGENT_TURN_RE = re.compile(r'_\*\*Agent\s*\(([^)]+)\)\*\*_')
ANY_TURN_RE   = re.compile(r'_\*\*(?:User|Agent)\s*\([^)]+\)\*\*_')

# Tool-use blocks
TOOL_USE_RE = re.compile(
    r'<tool-use\s[^>]*data-tool-name="([^"]+)"[^>]*>(.*?)</tool-use>',
    re.DOTALL,
)

# Tool summary line (first non-empty line inside details, before the code block)
TOOL_SUMMARY_RE = re.compile(r'<summary>\s*Tool use:\s*\*\*([^*]+)\*\*\s*</summary>', re.DOTALL)

# Thinking/reasoning blocks (strip before analysis)
THINK_RE = re.compile(r'<think>.*?</think>', re.DOTALL)

# XML structured-block tags used in hci-protocol
XML_TAGS = ['context', 'task', 'constraints', 'output']
XML_BLOCK_RE = {
    tag: re.compile(rf'<{tag}>(.*?)</{tag}>', re.DOTALL)
    for tag in XML_TAGS
}

# File path pattern: anything that looks like a repo-relative path
# Must start with a known top-level directory or have a recognised extension
KNOWN_ROOTS = (
    'src/', 'docs/', 'scripts/', 'tests/', 'config/', 'public/',
    'specs/', '.claude/', 'references/', 'design-system',
)
FILE_PATH_RE = re.compile(
    r'(?<!["\'])(?:'
    r'(?:src|docs|scripts|tests|config|public|specs|\.claude|references|design-system)'
    r'[/\\][^\s"\'<>(){}|\[\]\\]+\.(?:ts|tsx|js|jsx|mjs|css|json|md|sh|py|txt|xml|html|svg)'
    r')',
    re.IGNORECASE,
)

# Inline code path (backtick-wrapped paths)
BACKTICK_PATH_RE = re.compile(
    r'`([a-zA-Z0-9_./-]+\.(?:ts|tsx|js|jsx|css|json|md|sh|py|txt|xml|html|svg))`'
)

# Tools that imply file writes (creates/modifications)
WRITE_TOOLS = {'Write', 'Edit', 'MultiEdit', 'NotebookEdit'}
READ_TOOLS  = {'Read', 'Glob', 'Grep', 'LS'}

# Decision/confirmation language for insight extraction
DECISION_RE = re.compile(
    r'(?:^|(?<=\.\s))([A-Z][^.!?\n]{20,160}'
    r'(?:implement|add|use|adopt|enforce|confirm|establish|refactor|create|introduc|replac|migrat|remov)'
    r'[^.!?\n]{0,100}[.!?])',
    re.IGNORECASE | re.MULTILINE,
)

# Vague / low-signal sentences to skip
VAGUE_PATTERNS = re.compile(
    r'\b(sure|hello|okay|ok|great|done|let me|I will|I\'ll|here|you can|'
    r'please|thank|working on|going to|now I)\b',
    re.IGNORECASE,
)

# Stop-words for slug generation
STOP_WORDS = {
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'be', 'this', 'that',
    'it', 'its', 'as', 'so', 'do', 'can', 'i', 'you', 'we', 'me', 'my',
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def dedupe_ordered(items):
    """Remove duplicates preserving order."""
    seen = OrderedDict()
    for item in items:
        key = item.strip().lower()[:80]
        if key and key not in seen:
            seen[key] = item.strip()
    return list(seen.values())


def clean_text(text: str) -> str:
    """Strip Markdown decorators and thinking blocks for plain-text analysis."""
    text = THINK_RE.sub('', text)
    text = re.sub(r'<[^>]+>', ' ', text)          # strip HTML/XML tags
    text = re.sub(r'[_*`#>~\[\]|]+', ' ', text)   # strip Markdown decorators
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_file_paths(text: str) -> list:
    """Extract repo-relative file paths from arbitrary text."""
    found = []
    for m in FILE_PATH_RE.finditer(text):
        found.append(m.group(0).rstrip('.,;:)'))
    for m in BACKTICK_PATH_RE.finditer(text):
        p = m.group(1)
        if any(p.startswith(r) for r in KNOWN_ROOTS) or '/' in p:
            found.append(p)
    return found


def paths_to_dirs(paths: list) -> list:
    """Convert file paths to unique parent directories."""
    dirs = OrderedDict()
    for p in paths:
        normalized = p.replace('\\', '/')
        parts = normalized.split('/')
        if len(parts) > 1:
            d = '/'.join(parts[:-1])
        else:
            d = '.'
        # Normalise: strip leading ./
        d = d.lstrip('./')
        if not d:
            d = '.'
        dirs[d] = True
    return list(dirs.keys())


# ---------------------------------------------------------------------------
# Parser
# ---------------------------------------------------------------------------

def parse_turns(text: str) -> list:
    """Split Markdown into structured turn dicts."""
    positions = [(m.start(), m.group()) for m in ANY_TURN_RE.finditer(text)]
    turns = []
    for i, (pos, header) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        body = text[pos:end]
        role = 'user' if USER_TURN_RE.match(header) else 'agent'
        turns.append({'role': role, 'text': body})
    return turns


def extract_tool_calls(agent_text: str) -> list:
    """Extract structured tool-call dicts from an agent turn."""
    calls = []
    for m in TOOL_USE_RE.finditer(agent_text):
        name = m.group(1)
        body = m.group(2)
        calls.append({'name': name, 'body': body})
    return calls


def extract_xml_blocks(text: str) -> dict:
    """Extract <context>, <task>, <constraints>, <output> content."""
    result = {}
    for tag, rx in XML_BLOCK_RE.items():
        m = rx.search(text)
        if m:
            result[tag] = m.group(1).strip()
    return result


def generate_slug(user_texts: list) -> str:
    """3-5 word slug from the first substantial user message."""
    for msg in user_texts:
        clean = clean_text(msg)
        words = [
            w.lower()
            for w in re.split(r'[\s\-_/\\]+', clean)
            if w and len(w) > 2 and w.lower() not in STOP_WORDS
            and re.match(r'^[a-z]', w.lower())
        ]
        if len(words) >= 3:
            return '-'.join(words[:5])
    return 'session-no-clear-task'


# ---------------------------------------------------------------------------
# Insight builders
# ---------------------------------------------------------------------------

def _insight_from_xml_task(xml: dict) -> str | None:
    task = xml.get('task', '')
    if not task or len(task) < 20:
        return None
    # First sentence of the task block
    first = re.split(r'[.!?\n]', task)[0].strip()
    if len(first) > 15:
        return f"Task: {first}"
    return None


def _insights_from_xml_constraints(xml: dict) -> list:
    constraints = xml.get('constraints', '')
    if not constraints:
        return []
    lines = [
        l.strip().lstrip('-•*').strip()
        for l in constraints.split('\n')
        if l.strip() and not l.strip().startswith('#')
    ]
    return [
        f"Constraint enforced: {l}"
        for l in lines
        if len(l) > 15
    ][:2]


def _insights_from_files_written(files: list) -> str | None:
    if not files:
        return None
    shown = files[:3]
    suffix = f' (+{len(files) - 3} more)' if len(files) > 3 else ''
    return f"Modified files: {', '.join(shown)}{suffix}"


def _insights_from_agent_decisions(agent_turns: list) -> list:
    """Mine agent free-text for decision/confirmation sentences."""
    found = []
    for turn in agent_turns:
        # Strip tool-use and thinking blocks
        clean = re.sub(r'<tool-use.*?</tool-use>', '', turn['text'], flags=re.DOTALL)
        clean = THINK_RE.sub('', clean)
        clean = clean_text(clean)

        for m in DECISION_RE.finditer(clean):
            sent = m.group(1).strip()
            if (
                20 < len(sent) < 200
                and not VAGUE_PATTERNS.search(sent)
                and len(found) < 6
            ):
                found.append(sent)
    return found


def _insights_from_bash_summary(tool_calls: list) -> list:
    """Extract meaningful bash commands as insights."""
    insights = []
    for call in tool_calls:
        if call['name'] != 'Bash':
            continue
        # The first backtick block is the command
        m = re.search(r'`([^`\n]{10,120})`', call['body'])
        if m:
            cmd = m.group(1).strip()
            # Only include if it's a meaningful dev command
            if any(kw in cmd for kw in ('npm', 'npx', 'tsc', 'next', 'git', 'specstory', 'brew')):
                insights.append(f"Command executed: {cmd[:100]}")
    return insights[:2]


# ---------------------------------------------------------------------------
# Main analyzer
# ---------------------------------------------------------------------------

def analyze(text: str, repo_root: str = '') -> dict:
    """
    Full pipeline:
      1. Parse turns
      2. Collect file paths from tool calls
      3. Extract XML structured blocks
      4. Generate slug and insights
      5. Return structured dict
    """
    # Session UUID
    session_uuid = None
    m = SESSION_UUID_RE.search(text[:500])  # Only check header
    if m:
        session_uuid = m.group(1)

    # Turn parsing
    turns      = parse_turns(text)
    user_turns  = [t for t in turns if t['role'] == 'user']
    agent_turns = [t for t in turns if t['role'] == 'agent']

    # --- File path collection ---
    all_paths: list = []
    files_written: list = []

    full_agent_text = ' '.join(t['text'] for t in agent_turns)
    all_tool_calls = extract_tool_calls(full_agent_text)

    for call in all_tool_calls:
        paths_in_body = extract_file_paths(call['body'])
        all_paths.extend(paths_in_body)
        if call['name'] in WRITE_TOOLS:
            files_written.extend(paths_in_body)

    # Also scan free-form agent text (not inside tool-use)
    agent_no_tools = re.sub(r'<tool-use.*?</tool-use>', '', full_agent_text, flags=re.DOTALL)
    agent_no_tools = THINK_RE.sub('', agent_no_tools)
    all_paths.extend(extract_file_paths(agent_no_tools))

    # Scan user messages too (file paths mentioned in requests)
    for turn in user_turns:
        all_paths.extend(extract_file_paths(turn['text']))

    all_paths    = dedupe_ordered(all_paths)
    files_written = dedupe_ordered(files_written)

    # --- XML structured blocks (from agent turns) ---
    xml = extract_xml_blocks(full_agent_text)

    # --- Directories ---
    dirs = paths_to_dirs(all_paths)
    if not dirs:
        dirs = ['.']

    # --- Slug ---
    user_raw_texts = [
        re.sub(r'_\*\*User[^*]*\*\*_\s*', '', t['text']).strip()
        for t in user_turns[:3]
    ]
    slug = generate_slug(user_raw_texts)

    # --- Insights pipeline (ordered by signal quality) ---
    insights: list = []

    # 1. XML task block — highest signal
    task_insight = _insight_from_xml_task(xml)
    if task_insight:
        insights.append(task_insight)

    # 2. Files written — concrete evidence
    files_insight = _insights_from_files_written(files_written)
    if files_insight:
        insights.append(files_insight)

    # 3. Constraints from XML — enforced rules
    insights.extend(_insights_from_xml_constraints(xml))

    # 4. Decision sentences from agent text
    decision_insights = _insights_from_agent_decisions(agent_turns)
    insights.extend(decision_insights)

    # 5. Notable bash commands
    insights.extend(_insights_from_bash_summary(all_tool_calls))

    # --- Deduplicate and cap ---
    insights = dedupe_ordered(insights)[:5]

    if not insights:
        # Fallback: summarise what was asked
        if user_raw_texts:
            first = clean_text(user_raw_texts[0])[:150]
            insights = [f"User request: {first}"]
        else:
            insights = ["Session processed — no structured insights extracted."]

    return {
        'session_uuid':        session_uuid,
        'session_slug':        slug,
        'directories_touched': dirs[:8],
        'insights':            insights,
    }


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description='Analyze a SpecStory Markdown history file.',
    )
    parser.add_argument(
        '--file', '-f',
        help='Path to the history .md file (reads stdin if omitted)',
    )
    parser.add_argument(
        '--repo-root',
        default='',
        help='Absolute path to the repo root (used for path normalisation)',
    )
    args = parser.parse_args()

    if args.file:
        with open(args.file, 'r', encoding='utf-8', errors='replace') as fh:
            text = fh.read()
    else:
        text = sys.stdin.read()

    if not text.strip():
        print(json.dumps({
            'session_uuid': None,
            'session_slug': 'empty-file',
            'directories_touched': ['.'],
            'insights': ['Session file was empty or unreadable.'],
        }))
        return

    result = analyze(text, repo_root=args.repo_root)
    print(json.dumps(result))


if __name__ == '__main__':
    main()
