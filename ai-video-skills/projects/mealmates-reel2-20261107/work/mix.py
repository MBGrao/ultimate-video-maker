"""reel 2 mix, voice first: trailer romance (cut by the scratch) -> dead silence for the twist -> desi-pop drop on the app reveal.
Every line levelled to one loudness with a presence lift + limiter; music ducks under speech. -> mix.wav (-13 LUFS)"""
import json, re, subprocess, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 48000
db = lambda d: 10 ** (d / 20); sm = lambda x: (lambda c: c * c * (3 - 2 * c))(np.clip(x, 0, 1))
def load(p, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', p] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)
T = json.load(open('../video/src/timeline.json')); D = T['duration']; N = int(SR * D); tt = np.arange(N) / SR
SC = {s['id']: s for s in T['scenes']}; LN = T['lines']; EV = T['events']
def wt(k, w):
    n = lambda s: re.sub(r'[^a-z0-9]', '', s.lower()); h = [x for x in LN[k]['words'] if n(x['w']).startswith(n(w))]
    return h[0]['t0'] if h else LN[k]['start']
fx = np.zeros((N, 2)); amb = np.zeros((N, 2)); cache = {}
def s(name):
    if name not in cache: cache[name] = load(f'sfx/{name}.mp3')
    return cache[name]
def put(x, t, g, buf=None, fade=None):
    b = fx if buf is None else buf
    i = int(max(0, t) * SR); x = x[:max(0, N - i)] * db(g)
    if fade: n = len(x); e = np.minimum(1, np.minimum(np.arange(n) / (fade * SR), (n - np.arange(n)) / (fade * SR))); x = x * e[:, None]
    b[i:i + len(x)] += x
def seg(name, a, b):
    x = s(name)
    while len(x) < int((b - a) * SR): x = np.vstack([x, x])
    return x[:int((b - a) * SR)]
SCR, DROP = EV['scratch'], EV['drop']
# --- SFX: trailer
put(s('heartbeat'), -0.0, -8); put(s('heartbeat'), LN['n1']['end'] + 0.02, -11)
r0 = SC['room']['start']; put(seg('crowd', r0, SCR), r0, -27, buf=amb, fade=0.6)
put(s('scratch'), SCR - 0.06, -5)
put(s('riser'), DROP - 1.2, -19)
put(s('whoosh_big'), DROP - 0.33, -4)
# --- SFX: app
put(s('pop'), EV['tap'], -12); put(s('notif'), EV['match'], -8); put(s('pop'), EV['match'] + 0.7, -18)
for d in (0, 0.55, 1.1): put(s('pop'), EV['chat'] + d, -15)
for w in ['verified', 'chat', 'meet', 'split']: put(s('pop'), wt('n6', w) - 0.05, -21)
put(s('cash'), EV['split'], -10)
# --- SFX: table + end
tb = SC['table']['start']; put(s('swoosh'), tb - 0.2, -15); put(seg('crowd', tb, SC['table']['end']), tb, -25, buf=amb, fade=0.3)
put(s('pop'), EV['half'] + 0.2, -14)
put(s('crunch'), LN['ay3']['end'] + 0.08, -4)
e0 = SC['end']['start']; put(s('swoosh'), e0 - 0.25, -12); put(s('ding'), LN['n7']['start'] - 0.05, -15)
put(s('pop'), wt('n8', 'join'), -15); put(s('pop'), wt('n8', 'mealmatesapp'), -15)
# --- voices: every line levelled to the same speech RMS, then presence lift + soft limiter
vo = np.zeros((N, 2)); segs = []; TARGET = db(-17)
for k, L0 in LN.items():
    x = load(f'vop/{k}.wav')
    act = x[np.abs(x[:, 0]) > 0.02 * np.abs(x[:, 0]).max()]
    x = x * (TARGET / (np.sqrt(np.mean(act ** 2)) if len(act) else 1))
    i = int(L0['file_start'] * SR); x = x[:N - i]; vo[i:i + len(x)] += x; segs.append((L0['start'], L0['end']))
vo = sosfilt(butter(2, 80, 'high', fs=SR, output='sos'), vo, axis=0)
vo = vo + 0.4 * sosfilt(butter(2, [2200, 5500], 'band', fs=SR, output='sos'), vo, axis=0)
vo = np.tanh(vo * 1.8) / np.tanh(1.8)
# --- music: romance (hard cut by the scratch) | silence for the twist | main from its first hit on the drop
R0 = SCR - 18.35
rom = np.zeros((N, 2)); xr = load('music/romance2.mp3'); i = int(R0 * SR); xr = xr[:int(SCR * SR) - i]; rom[i:i + len(xr)] = xr
rom *= (1 - sm((tt - SCR) / 0.012))[:, None] * db(-1) / (np.max(np.abs(xr)) + 1e-9)
hit = T['musicHit']; mn = np.zeros((N, 2)); xm = load('music/main.mp3', hit, D - DROP + 0.5); i = int(DROP * SR); xm = xm[:N - i]; mn[i:i + len(xm)] = xm
mn *= sm((tt - DROP) / 0.01)[:, None] * db(-1) / (np.max(np.abs(xm)) + 1e-9)
duck = np.zeros(N)
for a1, b1 in segs:
    m = (tt >= a1 - 0.15) & (tt <= b1 + 0.3); duck = np.maximum(duck, np.minimum(np.clip((tt - (a1 - .15)) / .15, 0, 1), np.clip(1 - (tt - b1) / .3, 0, 1)) * m)
g = (db(-13) * sm(duck) + (1 - sm(duck)))[:, None]
music = (rom * db(0) + mn * db(-2)) * g
music *= (1 - sm((tt - (D - 1.8)) / 1.8))[:, None]
ir = np.exp(-np.arange(int(.35 * SR)) / (.07 * SR)) * np.random.default_rng(3).standard_normal(int(.35 * SR)) * .012
fxw = sosfilt(butter(2, 12000, 'low', fs=SR, output='sos'), fx + np.stack([np.convolve(fx[:, c], ir)[:N] for c in (0, 1)], 1) * .3, axis=0)
mix = vo + music + fxw * db(-4) + amb; mix *= db(-1) / np.max(np.abs(mix))
sf.write('mix_raw.wav', mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'mix_raw.wav', '-af', 'loudnorm=I=-13:TP=-1.0:LRA=9', '-ar', '48000', 'mix.wav'], check=True)
sp = np.zeros(N, bool)
for a1, b1 in segs: sp |= (tt >= a1) & (tt <= b1)
r = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
print('mixed', round(D, 2), '| during speech: voice', round(r(vo[sp]), 1), 'dB vs music', round(r(music[sp]), 1), 'dB | music alone (gaps):', round(r(music[~sp & (tt > 0.5)]), 1), 'dB')
