"""Roman-Urdu reel voiceover: Kokoro (local, free) Hindi voice reads the Devanagari line,
the screen shows the Roman line. Writes vo/<key>.wav and vo/words.json (per-word timing)."""
import json, re, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
V = '/Users/mbgrao/Desktop/brag/brag-output/work/'
k = Kokoro(V + 'kokoro-v1.0.onnx', V + 'voices-v1.0.bin')
SP = float(sys.argv[1]) if len(sys.argv) > 1 else 1.08
VOICE = sys.argv[2] if len(sys.argv) > 2 else 'hm_psi'
PUN = re.compile(r'[,.:?;।]$')

def phrases(words):
    out, cur = [], []
    for i, w in enumerate(words):
        cur.append(i)
        if PUN.search(w) and i < len(words) - 1:
            out.append(cur); cur = []
    if cur: out.append(cur)
    return out

out = {}
for L in json.load(open('script.json')):
    s, sr = k.create(L['hi'], voice=VOICE, speed=SP, lang='hi')
    a = np.abs(s); nz = np.where(a > 0.01 * a.max())[0]
    s = s[max(0, nz[0] - int(0.02 * sr)):nz[-1] + int(0.08 * sr)]
    sf.write(f"vo/{L['k']}.wav", s, sr)
    dur = len(s) / sr
    # 10 ms RMS envelope -> internal pauses
    hop = int(0.01 * sr); fr = len(s) // hop
    rms = np.array([np.sqrt(np.mean(s[i*hop:(i+1)*hop]**2)) for i in range(fr)])
    voiced = rms > 0.04 * rms.max()
    vi = np.where(voiced)[0]; v0, v1 = vi[0] * 0.01, (vi[-1] + 1) * 0.01
    runs, i = [], 0
    while i < fr:
        if not voiced[i]:
            j = i
            while j < fr and not voiced[j]: j += 1
            if i > vi[0] and j <= vi[-1] and (j - i) >= 9: runs.append((i * 0.01, j * 0.01))
            i = j
        else: i += 1
    ro, hi = L['ro'].split(), L['hi'].split()
    ph = phrases(hi)
    need = len(ph) - 1
    runs = sorted(sorted(runs, key=lambda r: r[1] - r[0], reverse=True)[:need])
    if len(runs) == need:
        bounds = [v0] + [x for r in runs for x in r] + [v1]
        regions = [(bounds[2*n], bounds[2*n+1]) for n in range(len(ph))]
    else:  # fall back: whole line proportional
        tot = sum(len(hi[i]) + 2 for i in range(len(hi))); t = v0; regions = []
        for p in ph:
            d = (v1 - v0) * sum(len(hi[i]) + 2 for i in p) / tot; regions.append((t, t + d)); t += d
    words = []
    for p, (r0, r1) in zip(ph, regions):
        wts = [len(hi[i]) + 2 for i in p]; t = r0
        for i, wt in zip(p, wts):
            d = (r1 - r0) * wt / sum(wts)
            words.append({'w': ro[i], 't0': round(t, 3), 't1': round(t + d, 3)}); t += d
    out[L['k']] = {'dur': round(dur, 3), 'scene': L['scene'], 'ro': L['ro'], 'words': words,
                   'fit': 'pauses' if len(runs) == need else 'prop'}
    print(f"{L['k']:6s} {dur:5.2f}s {out[L['k']]['fit']:6s} {L['ro']}", flush=True)
json.dump(out, open('vo/words.json', 'w'), indent=1, ensure_ascii=False)
print('total speech', round(sum(v['dur'] for v in out.values()), 2))
