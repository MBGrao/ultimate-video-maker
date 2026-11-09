"""'You probably don't need an app' mix, voice first. Music composed to the beats; it cuts out on the record scratch
("don't") and slams back on the blade slice. Every SFX from the script lands on its word. -> mix.wav (-14 LUFS)"""
import json, re, subprocess, sys, numpy as np, soundfile as sf
LANG = sys.argv[1] if len(sys.argv) > 1 else 'en'; SUF = '' if LANG == 'en' else f'_{LANG}'
from scipy.signal import butter, sosfilt
SR = 48000
db = lambda d: 10 ** (d / 20); sm = lambda x: (lambda c: c * c * (3 - 2 * c))(np.clip(x, 0, 1))
def load(p, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', p] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)
T = json.load(open(f'../video/src/timeline{SUF}.json')); D = T['duration']; N = int(SR * D); tt = np.arange(N) / SR
SC = {s['id']: s for s in T['scenes']}; LN = T['lines']; EV = T['events']
def wt(k, w):
    n = lambda s: re.sub(r'[^a-z0-9]', '', s.lower()); h = [x for x in LN[k]['words'] if n(x['w']).startswith(n(w))]
    return h[0]['t0'] if h else LN[k]['start']
fx = np.zeros((N, 2)); cache = {}
def s(name):
    if name not in cache: cache[name] = load(f'sfx/{name}.mp3')
    return cache[name]
def put(x, t, g, dur=None, fade=0.05):
    if dur: x = x[:int(dur * SR)]
    i = int(max(0, t) * SR); x = x[:max(0, N - i)] * db(g)
    n = len(x); e = np.minimum(1, np.minimum(np.arange(n) / (0.004 * SR), (n - np.arange(n)) / (fade * SR))); fx[i:i + n] += x * e[:, None]
# --- hook
put(s('notif'), 0.0, -13); put(s('bass_hit'), EV['app'] - 0.02, -1)
# --- contradict: scratch on "don't", sword swish on the slice
put(s('scratch'), EV['dont'] - 0.05, -4); put(s('sword'), EV['slice'] - 0.1, -4)
# --- stay + counter ticks
for k in ['c0', 'c1', 'c2', 'c3']: put(s('tick'), EV[k] - 0.02, -10)
for i in range(3): put(s('pop'), EV['questions'] + i * 0.12, -21)
put(s('stamp'), EV['third'] - 0.05, -16)
# --- q1: whoosh on the split, click on "team"
put(s('swoosh'), SC['q1']['start'] - 0.12, -10); put(s('click'), EV['team'], -6); put(s('stamp'), EV['tool'], -11)
# --- q2: fast typing through the manual copy, clock on the ramp, one ding on "automate"
ifT = EV['q2if']
put(s('typing'), EV['copying'] - 0.1, -15, dur=ifT - EV['copying'] + 0.1, fade=0.15)
put(s('clock_fast'), EV['ramp'], -13, dur=ifT - EV['ramp'], fade=0.1); put(s('ding'), EV['auto'] - 0.03, -7)
for i in range(5): put(s('pop'), SC['q2']['start'] + 0.5 + i * 0.32, -22)
# --- q3: paper rip, pen scratch while drawing, stamp, pops as the chaos stacks, low boom on "explode"
put(s('paper_rip'), SC['q3']['start'] - 0.04, -5)
put(s('pen'), EV['draw'] - 0.35, -13, dur=2.25, fade=0.2); put(s('pen'), EV['ifnot'] + 0.05, -13, dur=0.5, fade=0.15)
put(s('stamp'), EV['build'] - 0.05, -8)
for d in (-0.12, 0.35, 0.75, 1.15): put(s('pop'), EV['skip'] + d, -15)
put(s('boom'), EV['explode'] - 0.03, -1)
# --- cta
put(s('stamp'), EV['scope1'] - 0.05, -13); put(s('swoosh'), EV['before'], -17)
put(s('notif'), EV['comment'] + 0.12, -7); put(s('swoosh'), EV['logo'], -14)
# --- voice: each line levelled to the same speech RMS, presence lift, soft limiter
vo = np.zeros((N, 2)); segs = []; TARGET = db(-17)
for k, L0 in LN.items():
    x = load(f'vop{SUF}/{k}.wav'); act = x[np.abs(x[:, 0]) > 0.02 * np.abs(x[:, 0]).max()]
    x = x * (TARGET / (np.sqrt(np.mean(act ** 2)) if len(act) else 1))
    i = int(L0['file_start'] * SR)
    if i < 0: x, i = x[-i:], 0
    x = x[:N - i]; vo[i:i + len(x)] += x; segs.append((L0['start'], L0['end']))
vo = sosfilt(butter(2, 80, 'high', fs=SR, output='sos'), vo, axis=0)
vo = vo + 0.4 * sosfilt(butter(2, [2200, 5500], 'band', fs=SR, output='sos'), vo, axis=0)
vo = np.tanh(vo * 1.8) / np.tanh(1.8)
# --- music: composed to the timeline; silent from the scratch to the slice
mu = load(f'music/bed{SUF}.mp3')[:N]; mu = np.vstack([mu, np.zeros((N - len(mu), 2))]); mu *= db(-1) / (np.max(np.abs(mu)) + 1e-9)
gate = 1 - (sm((tt - EV['dont']) / 0.015) * (1 - sm((tt - (EV['slice'] - 0.02)) / 0.02)))
duck = np.zeros(N)
for a1, b1 in segs:
    m = (tt >= a1 - 0.15) & (tt <= b1 + 0.3); duck = np.maximum(duck, np.minimum(np.clip((tt - (a1 - .15)) / .15, 0, 1), np.clip(1 - (tt - b1) / .3, 0, 1)) * m)
music = mu * (gate * (db(-16) * sm(duck) + (1 - sm(duck))))[:, None] * db(-3)
music *= (1 - sm((tt - (D - 0.6)) / 0.6))[:, None]
ir = np.exp(-np.arange(int(.3 * SR)) / (.06 * SR)) * np.random.default_rng(3).standard_normal(int(.3 * SR)) * .012
fxw = sosfilt(butter(2, 13000, 'low', fs=SR, output='sos'), fx + np.stack([np.convolve(fx[:, c], ir)[:N] for c in (0, 1)], 1) * .25, axis=0)
mix = vo + music + fxw * db(-3); mix *= db(-1) / np.max(np.abs(mix))
sf.write(f'mix{SUF}_raw.wav', mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'mix{SUF}_raw.wav', '-af', 'loudnorm=I=-13.6:TP=-1.0:LRA=9', '-ar', '48000', f'mix{SUF}.wav'], check=True)
sp = np.zeros(N, bool)
for a1, b1 in segs: sp |= (tt >= a1) & (tt <= b1)
r = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
print('mixed', round(D, 2), '| during speech: voice', round(r(vo[sp]), 1), 'dB vs music', round(r(music[sp]), 1), 'dB | music in gaps', round(r(music[~sp & (tt > 0.3)]), 1), 'dB')
