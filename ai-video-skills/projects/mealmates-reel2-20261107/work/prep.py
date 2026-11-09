"""Post-process v2 voice lines: speed up the announcer (pitch kept), then measure where speech really is
(energy), and rescale the word timings into that span. -> vop/<k>.wav + vop/words.json"""
import json, subprocess, numpy as np, os
os.makedirs('vop', exist_ok=True)
W = json.load(open('vo/words.json')); out = {}
TEMPO = {}
for k, w in W.items():
    af = f"atempo={TEMPO[k]}," if k in TEMPO else ''
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'vo/{k}.mp3', '-af', f'{af}aresample=48000', '-ac', '1', f'vop/{k}.wav'], check=True)
    y = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f'vop/{k}.wav', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
    hop = 160; r = np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2)) for i in range(len(y) // hop)])
    on = np.where(r > 0.08 * r.max())[0]; vs, ve = on[0] * 0.01, (on[-1] + 1) * 0.01
    ws = w['words']; a0, a1 = ws[0]['t0'] / TEMPO.get(k, 1), ws[-1]['t1'] / TEMPO.get(k, 1)
    f = lambda x: vs + (x / TEMPO.get(k, 1) - a0) / max(1e-3, a1 - a0) * (ve - vs)
    out[k] = {**w, 'words': [{'w': x['w'], 't0': round(f(x['t0']), 3), 't1': round(f(x['t1']), 3)} for x in ws], 'end': round(ve, 3), 'span': [round(vs, 3), round(ve, 3)]}
    print(f"{k:3s} speech {vs:.2f}-{ve:.2f}  (was {ws[0]['t0']:.2f}-{ws[-1]['t1']:.2f})")
json.dump(out, open('vop/words.json', 'w'), indent=1, ensure_ascii=False)
