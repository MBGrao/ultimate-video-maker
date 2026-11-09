"""Small local mixing kit: music bed with voice ducking, Kenney SFX (bundled with /brag),
synth whooshes/subs, light room glue. Everything is a pure function of the timeline."""
import json, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly
SR = 48000
SFX = '/Users/mbgrao/Desktop/brag/skills/brag/assets/sfx/'
MUSIC = '/Users/mbgrao/Desktop/brag/skills/brag/assets/music/'
db = lambda d: 10 ** (d / 20)
rng = np.random.default_rng(7)
sm = lambda x: (lambda c: c * c * (3 - 2 * c))(np.clip(x, 0, 1))

def load(path, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', path] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)

class Mix:
    def __init__(self, timeline='vo/timeline.json'):
        self.T = json.load(open(timeline)); self.D = self.T['duration']; self.N = int(SR * self.D)
        self.tt = np.arange(self.N) / SR; self.fx = np.zeros((self.N, 2)); self.cache = {}
        self.SC = {s['id']: s for s in self.T['scenes']}; self.LN = self.T['lines']
    def wt(self, k, w, nth=0):
        L = self.LN[k]; n = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
        hits = [x for x in L['words'] if n(x['w']).startswith(n(w))]
        return hits[min(nth, len(hits) - 1)]['t0'] if hits else L['start']
    def s(self, name):
        if name not in self.cache: self.cache[name] = load(SFX + name)
        return self.cache[name]
    def put(self, x, t, g, pan=0.0):
        if x.ndim == 1: x = np.stack([x, x], 1)
        i = int(max(0, t) * SR); x = x[:max(0, self.N - i)] * db(g)
        x = x * np.array([1 - max(0, pan), 1 + min(0, pan)]); self.fx[i:i + len(x)] += x
    def whoosh(self, dur=0.55, f0=300, f1=2800, peak=0.62):
        n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 512
        for k in range(0, n, seg):
            p = k / n; fc = f0 * (f1 / f0) ** p
            sos = butter(2, [max(60, fc * 0.55), min(SR / 2 - 100, fc * 1.6)], 'band', fs=SR, output='sos')
            out[k:k + seg] = sosfilt(sos, x[max(0, k - 2048):k + seg])[-len(out[k:k + seg]):]
        tp = np.arange(n) / n; env = np.where(tp < peak, (tp / peak) ** 2, (1 - (tp - peak) / (1 - peak)) ** 1.6)
        out = out * env; return out / (np.max(np.abs(out)) + 1e-9)
    def whoosh_at(self, peak_t, g=-11, dur=0.62, peak=0.5, f0=250, f1=3200):
        self.put(self.whoosh(dur, f0, f1, peak), peak_t - peak * dur, g)
    def sub(self, dur=0.9, f=52):
        n = int(dur * SR); t = np.arange(n) / SR; ph = 2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 18))) / SR
        return np.sin(ph) * np.exp(-t * 4.2) * np.minimum(1, t / 0.004)
    def tick(self, f=2400, dur=0.03):
        n = int(dur * SR); t = np.arange(n) / SR
        return np.sin(2 * np.pi * f * t) * np.exp(-t * 160)
    def render(self, track, out='mix_raw.wav', music_db=-6.5, duck_db=-13, vo_peak=-3.0, tail=1.8):
        T = self.T; N = self.N; tt = self.tt
        mus = load(MUSIC + track, T['musicOffset'], self.D + 0.5)[:N]
        mus = np.vstack([mus, np.zeros((max(0, N - len(mus)), 2))])
        vo = np.zeros((N, 2)); segs = []
        for k, L in T['lines'].items():
            x, sr = sf.read(f'vo/{k}.wav'); x = resample_poly(x, SR, sr)
            i = int(L['start'] * SR); x = x[:N - i]; vo[i:i + len(x)] += x[:, None]; segs.append((L['start'], L['start'] + len(x) / SR))
        vo = sosfilt(butter(2, 90, 'high', fs=SR, output='sos'), vo, axis=0)
        # gentle presence lift + soft compression so the TTS sits forward
        pres = sosfilt(butter(2, [2500, 6000], 'band', fs=SR, output='sos'), vo, axis=0); vo = vo + 0.35 * pres
        vo = np.tanh(vo / (np.max(np.abs(vo)) + 1e-9) * 1.6) ; vo *= db(vo_peak) / np.max(np.abs(vo))
        duck = np.zeros(N)
        for a, b in segs:
            m = (tt >= a - 0.2) & (tt <= b + 0.45)
            duck = np.maximum(duck, np.minimum(np.clip((tt - (a - 0.2)) / 0.2, 0, 1), np.clip(1 - (tt - b) / 0.45, 0, 1)) * m)
        music = mus * (db(duck_db) * sm(duck) + (1 - sm(duck)))[:, None] * db(music_db)
        music *= sm(tt / 0.08)[:, None]; music *= (1 - sm((tt - (self.D - tail)) / tail))[:, None]
        rr = np.random.default_rng(3); ir = np.exp(-np.arange(int(0.45 * SR)) / (0.09 * SR)) * rr.standard_normal(int(0.45 * SR)) * 0.015
        fx = self.fx + np.stack([np.convolve(self.fx[:, c], ir)[:N] for c in (0, 1)], 1) * 0.5
        fx = sosfilt(butter(2, 9000, 'low', fs=SR, output='sos'), fx, axis=0)
        mix = vo + music + fx; mix *= db(-1.0) / np.max(np.abs(mix))
        sf.write(out, mix.astype(np.float32), SR); print('wrote', out, round(self.D, 2), 's')
