"""v2 mix, voice first: every line levelled to the same loudness, presence lift + limiter on the voice bus,
music sunk deep under dialogue, SFX on the beats of the comedy. -> mix_v2.wav (-13 LUFS)"""
import json, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 48000; KEN = '/Users/mbgrao/Desktop/brag/skills/brag/assets/sfx/'
db = lambda d: 10 ** (d / 20); sm = lambda x: (lambda c: c * c * (3 - 2 * c))(np.clip(x, 0, 1))
def load(p, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', p] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)
T = json.load(open('../video/src/timeline2.json')); D = T['duration']; N = int(SR * D); tt = np.arange(N) / SR
SC = {s['id']: s for s in T['scenes']}; LN = T['lines']; EV = T['events']
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
def seg(name, a, b):
    x = s(name)
    while len(x) < int((b - a) * SR): x = np.vstack([x, x])
    return x[:int((b - a) * SR)]
# --- SFX
put(s('dhoom'), 0.16, -5); put(seg('crowd', 0, SC['hook']['end']), 0, -26, buf=amb, fade=0.3)
for sid in ['pizza', 'app', 'end']: put(s('swoosh'), SC[sid]['start'] - 0.25, -11); put(s('pop'), SC[sid]['start'], -14)
for sid in ['waiter', 'cat', 'mirror', 'call']: put(s('swoosh'), SC[sid]['start'] - 0.1, -14)
put(s('tsk'), LN['w1']['end'] + 0.05, -12)
put(s('cat'), EV['cat'], -8)
put(s('ring'), EV['ring'], -13)
for k in ['a1', 'a2', 'a3', 'a4']:
    f = wt(k, 'fail'); put(s('buzzer'), f - 0.02, -11); put(s('impact/impactGlass_light_001.ogg'), f + 0.02, -14)
b0 = SC['bench']['start']; put(s('scratch'), b0 - 0.15, -7); put(seg('rain', b0, SC['bench']['end']), b0, -18, buf=amb, fade=0.4)
put(s('pop'), EV['tap'], -13); put(s('notif'), EV['match'], -9)
tb = SC['table']['start']; put(seg('crowd', tb, SC['table']['end']), tb, -24, buf=amb, fade=0.3)
put(s('pop'), LN['p2']['start'] - 0.15, -15); put(s('cash'), wt('n5', 'fifty'), -11)
e0 = SC['end']['start']; put(s('riser'), e0 - 1.0, -18); put(s('ding'), LN['n7']['start'], -15)
# --- voices: each line levelled to the same speech RMS, then presence lift + soft limiter
vo = np.zeros((N, 2)); segs = []
TARGET = db(-17)
for k, L0 in LN.items():
    x = load(f'vo2p/{k}.wav')
    act = x[np.abs(x[:, 0]) > 0.02 * np.abs(x[:, 0]).max()]
    rms = np.sqrt(np.mean(act ** 2)) if len(act) else 1
    x = x * (TARGET / rms)
    i = int(L0['file_start'] * SR); x = x[:N - i]; vo[i:i + len(x)] += x; segs.append((L0['start'], L0['end']))
vo = sosfilt(butter(2, 90, 'high', fs=SR, output='sos'), vo, axis=0)
vo = vo + 0.45 * sosfilt(butter(2, [2200, 5500], 'band', fs=SR, output='sos'), vo, axis=0)
vo = np.tanh(vo * 1.8) / np.tanh(1.8)
# --- music: comedy bed (0 -> bench), sad violin (bench), bed again (app -> end)
bedA = load('music/bed.mp3', 0, D + 1)[:N]; bedA = np.vstack([bedA, np.zeros((max(0, N - len(bedA)), 2))])[:N]
ap = SC['app']['start']; bedB = np.zeros((N, 2)); xb = load('music/bed.mp3', 8.0, D - ap + 1); i = int(ap * SR); xb = xb[:N - i]; bedB[i:i + len(xb)] = xb
gA = 1 - sm((tt - (b0 - 0.15)) / 0.1); gB = sm((tt - (ap - 0.05)) / 0.15)
bed = bedA * gA[:, None] + bedB * gB[:, None]; bed *= db(-1) / (np.max(np.abs(bed)) + 1e-9)
sad = np.zeros((N, 2)); sv = load('music/sad.mp3'); i = int(b0 * SR); sv = sv[:N - i]; sad[i:i + len(sv)] = sv
sad *= ((1 - sm((tt - (ap - 0.4)) / 0.4)) * sm((tt - b0) / 0.1))[:, None] * db(-4) / (np.max(np.abs(sv)) + 1e-9)
duck = np.zeros(N)
for a1, b1 in segs:
    m = (tt >= a1 - 0.15) & (tt <= b1 + 0.3); duck = np.maximum(duck, np.minimum(np.clip((tt - (a1 - .15)) / .15, 0, 1), np.clip(1 - (tt - b1) / .3, 0, 1)) * m)
music = bed * (db(-17) * sm(duck) + (1 - sm(duck)))[:, None] * db(-10) + sad * (db(-8) * sm(duck) + (1 - sm(duck)))[:, None]
music *= sm(tt / 0.05)[:, None]; music *= (1 - sm((tt - (D - 1.5)) / 1.5))[:, None]
ir = np.exp(-np.arange(int(.35 * SR)) / (.07 * SR)) * np.random.default_rng(3).standard_normal(int(.35 * SR)) * .012
fxw = sosfilt(butter(2, 11500, 'low', fs=SR, output='sos'), fx + np.stack([np.convolve(fx[:, c], ir)[:N] for c in (0, 1)], 1) * .35, axis=0)
mix = vo + music + fxw * db(-4) + amb; mix *= db(-1) / np.max(np.abs(mix))
sf.write('mix_v2_raw.wav', mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'mix_v2_raw.wav', '-af', 'loudnorm=I=-13:TP=-1.0:LRA=9', '-ar', '48000', 'mix_v2.wav'], check=True)
# report: how far the voice sits above the music
vr = 20 * np.log10(np.sqrt(np.mean(vo[np.abs(vo[:, 0]) > 0.01] ** 2)) + 1e-9); mr = 20 * np.log10(np.sqrt(np.mean(music ** 2)) + 1e-9)
print('mixed', D, '| voice RMS', round(vr, 1), 'dBFS vs music RMS', round(mr, 1), 'dBFS')
