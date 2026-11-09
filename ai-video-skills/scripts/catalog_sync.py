#!/usr/bin/env python3
"""Clone / update every repo in the awesome-claude-video-skills catalog into ai-video-skills/catalog/.

- Shallow clones only (--depth 1). No install scripts are run: dependencies are installed per skill, on demand.
- Repos graded CAUTION go to catalog/_caution/ and are never linked as skills.
- Repos already installed elsewhere in ai-video-skills (by origin URL) are reused, not cloned twice.
- Writes catalog/lock.json: repo -> local path + commit, so the whole set can be restored on any machine.

usage: python3 scripts/catalog_sync.py [--update] [--only kind1,kind2] [--jobs 8]
"""
import argparse, json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT = os.path.join(ROOT, 'catalog')

def git(*a, cwd=None, timeout=900):
    return subprocess.run(['git', *a], cwd=cwd, capture_output=True, text=True, timeout=timeout)

def existing_by_origin():
    found = {}
    for base in [ROOT, os.path.join(ROOT, 'motion-graphics')]:
        for d in sorted(os.listdir(base)):
            p = os.path.join(base, d)
            if os.path.isdir(os.path.join(p, '.git')) and not p.startswith(CAT):
                url = git('remote', 'get-url', 'origin', cwd=p).stdout.strip()
                key = url.replace('https://github.com/', '').removesuffix('.git').lower()
                if key: found[key] = p
    return found

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--update', action='store_true'); ap.add_argument('--only'); ap.add_argument('--jobs', type=int, default=8)
    a = ap.parse_args()
    skills = json.load(open(os.path.join(CAT, 'awesome-skills.json')))['skills']
    if a.only: skills = [s for s in skills if s['kind'] in a.only.split(',')]
    have = existing_by_origin()
    lock_path = os.path.join(CAT, 'lock.json')
    lock = json.load(open(lock_path)) if os.path.exists(lock_path) else {}

    def one(s):
        name = s['repo_full_name']; owner, repo = name.split('/')
        if name.lower() in have:
            p = have[name.lower()]; status = 'preinstalled'
        else:
            sub = '_caution' if s['security_grade'] != 'safe' else s['kind']
            p = os.path.join(CAT, sub, f'{owner}__{repo}')
            if os.path.isdir(os.path.join(p, '.git')):
                status = 'present'
                if a.update:
                    r = git('pull', '--ff-only', '--depth', '1', cwd=p); status = 'updated' if r.returncode == 0 else 'update-failed'
            else:
                os.makedirs(os.path.dirname(p), exist_ok=True)
                env = dict(os.environ, GIT_TERMINAL_PROMPT='0', GIT_LFS_SKIP_SMUDGE='1')
                r = subprocess.run(['git', 'clone', '--depth', '1', '--single-branch', '--no-tags', f'https://github.com/{name}.git', p],
                                   capture_output=True, text=True, timeout=1800, env=env)
                status = 'cloned' if r.returncode == 0 else 'clone-failed: ' + r.stderr.strip().splitlines()[-1][:160] if r.stderr.strip() else 'clone-failed'
        sha = git('rev-parse', 'HEAD', cwd=p).stdout.strip() if os.path.isdir(os.path.join(p, '.git')) else None
        return name, {'path': os.path.relpath(p, ROOT), 'kind': s['kind'], 'grade': s['security_grade'], 'commit': sha, 'status': status}

    done = 0
    with ThreadPoolExecutor(a.jobs) as ex:
        for f in as_completed([ex.submit(one, s) for s in skills]):
            name, info = f.result(); lock[name] = info; done += 1
            print(f'[{done}/{len(skills)}] {info["status"]:12s} {name}', flush=True)
            if done % 25 == 0: json.dump(lock, open(lock_path, 'w'), indent=1, sort_keys=True)
    json.dump(lock, open(lock_path, 'w'), indent=1, sort_keys=True)
    bad = [n for n, v in lock.items() if 'failed' in v['status']]
    print('done.', len(lock), 'repos in lock;', len(bad), 'failed', bad[:20])

if __name__ == '__main__':
    main()
