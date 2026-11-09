"""Re-time each spoken word with local Whisper word timestamps (python3.9 env with openai-whisper).
Script words are mapped onto Whisper's timeline by cumulative character position, so it works
even when Whisper splits or merges a word differently. Updates vo/words.json in place."""
import json, whisper, numpy as np
m = whisper.load_model('small')
W = json.load(open('vo/words.json'))
S = {L['k']: L for L in json.load(open('script.json'))}
for k, L in W.items():
    r = m.transcribe(f'vo/{k}.wav', language='hi', word_timestamps=True, fp16=False,
                     initial_prompt=S[k]['hi'], condition_on_previous_text=False)
    ww = [w for s in r['segments'] for w in s['words']]
    if not ww: print(k, 'no words, kept'); continue
    # knots: cumulative char fraction -> time
    lens = [max(1, len(w['word'].strip())) for w in ww]; tot = sum(lens)
    xs, ys, c = [0.0], [ww[0]['start']], 0
    for w, n in zip(ww, lens):
        xs.append((c + n * 0.5) / tot); ys.append((w['start'] + w['end']) / 2)
        c += n; xs.append(c / tot); ys.append(w['end'])
    xs, ys = np.array(xs), np.maximum.accumulate(np.array(ys))
    hi = S[k]['hi'].split(); hl = [len(h.strip(',.।:?;')) for h in hi]; ht = sum(hl)
    ro = S[k]['ro'].split(); c = 0; out = []
    for i, n in enumerate(hl):
        t0 = float(np.interp(c / ht, xs, ys)); t1 = float(np.interp((c + n) / ht, xs, ys)); c += n
        out.append({'w': ro[i], 't0': round(t0, 3), 't1': round(max(t1, t0 + 0.08), 3)})
    L['words'] = out; L['fit'] = f'whisper:{len(ww)}/{len(hi)}'
    print(k, L['fit'], ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in out), flush=True)
json.dump(W, open('vo/words.json', 'w'), indent=1, ensure_ascii=False)
