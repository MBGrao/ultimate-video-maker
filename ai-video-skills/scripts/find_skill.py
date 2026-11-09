#!/usr/bin/env python3
"""Search the local video-skills catalog.
usage: python3 scripts/find_skill.py <words...> [--kind promo|explainer|editing|shorts|avatar|story|motion|craft|music|general]
                                    [--free | --paid | --provider elevenlabs] [--n 15]
Prints the best-matching skills with their SKILL.md path; read that file and follow it."""
import argparse, json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser(); ap.add_argument('q', nargs='*'); ap.add_argument('--kind'); ap.add_argument('--free', action='store_true')
ap.add_argument('--paid', action='store_true'); ap.add_argument('--provider'); ap.add_argument('--n', type=int, default=15); ap.add_argument('--repos', action='store_true')
a = ap.parse_args()
C = json.load(open(os.path.join(ROOT, 'catalog', 'catalog.json')))['repos']
words = [w.lower() for w in a.q]
rows = []
for r in C:
    if a.kind and r['kind'] != a.kind: continue
    if a.free and r['cost'] == 'paid-api': continue
    if a.paid and r['cost'] != 'paid-api': continue
    if a.provider and not any(a.provider.lower() in p.lower() for p in r['providers']): continue
    units = [(s['name'], s['description'], s['path']) for s in r['skills']] or [(r['repo'].split('/')[1], r['description'] or '', r['path'] + '/README.md')]
    if a.repos: units = [(r['repo'], r['description'] or '', r['path'])]
    for name, desc, path in units:
        hay = f"{name} {desc} {r['description']} {r['repo']}".lower()
        score = sum(3 if w in name.lower() else 1 for w in words if w in hay) if words else 1
        if words and score == 0: continue
        score += min(3, (r['stars'] or 0) / 3000) + (0 if r['grade'] == 'safe' else -5)
        rows.append((score, name, r, desc, path))
rows.sort(key=lambda x: -x[0])
icon = {'free': '🆓', 'free-key': '🔑', 'paid-api': '💳'}
for score, name, r, desc, path in rows[:a.n]:
    pl = [p.split(' (')[0] for p in r['providers']]
    prov = ', '.join(pl[:4]) + (f' +{len(pl) - 4} more' if len(pl) > 4 else '')
    print(f"{icon[r['cost']]} {name}  ·  {r['repo']} ★{r['stars']}  [{r['kind']}{'' if r['grade']=='safe' else ', CAUTION'}]{'  · ' + prov if prov else ''}\n   {desc[:160]}\n   → {path}\n")
print(f'{len(rows)} matches.')
