"""Scene plan for MealMates Ad 1 built from the real voice lengths (+ per-frame pizza mouth openness from its audio)."""
import json, subprocess, numpy as np
W = json.load(open('vo/words.json'))
def dur(k): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo/{k}.mp3'], capture_output=True, text=True).stdout)
lines, scenes = {}, []
def place(k, st):
    w = W[k]; lines[k] = {'start': round(st, 3), 'end': round(st + w['end'], 3), 'ro': w['ro'], 'role': w['role'], 'scene': w['scene'], 'file_dur': round(dur(k), 3),
                          'words': [{'w': x['w'], 't0': round(st + x['t0'], 3), 't1': round(st + x['t1'], 3)} for x in w['words']]}
    return st + w['end']
def scene(i, a, b): scenes.append({'id': i, 'start': round(a, 3), 'end': round(b, 3)})
t = 0.0; scene('hook', 0, 2.2); t = 2.2
e = place('pizza1', t + 0.15); scene('pizza', t, e + 0.35); t = e + 0.35
for s in ['waiter', 'cat', 'mirror']: scene(s, t, t + 0.95); t += 0.95
e = place('ammi', t + 0.8); scene('call', t, e + 0.3); t = e + 0.3
e = place('vo1', t + 0.35); scene('bench', t, e + 0.35); t = e + 0.35
place('vo2', t + 0.15); scene('app', t, t + 3.7); t += 3.7
e = place('pizza2', t + 0.25); bubbles = {'bill': round(e + 0.15, 3), 'aadha': round(e + 0.75, 3)}; scene('table', t, e + 2.0); t = e + 2.0
e = place('vo3', t + 0.15); e = place('vo4', e + 0.3); scene('end', t, e + 1.5); t = e + 1.5
# pizza mouth openness per video frame (30 fps), from the voice's own loudness
mouth = {}
for k in ['pizza1', 'pizza2']:
    y = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'vo/{k}.mp3', '-ac', '1', '-ar', '24000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    hop = 800; n = len(y) // hop
    r = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    r = np.convolve(r, np.ones(2) / 2, 'same'); r = np.clip((r / (np.percentile(r, 95) + 1e-9)) ** 0.8, 0, 1)
    mouth[k] = {'start': lines[k]['start'], 'v': [round(float(x), 3) for x in r]}
json.dump({'duration': round(t, 3), 'scenes': scenes, 'lines': lines, 'bubbles': bubbles, 'mouth': mouth}, open('../video/src/timeline.json', 'w'), indent=1, ensure_ascii=False)
print('duration', round(t, 2)); [print(f"  {s['id']:7s} {s['start']:6.2f} -> {s['end']:6.2f}") for s in scenes]
print({k: (v['start'], v['end']) for k, v in lines.items()}, bubbles)
