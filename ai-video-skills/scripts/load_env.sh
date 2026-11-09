#!/usr/bin/env bash
# Export every key from config/.env.local into the current shell (source this file).
#   source ai-video-skills/scripts/load_env.sh
_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.." && pwd)"
if [[ -f "$_ROOT/config/.env.local" ]]; then set -a; . "$_ROOT/config/.env.local"; set +a; echo "loaded $(grep -cE '^[A-Z0-9_]+=.+' "$_ROOT/config/.env.local") keys"; else echo "no config/.env.local yet (cp config/.env.example config/.env.local)"; fi
