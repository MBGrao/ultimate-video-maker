import json, subprocess, difflib, os, sys, whisper
m = whisper.load_model('small')
V = {'n4': [('Match, seconds mein!', 'میچ، سیکنڈز میں!'), ('Food buddy, sirf chand seconds mein.', 'فوڈ بڈی، صرف چند سیکنڈز میں۔'), ('Aur food buddy seconds mein haazir!', '[excited] اور فوڈ بڈی سیکنڈز میں حاضر!')],
     'h5': [('Aadha aadha!', 'آدھا آدھا!'), ('Aadha aadha kar lete hain!', '[happy] آدھا آدھا کر لیتے ہیں!'), ('Bill aadha aadha!', 'بل آدھا آدھا!')]}
norm = lambda s: ''.join(c for c in s if c.isalpha())
best = {}
for k, opts in V.items():
    for i, (ro, tts) in enumerate(opts):
        S = json.load(open('scripts_v2.json'))
        for L in S['ad1']['lines']:
            if L['k'] == k: L['ro'], L['tts'] = ro, tts
        json.dump(S, open('scripts_try.json', 'w'), indent=1, ensure_ascii=False)
        d = f'takes/{k}_{i}'; os.makedirs(d, exist_ok=True)
        subprocess.run(['node', '--env-file=/Users/mbgrao/Desktop/brag/.env.local', 'tts2.mjs', 'voices_v2.json', k, d], env={**os.environ, 'SCRIPTS': 'scripts_try.json'}, capture_output=True)
        txt = m.transcribe(f'{d}/{k}.mp3', language='ur', fp16=False)['text'].strip()
        ref = ' '.join(x for x in tts.split() if not x.startswith('['))
        sc = difflib.SequenceMatcher(None, norm(ref), norm(txt)).ratio()
        print(k, i, f'{sc:.2f}', ro, '|', txt, flush=True)
        if sc > best.get(k, (0,))[0]: best[k] = (sc, i, ro, tts)
json.dump(best, open('takes/best.json', 'w'), ensure_ascii=False, indent=1); print(best)
