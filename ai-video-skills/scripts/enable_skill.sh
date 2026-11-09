#!/usr/bin/env bash
# Link one catalog skill into ~/.claude/skills so Claude loads it in every session.
# usage: scripts/enable_skill.sh <skill-name> [link-name]      (scripts/enable_skill.sh --list  shows enabled ones)
# Only SAFE-graded repos can be enabled. Keep the enabled set small: every enabled skill's description
# is loaded into every session's context.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$HOME/.claude/skills"
if [[ "${1:-}" == "--list" ]]; then find "$DEST" -maxdepth 1 -type l -exec sh -c 'printf "%s -> %s\n" "$(basename "$1")" "$(readlink "$1")"' _ {} \; | grep ai-video-skills/catalog || true; exit; fi
NAME="${1:?skill name}"; LINK="${2:-$NAME}"
read -r SKILLDIR GRADE < <(python3 - "$ROOT" "$NAME" <<'PY'
import json, os, sys
root, name = sys.argv[1], sys.argv[2]
for r in json.load(open(os.path.join(root, 'catalog', 'catalog.json')))['repos']:
    for s in r['skills']:
        if s['name'] == name:
            print(os.path.join(root, os.path.dirname(s['path'])), r['grade']); sys.exit()
print('- -')
PY
)
[[ "$SKILLDIR" == "-" ]] && { echo "No skill named '$NAME'. Try: python3 scripts/find_skill.py $NAME"; exit 1; }
[[ "$GRADE" != "safe" ]] && { echo "'$NAME' is in a CAUTION-graded repo. Read its SKILL.md and scripts first; enable by hand if you trust it."; exit 1; }
[[ -e "$DEST/$LINK" ]] && { echo "$DEST/$LINK already exists; pass a different link name."; exit 1; }
ln -s "$SKILLDIR" "$DEST/$LINK" && echo "enabled: $LINK -> $SKILLDIR"
