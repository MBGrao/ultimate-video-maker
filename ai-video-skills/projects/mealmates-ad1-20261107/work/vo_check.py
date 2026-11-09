import whisper, json, difflib, subprocess
m = whisper.load_model('small')
S = {L['k']: L for L in json.load(open('scripts_v2.json'))['ad1']['lines']}
W = json.load(open('vo2/words.json'))
norm = lambda s: ''.join(c for c in s if c.isalpha()).lower()
for k, L in S.items():
    eng = L['k'].startswith('a')
    ref = ' '.join(x for x in L['tts'].replace('‌', '').split() if not x.startswith('['))
    txt = m.transcribe(f'vo2/{k}.mp3', language='en' if eng else 'ur', fp16=False)['text'].strip()
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'vo2/{k}.mp3'], capture_output=True, text=True).stdout)
    w = W[k]['words']
    print(f"{k:3s} {L['role']:10s} match {difflib.SequenceMatcher(None, norm(ref), norm(txt)).ratio():.2f} file {d:4.2f}s speech {w[0]['t0']:.2f}-{w[-1]['t1']:.2f} | {txt}")
