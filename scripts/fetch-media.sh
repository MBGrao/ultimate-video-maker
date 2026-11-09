#!/usr/bin/env bash
# Download the showcase media (videos, voices, music, images) from the media server into their repo paths.
# The repo keeps code only; media-manifest.tsv lists every file with its size and SHA-256.
#   scripts/fetch-media.sh                                   # everything (~280 MB)
#   scripts/fetch-media.sh ai-video-skills/projects/localhostlabs-noapp-20261109   # one project
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT"
BASE="${UVM_MEDIA_BASE:-https://localhostlabs.tech/uvm}"
PREFIX="${1:-}"
sha() { if command -v sha256sum >/dev/null 2>&1; then sha256sum "$1" | cut -d' ' -f1; else shasum -a 256 "$1" | cut -d' ' -f1; fi; }
n=0; skip=0
while IFS=$'\t' read -r path bytes want; do
  [[ "$path" == "path" || -z "$path" ]] && continue
  [[ -n "$PREFIX" && "$path" != "$PREFIX"* ]] && continue
  if [[ -f "$path" && "$(sha "$path")" == "$want" ]]; then skip=$((skip+1)); continue; fi
  mkdir -p "$(dirname "$path")"
  curl -fsSL "$BASE/$path" -o "$path.part"
  [[ "$(sha "$path.part")" == "$want" ]] || { rm -f "$path.part"; echo "checksum mismatch: $path" >&2; exit 1; }
  mv "$path.part" "$path"; n=$((n+1)); echo "fetched $path"
done < media-manifest.tsv
echo "done: $n downloaded, $skip already up to date"
