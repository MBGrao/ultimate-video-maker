"""MealMates Ad 1 mix: 3 female ElevenLabs voices + ElevenLabs desi comedy bed / sad violin + ElevenLabs & Kenney SFX."""
import json, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 48000; KEN = '/Users/mbgrao/Desktop/brag/skills/brag/assets/sfx/'
db = lambda d: 10 ** (d / 20); sm = lambda x: (lambda c: c * c * (3 - 2 * c))(np.clip(x, 0, 1))
def load(p, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', p] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)
T = json.load(open('../video/src/timeline.json')); D = T['duration']; N = int(SR * D); tt = np.arange(N) / SR
SC = {s['id']: s for s in T['scenes']}; LN = T['lines']; BUB = T['bubbles']
def wt(k, w):
    n = lambda s: re.sub(r'[^a-z0-9]', '', s.lower()); h = [x for x in LN[k]['words'] if n(x['w']).startswith(n(w))]
    return h[0]['t0'] if h else LN[k]['start']
fx = np.zeros((N, 2)); amb = np.zeros((N, 2)); cache = {}
def s(name):
    if name not in cache: cache[name] = load(f'sfx/{name}.mp3' if '/' not in name else KEN + name)
    return cache[name]
def put(x, t, g, pan=0.0, buf=None, fade=None):
    b = fx if buf is None else buf
    if x.ndim == 1: x = np.stack([x, x], 1)
    i = int(max(0, t) * SR); x = x[:max(0, N - i)] * db(g) * np.array([1 - max(0, pan), 1 + min(0, pan)])
    if fade: n = len(x); e = np.minimum(1, np.minimum(np.arange(n) / (fade * SR), (n - np.arange(n)) / (fade * SR))); x = x * e[:, None]
    b[i:i + len(x)] += x
def seg(name, a, b):  # an ambience clipped to a window
    x = s(name)
    while len(x) < int((b - a) * SR): x = np.vstack([x, x])
    return x[:int((b - a) * SR)]
# --- SFX
put(s('dhoom'), 0.18, -4); put(seg('crowd', 0, 2.2), 0, -24, fade=0.3)
put(s('pop'), SC['pizza']['start'] + 0.1, -14)
for sid, extra, g in [('waiter', 'tsk', -8), ('cat', 'cat', -7), ('mirror', None, 0)]:
    a = SC[sid]['start']; put(s('swoosh'), a - 0.12, -12); put(s('pop'), a + 0.04, -16, -.3)
    if extra: put(s(extra), a + 0.12, g)
    put(s('buzzer'), a + 0.5, -10)
a = SC['call']['start']; put(s('swoosh'), a - 0.12, -12); put(s('ring'), a + 0.05, -12); put(s('pop'), a + 0.15, -16)
put(s('buzzer'), wt('ammi', 'nahi'), -9)
b0 = SC['bench']['start']; put(s('scratch'), b0 - 0.12, -6); put(seg('rain', b0, SC['bench']['end']), b0, -16, buf=amb, fade=0.4)
ap = SC['app']['start']; put(s('swoosh'), ap - 0.1, -10); put(s('pop'), ap + 0.65, -12); put(s('notif'), ap + 1.75, -8)
tb = SC['table']['start']; put(seg('crowd', tb, SC['table']['end']), tb, -20, buf=amb, fade=0.3)
put(s('pop'), LN['pizza2']['start'] - 0.15, -14); put(s('cash'), LN['pizza2']['start'] + 0.5, -10)
put(s('pop'), BUB['bill'], -13, .3); put(s('pop'), BUB['aadha'], -13, -.3)
e0 = SC['end']['start']; put(s('riser'), e0 - 1.0, -16); put(s('swoosh'), e0 - 0.1, -10); put(s('pop'), e0 + 0.05, -12); put(s('ding'), LN['vo4']['start'], -12)
# --- voices
vo = np.zeros((N, 2)); segs = []
for k, L0 in LN.items():
    x = load(f'vo/{k}.mp3'); i = int(L0['start'] * SR); x = x[:N - i]; vo[i:i + len(x)] += x * db(1.5 if L0['role'] == 'pizza' else 0); segs.append((L0['start'], L0['end']))
vo = sosfilt(butter(2, 80, 'high', fs=SR, output='sos'), vo, axis=0); vo *= db(-3) / (np.max(np.abs(vo)) + 1e-9)
# --- music: comedy bed -> (scratch) sad violin on the bench -> bed back on the app reveal
bed = load('music/bed.mp3', 0, D + 1)[:N]; bed = np.vstack([bed, np.zeros((max(0, N - len(bed)), 2))])[:N]; bed *= db(-1) / np.max(np.abs(bed))
gate = 1 - sm((tt - (b0 - 0.15)) / 0.1) + sm((tt - (ap - 0.05)) / 0.15)
gate = np.clip(gate, 0, 1)
sad = np.zeros((N, 2)); sv = load('music/sad.mp3'); i = int(b0 * SR); sv = sv[:N - i]; sad[i:i + len(sv)] = sv
sad *= ((1 - sm((tt - (ap - 0.5)) / 0.5)) * sm((tt - b0) / 0.1))[:, None] * db(-6) / (np.max(np.abs(sv)) + 1e-9)
duck = np.zeros(N)
for a1, b1 in segs:
    m = (tt >= a1 - 0.18) & (tt <= b1 + 0.35); duck = np.maximum(duck, np.minimum(np.clip((tt - (a1 - .18)) / .18, 0, 1), np.clip(1 - (tt - b1) / .35, 0, 1)) * m)
music = bed * (gate * (db(-12) * sm(duck) + (1 - sm(duck))))[:, None] * db(-9) + sad * (db(-6) * sm(duck) + (1 - sm(duck)))[:, None]
music *= sm(tt / 0.05)[:, None]; music *= (1 - sm((tt - (D - 1.6)) / 1.6))[:, None]
ir = np.exp(-np.arange(int(.4 * SR)) / (.08 * SR)) * np.random.default_rng(3).standard_normal(int(.4 * SR)) * .012
fxw = sosfilt(butter(2, 11500, 'low', fs=SR, output='sos'), fx + np.stack([np.convolve(fx[:, c], ir)[:N] for c in (0, 1)], 1) * .4, axis=0)
mix = vo + music + fxw * db(-2) + amb; mix *= db(-1) / np.max(np.abs(mix))
sf.write('mix_raw.wav', mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', 'mix.wav'], check=True); print('mixed', D)
