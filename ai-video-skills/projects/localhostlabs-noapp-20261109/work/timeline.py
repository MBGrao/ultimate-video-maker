"""'You probably don't need an app': one scene per beat, paced by the voice; every effect is pinned to a spoken word.
usage: python3 timeline.py [en|hi]   (hi reads vop_hi/ and writes timeline_hi.json)"""
import json, re, sys
LANG = sys.argv[1] if len(sys.argv) > 1 else 'en'
W = json.load(open('vop/words.json' if LANG == 'en' else f'vop_{LANG}/words.json'))
lines, scenes, ev = {}, [], {}
def say(k, at):
    w = W[k]; fs = at - w['words'][0]['t0']
    lines[k] = {'file_start': round(fs, 3), 'start': round(at, 3), 'end': round(fs + w['end'], 3), 'ro': w['ro'], 'role': 'host', 'scene': w['scene'],
                'words': [{'w': x['w'], 't0': round(fs + x['t0'], 3), 't1': round(fs + x['t1'], 3)} for x in w['words']]}
    return fs + w['end']
n = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
def wt(k, word, nth=0):
    h = [x for x in lines[k]['words'] if n(x['w']).startswith(n(word))]; return round(h[nth]['t0'], 3)
order = [('hook', 0.12), ('con', 0.22), ('stay', 0.3), ('q1', 0.32), ('q2', 0.32), ('q3', 0.32), ('cta', 0.4)]
e = 0
for i, (k, gap) in enumerate(order):
    at = gap if i == 0 else e + gap
    s0 = 0 if i == 0 else at - 0.14
    if scenes: scenes[-1]['end'] = round(s0, 3)
    scenes.append({'id': k, 'start': round(s0, 3), 'end': None})
    e = say(k, at)
D = e + 1.9; scenes[-1]['end'] = round(D, 3)
# the word each effect lands on, per language
A = {
  'en': dict(app=('hook', 'app'), dont=('con', 'dont'), slice=('con', 'they'), sheet=('con', 'spreadsheet'), questions=('stay', 'questions'), tell=('stay', 'tell'), third=('stay', 'third'), where=('stay', 'where'), die=('stay', 'die'),
             customers=('q1', 'customers'), team=('q1', 'team'), tool=('q1', 'internal'), store=('q1', 'store'), listing=('q1', 'listing'),
             every=('q2', 'every'), copying=('q2', 'copying'), ramp=('q2', 'pulling'), q2if=('q2', 'if'), auto=('q2', 'automate'),
             draw=('q3', 'draw'), page=('q3', 'page'), ifnot=('q3', 'if'), build=('q3', 'build'), skip=('q3', 'skip'), explode=('q3', 'explode'),
             scope1=('cta', 'one'), before=('cta', 'before'), comment=('cta', 'comment'), send=('cta', 'send'), checklist=('cta', 'checklist')),
  'hi': dict(app=('hook', 'app'), dont=('con', 'nahi'), slice=('con', 'unhe'), sheet=('con', 'spreadsheet'), questions=('stay', 'sawaal'), tell=('stay', 'pata'), third=('stay', 'teesra'), where=('stay', 'jahan'), die=('stay', 'dam'),
             customers=('q1', 'customers'), team=('q1', 'team'), tool=('q1', 'internal'), store=('q1', 'store'), listing=('q1', 'listing'),
             every=('q2', 'roz'), copying=('q2', 'orders'), ramp=('q2', 'reports'), q2if=('q2', 'agar'), auto=('q2', 'automate'),
             page=('q3', 'page'), ifnot=('q3', 'agar'), build=('q3', 'build'), skip=('q3', 'skip'), explode=('q3', 'explode'),
             scope1=('cta', 'scope'), before=('cta', 'code'), comment=('cta', 'scope', 1), send=('cta', 'bhej'), checklist=('cta', 'checklist')),
}[LANG]
for key, spec in A.items(): ev[key] = wt(*spec)
# Hindi says "draw" late in the question, so the page starts drawing from the top of the line and is done before "Agar nahi"
if 'draw' not in ev: ev['draw'] = round(lines['q3']['start'] + 0.9, 3)
ev.update(c0=lines['stay']['start'], c1=lines['q1']['start'], c2=lines['q2']['start'], c3=lines['q3']['start'], logo=round(D - 2.0, 3))
out = '../video/src/timeline.json' if LANG == 'en' else f'../video/src/timeline_{LANG}.json'
json.dump({'duration': round(D, 3), 'lang': LANG, 'scenes': scenes, 'lines': lines, 'events': ev}, open(out, 'w'), indent=1, ensure_ascii=False)
print(LANG, 'duration', round(D, 2)); [print(f"  {s['id']:5s} {s['start']:6.2f} -> {s['end']:6.2f}") for s in scenes]; print(ev)
