"""Lay the voice lines on the music's beat grid. Every scene cut lands on a beat;
the voice enters LEAD s after the cut. Writes vo/timeline.json (absolute times)."""
import json, sys
CUES = '/Users/mbgrao/Desktop/brag/skills/brag/assets/music/cues/' + sys.argv[1]
HOLD = float(sys.argv[2]) if len(sys.argv) > 2 else 2.4
LEAD, GAP_LINE, GAP_SCENE = 0.14, 0.24, 0.30
c = json.load(open(CUES)); beats = [b['time'] for b in c['beats']]
off = beats[0]; grid = [b - off for b in beats]           # video t=0 == first beat
nxt = lambda t: next(g for g in grid if g >= t - 1e-6)
W = json.load(open('vo/words.json'))
scenes, lines, t, prev_scene = [], {}, 0.0, None
for k, L in W.items():
    if L['scene'] != prev_scene:
        cut = 0.0 if prev_scene is None else nxt(t + GAP_SCENE - LEAD)
        if scenes: scenes[-1]['end'] = round(cut, 3)
        scenes.append({'id': L['scene'], 'start': round(cut, 3)}); st = cut + LEAD; prev_scene = L['scene']
    else:
        st = t + GAP_LINE
    lines[k] = {'start': round(st, 3), 'end': round(st + L['dur'], 3), 'ro': L['ro'], 'scene': L['scene'],
                'words': [{'w': w['w'], 't0': round(st + w['t0'], 3), 't1': round(st + w['t1'], 3)} for w in L['words']]}
    t = st + L['dur']
end = nxt(t + HOLD); scenes[-1]['end'] = round(end, 3)
json.dump({'duration': round(end, 3), 'musicOffset': round(off, 4), 'bpm': c['tempo'], 'beats': [round(g, 3) for g in grid if g <= end + 1],
           'scenes': scenes, 'lines': lines}, open('vo/timeline.json', 'w'), indent=1, ensure_ascii=False)
for s in scenes: print(f"{s['id']:7s} {s['start']:6.2f} -> {s['end']:6.2f}  ({s['end']-s['start']:.2f}s)")
print('duration', end)
