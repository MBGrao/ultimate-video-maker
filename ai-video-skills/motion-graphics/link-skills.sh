#!/bin/bash
# Link the motion-graphics skills so Claude Code / Cursor can load them.
#   bash link-skills.sh            -> this project only (brag/.claude/skills)
#   bash link-skills.sh --global   -> also ~/.claude/skills (every project)
#   bash link-skills.sh --remove [--global] -> remove the links this script made
set -euo pipefail
MG="$(cd "$(dirname "$0")" && pwd)"
PROJECT_SKILLS="$(cd "$MG/../.." && pwd)/.claude/skills"
TARGETS=("$PROJECT_SKILLS")
REMOVE=0
for a in "$@"; do
  case "$a" in
    --global) TARGETS+=("$HOME/.claude/skills") ;;
    --remove) REMOVE=1 ;;
  esac
done
for D in "${TARGETS[@]}"; do
  mkdir -p "$D"
  while read -r name rel; do
    [ -z "$name" ] && continue
    src="$MG/$rel"; dst="$D/$name"
    if [ "$REMOVE" = 1 ]; then
      if [ -L "$dst" ] && [ "$(readlink "$dst")" = "$src" ]; then rm "$dst"; echo "removed $dst"; fi
      continue
    fi
    [ -f "$src/SKILL.md" ] || { echo "skip $name (no SKILL.md at $src)"; continue; }
    if [ -e "$dst" ] || [ -L "$dst" ]; then echo "exists, skipped: $dst"; continue; fi
    ln -s "$src" "$dst" && echo "linked $dst"
  done < "$MG/_links.txt"
done
