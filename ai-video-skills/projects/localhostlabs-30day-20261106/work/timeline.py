"""Lay each video's voice lines on its music beat grid (ElevenLabs music, beats from librosa).
Scene cuts land on beats; the voice enters LEAD s after a cut. -> ../video/src/timelines.json"""
import json, subprocess
S = json.load(open('scripts.json')); B = json.load(open('music/beats.json'))
LEAD, GAP_LINE, GAP_SCENE, HOLD = 0.12, 0.22, 0.28, 2.8
def dur(p): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
out = {}
for vid, v in S.items():
    W = json.load(open(f'vo/{vid}/words.json')); track = vid[:2]
    beats = B[track]['beats']; off = beats[0]; grid = [b - off for b in beats]
    period = (grid[-1] - grid[0]) / (len(grid) - 1)
    grid += [grid[-1] + period * i for i in range(1, 40)]          # extend past the track end if needed
    nxt = lambda t: next(g for g in grid if g >= t - 1e-6)
    scenes, lines, t, prev = [], {}, 0.0, None
    for L in v['lines']:
        k = L['k']; w = W[k]; d = min(dur(f'vo/{vid}/{k}.mp3'), w['end'] + 0.25)
        if L['scene'] != prev:
            cut = 0.0 if prev is None else nxt(t + GAP_SCENE - LEAD)
            if scenes: scenes[-1]['end'] = round(cut, 3)
            scenes.append({'id': L['scene'], 'start': round(cut, 3)}); st = cut + LEAD; prev = L['scene']
        else:
            st = t + GAP_LINE
        lines[k] = {'start': round(st, 3), 'end': round(st + w['end'], 3), 'ro': L['ro'], 'scene': L['scene'],
                    'words': [{'w': x['w'], 't0': round(st + x['t0'], 3), 't1': round(st + x['t1'], 3)} for x in w['words']]}
        t = st + d
    end = nxt(t + HOLD); scenes[-1]['end'] = round(end, 3)
    out[vid] = {'duration': round(end, 3), 'musicOffset': round(off, 3), 'track': track, 'lang': v['lang'], 'series': v['series'], 'scenes': scenes, 'lines': lines}
    print(vid, 'duration', round(end, 2), '|', ' '.join(f"{s['id']}@{s['start']:.1f}" for s in scenes))
json.dump(out, open('../video/src/timelines.json', 'w'), indent=1, ensure_ascii=False)
