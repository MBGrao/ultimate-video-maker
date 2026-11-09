#!/usr/bin/env bash
# Rebuild the whole toolkit on a fresh machine (or after a clean clone of this repo):
#   1. clone the core packages (core-packages.json) at their pinned commits + apply patches/
#   2. clone the full awesome-claude-video-skills catalog (scripts/catalog_sync.py)
#   3. re-scan it (CATALOG.md, PAID-APIS.md, config/.env.example)
# No package install scripts are run; install a skill's deps when you first use it.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT"
python3 - <<'PY'
import json, os, subprocess
for p in json.load(open('core-packages.json')):
    d = p['path']
    if not os.path.isdir(os.path.join(d, '.git')):
        subprocess.run(['git', 'clone', '--depth', '1', f"https://github.com/{p['repo']}.git", d], check=True)
        head = subprocess.run(['git', '-C', d, 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
        if p['commit'] and head != p['commit']:
            if subprocess.run(['git', '-C', d, 'fetch', '--depth', '1', 'origin', p['commit']]).returncode == 0:
                subprocess.run(['git', '-C', d, 'checkout', '-q', p['commit']])
        if p.get('patch'): subprocess.run(['git', '-C', d, 'apply', os.path.abspath(p['patch'])])
        print('restored', d)
PY
python3 scripts/catalog_sync.py "$@"
python3 scripts/catalog_scan.py
echo "Done. Next: cp config/.env.example config/.env.local (add keys you buy), then see README.md 'Setup'."
