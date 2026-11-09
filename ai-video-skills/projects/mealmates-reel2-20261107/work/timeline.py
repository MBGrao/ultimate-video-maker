"""Reel 2 timeline: trailer half paced by the voices; after the twist the pop track drops on its first hit and
the remaining cuts snap to its 112 BPM grid."""
import json, math, subprocess
W = json.load(open('vop/words.json')); MB = json.load(open('music/main_beats.json'))
per = 60 / MB['tempo']
lines, scenes, ev = {}, [], {}
def say(k, at):
    w = W[k]; fs = at - w['words'][0]['t0']
    lines[k] = {'file_start': round(fs, 3), 'start': round(at, 3), 'end': round(fs + w['end'], 3), 'ro': w['ro'], 'role': w['role'], 'scene': w['scene'],
                'words': [{'w': x['w'], 't0': round(fs + x['t0'], 3), 't1': round(fs + x['t1'], 3)} for x in w['words']]}
    return fs + w['end']
def sc(i, a, b): scenes.append({'id': i, 'start': round(a, 3), 'end': round(b, 3)})
e = say('n1', 0.35); e = say('n2', e + 0.3); sc('hook', 0, e + 0.35); t = e + 0.35
e = say('n3', t + 0.3); sc('room', t, e + 0.4); t = e + 0.4
e = say('ay1', t + 0.2); sc('ayesha', t, e + 0.35); t = e + 0.35
e = say('zn1', t + 0.2); sc('zain', t, e + 0.35); t = e + 0.35
e = say('ay2', t + 0.25); e = say('zn2', e + 0.12); ev['scratch'] = round(e + 0.08, 3); sc('menu', t, e + 0.3); t = e + 0.3
e = say('n4', t + 0.45); sc('twist', t, e + 0.3); t = e + 0.3
drop = t; ev['drop'] = round(drop, 3)
snap = lambda x: drop + math.ceil((x - drop) / per - 1e-6) * per
e = say('n5', t + 0.45); e = say('n6', e + 0.25); b = snap(e + 0.35); sc('app', t, b); t = b
ev['tap'] = round(lines['n5']['start'] + 1.0, 3); ev['match'] = round(lines['n5']['start'] + 2.4, 3); ev['chat'] = round(lines['n6']['start'] + 0.9, 3); ev['split'] = round(lines['n6']['end'] - 0.6, 3)
e = say('zn3', t + 0.2); e = say('ay3', e + 0.1); ev['half'] = lines['ay3']['start']; b = snap(e + 0.45); sc('table', t, b); t = b
e = say('n7', t + 0.35); e = say('n8', e + 0.3); b = snap(e + 1.3); sc('end', t, b); t = b
json.dump({'duration': round(t, 3), 'scenes': scenes, 'lines': lines, 'events': ev, 'musicHit': MB['first_hit'], 'beat': round(per, 4)}, open('../video/src/timeline.json', 'w'), indent=1, ensure_ascii=False)
print('duration', round(t, 2)); [print(f"  {s['id']:7s} {s['start']:6.2f} -> {s['end']:6.2f}") for s in scenes]; print(ev)
