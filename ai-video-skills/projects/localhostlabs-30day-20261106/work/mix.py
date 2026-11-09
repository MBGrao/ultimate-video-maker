"""Mix one reel: ElevenLabs voice + ElevenLabs music bed (ducked) + ElevenLabs/Kenney SFX, every cue placed
from the same timeline the visuals use. usage: python3 mix.py d1_pk  ->  mix/<vid>.wav (-14 LUFS after loudnorm)"""
import json, re, subprocess, sys, math, numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR = 48000
KEN = '/Users/mbgrao/Desktop/brag/skills/brag/assets/sfx/'
db = lambda d: 10 ** (d / 20)
sm = lambda x: (lambda c: c * c * (3 - 2 * c))(np.clip(x, 0, 1))
rng = np.random.default_rng(5)

def load(path, ss=0.0, dur=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss), '-i', path] + (['-t', str(dur)] if dur else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).reshape(-1, 2).astype(np.float64)

vid = sys.argv[1]
T = json.load(open('../video/src/timelines.json'))[vid]
D = T['duration']; N = int(SR * D); tt = np.arange(N) / SR
SC = {s['id']: s for s in T['scenes']}; LN = T['lines']; PK = T['lang'] == 'ur'
def wt(k, w, nth=0):
    if k not in LN: return None
    if isinstance(w, int): return LN[k]['words'][min(w, len(LN[k]['words']) - 1)]['t0']
    n = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
    hits = [x for x in LN[k]['words'] if n(x['w']).startswith(n(w))]
    return hits[min(nth, len(hits) - 1)]['t0'] if hits else LN[k]['start']
fx = np.zeros((N, 2)); cache = {}
def s(name):
    if name not in cache: cache[name] = load(f'sfx/{name}.mp3' if '/' not in name else KEN + name)
    return cache[name]
def put(x, t, g, pan=0.0):
    if t is None: return
    if x.ndim == 1: x = np.stack([x, x], 1)
    i = int(max(0, t) * SR); x = x[:max(0, N - i)] * db(g); x = x * np.array([1 - max(0, pan), 1 + min(0, pan)]); fx[i:i + len(x)] += x
def whoosh(dur=0.5, f0=300, f1=2800, peak=0.55):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 512
    for k in range(0, n, seg):
        fc = f0 * (f1 / f0) ** (k / n)
        sos = butter(2, [max(60, fc * 0.55), min(SR / 2 - 100, fc * 1.6)], 'band', fs=SR, output='sos')
        out[k:k + seg] = sosfilt(sos, x[max(0, k - 2048):k + seg])[-len(out[k:k + seg]):]
    tp = np.arange(n) / n; env = np.where(tp < peak, (tp / peak) ** 2, (1 - (tp - peak) / (1 - peak)) ** 1.6)
    return out * env / (np.max(np.abs(out * env)) + 1e-9)
def sub(dur=0.8, f=52):
    n = int(dur * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(f * (1 + 0.6 * np.exp(-t * 18))) / SR) * np.exp(-t * 4.2) * np.minimum(1, t / 0.004)
def typing(t0, dur, g=-20):
    if t0 is None: return
    k = 0
    while k * 0.07 < dur: put(s(f'keyboard/keypress-0{10 + k % 20}.wav'), t0 + k * 0.07, g, 0.15); k += 1

# ---------------- cues ----------------
cut_ids = [x['id'] for x in T['scenes']][1:]
day = vid[:2]
wipes = {'d2': ['trans', 'p1', 'punch', 'trigger']}.get(day, [])
for sid in cut_ids:
    st = SC[sid]['start']
    if sid in wipes:
        put(whoosh(0.56, 250, 3200, 0.5), st - 0.28, -9); put(s('impact/impactSoft_heavy_001.ogg'), st, -11)
    else:
        put(s('swoosh'), st - 0.2, -17)
put(sub(), 0.02, -10); put(s('impact/impactSoft_heavy_000.ogg'), 0.03, -12)

if day == 'd1':
    put(s('pop'), 0.18, -14)
    put(s('pop'), LN['hook']['start'] + 0.05, -12)
    for i, w in enumerate(['website', 'app', 'software']): put(s('interface/click_003.ogg'), wt('hook', w) + 0.02, -12, [-.3, 0, .3][i])
    if PK:
        put(s('pop'), wt('hook2', 'aap'), -10); put(s('stamp'), wt('hook2', 'confuse') - 0.02, -8); put(sub(0.6, 60), wt('hook2', 'confuse'), -12)
        put(s('cash'), wt('ctx2', 'paisa'), -14); put(s('stamp'), wt('ctx2', 'mehenga'), -8)
    else:
        put(s('ui/click2.ogg'), wt('hook2', 'wrong') - 0.05, -12); put(s('stamp'), wt('hook2', 'wrong'), -8); put(s('cash'), wt('hook2', 'pay'), -15)
    neq = wt('ctx1', 'alag') if PK else wt('ctx1', 'different')
    for i in range(3): put(s('pop'), SC['ctx']['start'] + 0.1 + i * 0.12, -17, [-.3, 0, .3][i])
    put(s('ding'), neq, -12)
    put(s('ding'), SC['trans']['start'] + 1.2, -18)
    keys = [[('p1', 'log'), ('p1', 'mithai'), ('p1', 'rate')], [('p2', 'seedha'), ('p2', 'baar')], [('p3', 'stock'), ('p3', 'staff'), ('p3', 'bill')]] if PK else \
           [[('p1', 'people'), ('p1', 'check'), ('p1', 'walk')], [('p2', 'pocket'), ('p2', 'again')], [('p3', 'inventory'), ('p3', 'staff'), ('p3', 'payroll')]]
    eqk = ['yaani'] * 3 if PK else ['storefront', 'loyalty', 'back']
    for i in range(3):
        put(s('ding'), wt(f'p{i + 1}', eqk[i]), -16)
        for k, w in keys[i]: put(s('pop'), wt(k, w) - 0.05, -15, 0.2)
    order = ['dukaan', 'bike', 'munshi'] if PK else ['storefront', 'loyalty', 'back']
    for i, w in enumerate(order): put(s('pop'), wt('pu', w) - 0.08, -12, [-.2, 0, .2][i])
    ch = ['dukaan', 'bike', 'munshi'] if PK else ['storefront', 'card', 'back']
    for i, w in enumerate(ch): put(s('interface/click_005.ogg'), wt('tg', w), -12)
    ta = LN['tg']['end'] - 0.2; typing(ta, 0.8); put(s('ding'), ta + 1.2, -14)
else:
    close = wt('hook', 'bhi') if PK else wt('hook', 'survive')
    for k in range(5): put(s(f'impact/footstep_wood_00{k % 5}.ogg'), 0.35 + k * 0.42, -18, [-.1, .1][k % 2])
    put(s('door'), close - 0.12, -6)
    if PK:
        for k in range(2): put(s('ding'), SC['story']['start'] + 0.4 + k * 0.9, -20)
        put(s('call_end'), wt('s1', 'band'), -10)
    for w in ['domain', 'code', 'password']:
        put(s('swoosh'), wt('s2', w) - 0.15, -16); put(s('stamp'), wt('s2', w) + 0.35, -10)
    put(s('pop'), SC['rent']['start'] + 0.7, -12)
    tr = SC['trans']['start']; typing(tr + 0.15, 0.4); typing(tr + 0.75, 1.0, -22)
    ka = LN['tr']['start'] + 0.9; typing(ka, 0.5); put(s('ding'), ka + 0.5, -14)
    for k in range(3): put(s('pop'), ka + 0.5 + k * 0.12, -16, [-.3, 0, .3][k])
    for i, w in enumerate(['domain', 'code', 'hosting']):
        p = f'p{i + 1}'; turn = wt(p, w)
        put(s('swoosh'), SC[p]['start'] + 0.15, -14); put(s('key_turn'), turn - 0.08, -7); put(s('ding'), turn + 0.32, -13)
        card = max(wt(p, 2), turn + 0.5)
        put(s('stamp'), card + 0.9, -11)
    last = wt('pu', 'chaabi') if PK else wt('pu', 'own')
    put(s('pop'), last, -10); put(sub(0.9, 50), SC['punch']['start'], -11)
    btn = ['mere', 'pata'] if PK else ['own', 'not']
    for w in btn: put(s('interface/click_005.ogg'), wt('tg', w), -12)
    ta = LN['tg']['end'] - 0.2; typing(ta, 0.8)
# end card (both days)
c = SC['cta']['start']
put(s('riser'), c - 1.0, -18); put(s('pop'), c + 0.05, -12); put(s('ding'), c + 0.4, -14)
so = LN['so']['start'] + 0.15; typing(so, 1.2, -22)

# ---------------- voice ----------------
vo = np.zeros((N, 2)); segs = []
for k, Lk in LN.items():
    x = load(f'vo/{vid}/{k}.mp3'); i = int(Lk['start'] * SR); x = x[:N - i]
    vo[i:i + len(x)] += x; segs.append((Lk['start'], Lk['end']))
vo = sosfilt(butter(2, 80, 'high', fs=SR, output='sos'), vo, axis=0)
vo *= db(-3) / (np.max(np.abs(vo)) + 1e-9)

# ---------------- music (ElevenLabs bed, first beat at t=0) ----------------
mus = load(f'music/{T["track"]}.mp3', T['musicOffset'], D + 0.5)[:N]
if len(mus) < N:  # loop the bed on a beat boundary if the reel is longer than the track
    mus = np.vstack([mus, load(f'music/{T["track"]}.mp3', T['musicOffset'] + 8 * 0.5341, None)[:N - len(mus)]])
mus = np.vstack([mus, np.zeros((max(0, N - len(mus)), 2))])[:N]
mus *= db(-1) / (np.max(np.abs(mus)) + 1e-9)
duck = np.zeros(N)
for a, b in segs:
    m = (tt >= a - 0.2) & (tt <= b + 0.45)
    duck = np.maximum(duck, np.minimum(np.clip((tt - (a - 0.2)) / 0.2, 0, 1), np.clip(1 - (tt - b) / 0.45, 0, 1)) * m)
music = mus * (db(-14) * sm(duck) + (1 - sm(duck)))[:, None] * db(-9)
music *= sm(tt / 0.06)[:, None]; music *= (1 - sm((tt - (D - 2.0)) / 2.0))[:, None]

ir = np.exp(-np.arange(int(0.4 * SR)) / (0.08 * SR)) * np.random.default_rng(3).standard_normal(int(0.4 * SR)) * 0.012
fxw = fx + np.stack([np.convolve(fx[:, ch], ir)[:N] for ch in (0, 1)], 1) * 0.5
fxw = sosfilt(butter(2, 11000, 'low', fs=SR, output='sos'), fxw, axis=0)
mix = vo + music + fxw * db(-2)
mix *= db(-1.0) / np.max(np.abs(mix))
import os; os.makedirs('mix', exist_ok=True)
sf.write(f'mix/{vid}_raw.wav', mix.astype(np.float32), SR)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'mix/{vid}_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', f'mix/{vid}.wav'], check=True)
print(vid, 'mixed', round(D, 2), 's')
