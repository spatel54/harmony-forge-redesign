#!/bin/bash
# loop.sh — Ralph Wiggum autonomous execution loop (ADR-001)
#
# WARNING: Uses --dangerously-skip-permissions to bypass Claude Code's safety prompts.
# Only run this on an isolated feature branch, never directly on main.
# Superman must explicitly authorize each session before starting this script.
#
# Prerequisites:
#   - claude CLI installed: npm install -g @anthropic-ai/claude-code
#   - Working on a non-main branch: git checkout -b feature/<phase>
#   - IMPLEMENTATION_PLAN.md populated (run PROMPT_plan.md first)
#   - All backpressure commands passing: npx tsc --noEmit && npm run lint && npm run build

set -euo pipefail

BRANCH=$(git branch --show-current)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "master" ]; then
  echo "ERROR: loop.sh must not run on the main/master branch."
  echo "Create a feature branch first: git checkout -b feature/<phase>"
  exit 1
fi

echo "=========================================="
echo "Ralph Wiggum Loop — HarmonyForge"
echo "Branch: $BRANCH"
echo "Model:  claude-opus-4-6"
echo "=========================================="
echo "Starting loop. Press Ctrl+C to stop."
echo ""

ITERATION=0

while true; do
  ITERATION=$((ITERATION + 1))
  echo "------------------------------------------"
  echo "Iteration $ITERATION — $(date '+%Y-%m-%d %H:%M:%S')"
  echo "------------------------------------------"

  cat PROMPT_build.md | claude -p --dangerously-skip-permissions --model claude-opus-4-6

  echo ""
  echo "Iteration $ITERATION complete. Restarting in 3 seconds..."
  sleep 3
done
