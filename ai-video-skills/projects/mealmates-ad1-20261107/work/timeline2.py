"""v2 timeline: every line voiced; lines are placed by where speech actually starts in each file (snappy comedy timing)."""
import json, subprocess, numpy as np
W = json.load(open('vo2p/words.json'))
dur = lambda k: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo2p/{k}.wav'], capture_output=True, text=True).stdout)
lines, scenes, events = {}, [], {}
def say(k, at):
    """speech of line k begins at `at`; returns when the speech ends"""
    w = W[k]; s0 = w['words'][0]['t0']; fs = at - s0
    lines[k] = {'file_start': round(fs, 3), 'start': round(at, 3), 'end': round(fs + w['end'], 3), 'ro': w['ro'], 'role': w['role'], 'scene': w['scene'],
                'words': [{'w': x['w'], 't0': round(fs + x['t0'], 3), 't1': round(fs + x['t1'], 3)} for x in w['words']]}
    return fs + w['end']
def scene(i, a, b): scenes.append({'id': i, 'start': round(a, 3), 'end': round(b, 3)})
G = 0.12
t = 0; e = say('n1', 0.45); scene('hook', 0, e + 0.35); t = e + 0.35
e = say('p1', t + 0.2); scene('pizza', t, e + 0.3); t = e + 0.3
for sid, ask, resp, fail in [('waiter', 'h1', 'w1', 'a1'), ('cat', 'h2', None, 'a2'), ('mirror', 'h3', 'r1', 'a3')]:
    a = t; e = say(ask, a + 0.12)
    if resp: e = say(resp, e + G)
    else: events['cat'] = round(e + 0.05, 3); e = e + 0.55
    events[f'fail_{fail}'] = round(e + 0.08, 3); e = say(fail, e + 0.08)
    scene(sid, a, e + 0.18); t = e + 0.18
a = t; events['ring'] = round(a + 0.05, 3); e = say('h4', a + 0.55); e = say('am', e + 0.2); events['fail_a4'] = round(e + 0.1, 3); e = say('a4', e + 0.1); scene('call', a, e + 0.2); t = e + 0.2
a = t; e = say('n2', a + 0.45); scene('bench', a, e + 0.9); t = e + 0.9
a = t; e = say('n3', a + 0.2); events['tap'] = round(e + 0.15, 3); events['match'] = round(e + 1.2, 3); e = say('n4', e + 1.25); scene('app', a, e + 0.5); t = e + 0.5
a = t; e = say('p2', a + 0.25); e = say('b1', e + G); e = say('h5', e + G); events['save'] = round(e + 0.15, 3); e = say('n5', e + 0.15); scene('table', a, e + 0.4); t = e + 0.4
a = t; e = say('n6', a + 0.35); e = say('n7', e + 0.25); scene('end', a, e + 1.6); t = e + 1.6
mouth = {}
for k in ['p1', 'p2']:
    y = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'vo2p/{k}.wav', '-ac', '1', '-ar', '24000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    hop = 800; r = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(len(y) // hop)])
    r = np.clip((np.convolve(r, np.ones(2) / 2, 'same') / (np.percentile(r, 95) + 1e-9)) ** 0.8, 0, 1)
    mouth[k] = {'start': lines[k]['file_start'], 'v': [round(float(x), 3) for x in r]}
json.dump({'duration': round(t, 3), 'scenes': scenes, 'lines': lines, 'events': events, 'mouth': mouth}, open('../video/src/timeline2.json', 'w'), indent=1, ensure_ascii=False)
print('duration', round(t, 2)); [print(f"  {s['id']:7s} {s['start']:6.2f} -> {s['end']:6.2f}") for s in scenes]; print(events)
