#!/usr/bin/env bash
# scripts/specstory-to-context.sh
#
# Reads .specstory/history/*.md, runs the Python analysis layer
# (scripts/specstory_analyze.py) on each unprocessed session, then appends
# structured insights to the relevant CONTEXT.md files.
#
# Analysis pipeline (no LLM required):
#   1. Read session list from .specstory/statistics.json
#   2. Locate the corresponding history Markdown file
#   3. Run specstory_analyze.py → JSON (file paths, dirs, insights, slug)
#   4. Resolve nearest CONTEXT.md for each directory touched
#   5. Append a Markdown table row to each CONTEXT.md
#
# Idempotent: processed session IDs are recorded in .specstory/.processed.
#
# Usage:
#   bash scripts/specstory-to-context.sh              # process all new sessions
#   bash scripts/specstory-to-context.sh --dry-run    # preview without writing
#   bash scripts/specstory-to-context.sh --since=2026-03-01  # only sessions after date
#   bash scripts/specstory-to-context.sh --test       # run on one session, mock writes
#
# Requirements:
#   - python3 in PATH
#   - scripts/specstory_analyze.py exists (sibling of this script)
#   - .specstory/statistics.json exists

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SPECSTORY_DIR="$REPO_ROOT/.specstory"
HISTORY_DIR="$SPECSTORY_DIR/history"
PROCESSED_FILE="$SPECSTORY_DIR/.processed"
STATS_FILE="$SPECSTORY_DIR/statistics.json"
ANALYZER="$SCRIPT_DIR/specstory_analyze.py"
LOG_FILE="$SPECSTORY_DIR/run.log"

# --- Parse flags ---
DRY_RUN=false
SINCE_DATE=""
TEST_MODE=false

for arg in "$@"; do
  case "$arg" in
    --dry-run)  DRY_RUN=true ;;
    --test)     TEST_MODE=true ;;
    --since=*)  SINCE_DATE="${arg#--since=}" ;;
    --since)    shift; SINCE_DATE="${1:-}" ;;
  esac
done

# --- Guards ---
if [ ! -f "$STATS_FILE" ]; then
  echo "[specstory-to-context] ERROR: $STATS_FILE not found."
  exit 1
fi
if ! command -v python3 &>/dev/null; then
  echo "[specstory-to-context] ERROR: python3 not found in PATH."
  exit 1
fi
if [ ! -f "$ANALYZER" ]; then
  echo "[specstory-to-context] ERROR: $ANALYZER not found."
  echo "  Expected: scripts/specstory_analyze.py"
  exit 1
fi

if [ "$TEST_MODE" = true ]; then
  echo "[specstory-to-context] TEST MODE — processes one session; dry-run write."
  echo ""
fi

# ---------------------------------------------------------------------------
# Step 1: Read eligible sessions from statistics.json
# ---------------------------------------------------------------------------
SESSION_DATA=$(python3 - "$STATS_FILE" "${SINCE_DATE:-}" << 'PYEOF'
import json, sys

stats_file = sys.argv[1]
since_date = sys.argv[2] if len(sys.argv) > 2 else ""

with open(stats_file) as f:
    data = json.load(f)

sessions = data.get("sessions", {})
results = []
for sid, info in sessions.items():
    ts       = info.get("start_timestamp", "")
    msg_count = info.get("user_message_count", 0) + info.get("agent_message_count", 0)
    size     = info.get("markdown_size_bytes", 0)
    if msg_count < 2 or size < 3000:
        continue
    if since_date and ts < since_date:
        continue
    results.append((sid, ts, msg_count, size))

results.sort(key=lambda x: x[1])
for sid, ts, msg, sz in results:
    print(f"{sid}\t{ts}\t{msg}\t{sz}")
PYEOF
)

if [ -z "$SESSION_DATA" ]; then
  echo "[specstory-to-context] No eligible sessions found."
  exit 0
fi

# ---------------------------------------------------------------------------
# Initialise processed-session tracking file
# ---------------------------------------------------------------------------
touch "$PROCESSED_FILE"

echo "[specstory-to-context] Analysing sessions from $STATS_FILE..."

NEW_COUNT=0
SKIP_COUNT=0
ERROR_COUNT=0
TEST_DONE=false

# ---------------------------------------------------------------------------
# Step 2: Process each session
# ---------------------------------------------------------------------------
while IFS=$'\t' read -r SESSION_ID SESSION_TS MSG_COUNT SIZE_BYTES; do
  [ -z "$SESSION_ID" ] && continue

  # Test mode: handle only the first session
  if [ "$TEST_MODE" = true ] && [ "$TEST_DONE" = true ]; then
    continue
  fi

  # Idempotency prefix in test mode so real .processed is not polluted
  TRACKING_ID="${SESSION_ID}"
  [ "$TEST_MODE" = true ] && TRACKING_ID="TEST-${SESSION_ID}"

  if grep -qF "$TRACKING_ID" "$PROCESSED_FILE" 2>/dev/null; then
    SKIP_COUNT=$((SKIP_COUNT + 1))
    [ "$TEST_MODE" = true ] && TEST_DONE=true
    continue
  fi

  SESSION_DATE=$(printf '%s' "$SESSION_TS" | cut -c1-10)

  # -------------------------------------------------------------------------
  # Step 2a: Find the history file for this session UUID
  # -------------------------------------------------------------------------
  HISTORY_FILE=$(grep -rl "$SESSION_ID" "$HISTORY_DIR" 2>/dev/null | head -1 || true)

  if [ -z "$HISTORY_FILE" ]; then
    # Fall back: try to match by date prefix in the filename
    DATE_PREFIX=$(printf '%s' "$SESSION_TS" | cut -c1-10 | tr '-' '_' || true)
    HISTORY_FILE=$(ls "$HISTORY_DIR/${DATE_PREFIX}"*.md 2>/dev/null | head -1 || true)
  fi

  if [ -z "$HISTORY_FILE" ]; then
    echo "  [skip] $SESSION_ID — no history file found"
    printf '%s\n' "$TRACKING_ID" >> "$PROCESSED_FILE"
    continue
  fi

  SESSION_BASENAME=$(basename "$HISTORY_FILE")
  echo ""
  echo "  [processing] $SESSION_BASENAME  ($SIZE_BYTES bytes, $MSG_COUNT messages)"

  # -------------------------------------------------------------------------
  # Step 2b: Run the analysis layer
  # The analyzer reads the file directly; output is JSON written to a temp file
  # to avoid any shell argument-escaping issues with large strings.
  # -------------------------------------------------------------------------
  ANALYSIS_TMP=$(mktemp /tmp/specstory_analysis.XXXXXX.json)
  trap 'rm -f "$ANALYSIS_TMP"' EXIT

  if [ "$TEST_MODE" = true ]; then
    # Test mode: use real analyzer on the real file but suppress writes later
    python3 "$ANALYZER" \
      --file "$HISTORY_FILE" \
      --repo-root "$REPO_ROOT" \
      > "$ANALYSIS_TMP" 2>/dev/null || true
    TEST_DONE=true
  else
    python3 "$ANALYZER" \
      --file "$HISTORY_FILE" \
      --repo-root "$REPO_ROOT" \
      > "$ANALYSIS_TMP" 2>/dev/null || true
  fi

  # Check the analyzer produced valid JSON
  if [ ! -s "$ANALYSIS_TMP" ]; then
    echo "  [warn] analyzer produced empty output — skipping."
    printf '%s\n' "$TRACKING_ID" >> "$PROCESSED_FILE"
    ERROR_COUNT=$((ERROR_COUNT + 1))
    rm -f "$ANALYSIS_TMP"
    continue
  fi

  # -------------------------------------------------------------------------
  # Step 2c: Parse the JSON output with a short, focused Python snippet
  # Fields: session_slug, directories_touched, insights
  # -------------------------------------------------------------------------
  PARSE_OUTPUT=$(python3 - "$ANALYSIS_TMP" << 'PYEOF'
import json, sys

try:
    with open(sys.argv[1]) as f:
        d = json.load(f)
    slug  = str(d.get("session_slug", "unknown-session")).strip() or "unknown-session"
    dirs  = d.get("directories_touched", ["."])
    ins   = d.get("insights", [])
    print("SLUG:" + slug)
    for dr in dirs:
        print("DIR:" + str(dr).strip("/").strip())
    for i in ins:
        clean = str(i).replace("|", "\u2013").replace("\n", " ").strip()
        print("INS:" + clean)
except Exception as e:
    print("ERROR:" + str(e))
PYEOF
  )

  rm -f "$ANALYSIS_TMP"

  if printf '%s' "$PARSE_OUTPUT" | grep -q "^ERROR:"; then
    ERR=$(printf '%s' "$PARSE_OUTPUT" | grep "^ERROR:" | head -1 | sed 's/^ERROR://')
    echo "  [warn] JSON parse failed: $ERR"
    printf '%s\n' "$TRACKING_ID" >> "$PROCESSED_FILE"
    ERROR_COUNT=$((ERROR_COUNT + 1))
    continue
  fi

  SESSION_SLUG=$(printf '%s' "$PARSE_OUTPUT" | grep "^SLUG:" | head -1 | sed 's/^SLUG://')
  DIRS=$(printf '%s' "$PARSE_OUTPUT" | grep "^DIR:" | sed 's/^DIR://')
  INSIGHTS_LINES=$(printf '%s' "$PARSE_OUTPUT" | grep "^INS:" | sed 's/^INS://')

  # Collapse insights into a single pipe-table-safe cell
  if [ -n "$INSIGHTS_LINES" ]; then
    INSIGHTS_CELL=$(printf '%s' "$INSIGHTS_LINES" | tr '\n' '|' | sed 's/|/ · /g; s/ · $//')
  else
    INSIGHTS_CELL="Session processed — no distinct insights extracted."
  fi

  echo "  Slug   : $SESSION_SLUG"
  echo "  Dirs   : $(printf '%s' "$DIRS" | tr '\n' ' ')"

  # -------------------------------------------------------------------------
  # Step 3: Resolve nearest CONTEXT.md for each touched directory
  # -------------------------------------------------------------------------
  CONTEXT_TARGETS=""

  while IFS= read -r DIR_PATH; do
    [ -z "$DIR_PATH" ] && continue
    DIR_PATH="${DIR_PATH#./}"

    CHECK="$REPO_ROOT/$DIR_PATH"
    FOUND=""
    while true; do
      if [ -f "$CHECK/CONTEXT.md" ]; then
        REL="${CHECK#"$REPO_ROOT"/}"
        [ -z "$REL" ] && REL="."
        FOUND="$REL"
        break
      fi
      PARENT="$(dirname "$CHECK")"
      [ "$PARENT" = "$CHECK" ] && break
      if [ "$PARENT" = "$REPO_ROOT" ]; then
        [ -f "$REPO_ROOT/CONTEXT.md" ] && FOUND="."
        break
      fi
      CHECK="$PARENT"
    done

    [ -n "$FOUND" ] && CONTEXT_TARGETS="$CONTEXT_TARGETS"$'\n'"$FOUND"
  done <<< "$DIRS"

  # Always include root CONTEXT.md as a fallback
  [ -f "$REPO_ROOT/CONTEXT.md" ] && CONTEXT_TARGETS="$CONTEXT_TARGETS"$'\n'"."
  CONTEXT_TARGETS=$(printf '%s' "$CONTEXT_TARGETS" | sort -u | grep -v '^$')

  if [ -z "$CONTEXT_TARGETS" ]; then
    echo "  [warn] No CONTEXT.md targets resolved."
    printf '%s\n' "$TRACKING_ID" >> "$PROCESSED_FILE"
    continue
  fi

  # -------------------------------------------------------------------------
  # Step 4: Write to each resolved CONTEXT.md
  # -------------------------------------------------------------------------
  while IFS= read -r CTX_REL; do
    [ -z "$CTX_REL" ] && continue

    if [ "$CTX_REL" = "." ]; then
      CTX_FILE="$REPO_ROOT/CONTEXT.md"
    else
      CTX_FILE="$REPO_ROOT/$CTX_REL/CONTEXT.md"
    fi

    [ ! -f "$CTX_FILE" ] && continue

    # Idempotency: skip if session already recorded in this file
    if grep -qF "$SESSION_ID" "$CTX_FILE" 2>/dev/null; then
      echo "  [skip] ${CTX_REL}/CONTEXT.md — already recorded"
      continue
    fi

    if [ "$DRY_RUN" = true ] || [ "$TEST_MODE" = true ]; then
      echo "  [dry-run] Would append to ${CTX_REL}/CONTEXT.md"
      echo "            $SESSION_DATE | $SESSION_SLUG | $INSIGHTS_CELL"
      continue
    fi

    # Create Session Insights section header if absent
    if ! grep -q "^## Session Insights" "$CTX_FILE" 2>/dev/null; then
      {
        printf '\n---\n\n## Session Insights\n\n'
        printf '*Auto-populated by scripts/specstory-to-context.sh from .specstory/history/*\n\n'
        printf '| Date       | Session               | Insights                          | Source |\n'
        printf '| ---------- | --------------------- | --------------------------------- | ------ |\n'
      } >> "$CTX_FILE"
    fi

    # Append table row; embed session ID in HTML comment for idempotency
    printf '| %s | %s | %s | [history](.specstory/history/%s) | <!-- %s -->\n' \
      "$SESSION_DATE" \
      "$SESSION_SLUG" \
      "$INSIGHTS_CELL" \
      "$SESSION_BASENAME" \
      "$SESSION_ID" >> "$CTX_FILE"

    echo "  [wrote] ${CTX_REL}/CONTEXT.md"
  done <<< "$CONTEXT_TARGETS"

  # In dry-run mode: do not record as processed so a real run can write later
  if [ "$DRY_RUN" = false ]; then
    printf '%s\n' "$TRACKING_ID" >> "$PROCESSED_FILE"
  fi
  NEW_COUNT=$((NEW_COUNT + 1))

done <<< "$SESSION_DATA"

echo ""
echo "[specstory-to-context] Done."
printf "  New sessions processed : %d\n" "$NEW_COUNT"
printf "  Already processed      : %d\n" "$SKIP_COUNT"
printf "  Errors / skipped       : %d\n" "$ERROR_COUNT"
[ "$DRY_RUN" = true ] && echo "  (dry-run — no files written)"

# --- Write log entry (always, even on dry-run, so hook activity is visible) ---
printf '%s  new=%d  skipped=%d  errors=%d%s\n' \
  "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
  "$NEW_COUNT" "$SKIP_COUNT" "$ERROR_COUNT" \
  "$([ "$DRY_RUN" = true ] && echo '  [dry-run]' || true)" \
  >> "$LOG_FILE"
