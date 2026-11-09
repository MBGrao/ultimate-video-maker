import whisper, json, glob, difflib, subprocess
m = whisper.load_model('small')
S = {L['k']: L for L in json.load(open('scripts_v2.json'))['ad1']['lines']}
norm = lambda s: ''.join(c for c in s if c.isalpha())
for d in sorted(glob.glob('aud2/*')):
    w = json.load(open(f'{d}/words.json')); k = list(w)[0]
    ref = ' '.join(x for x in S[k]['tts'].replace('‌', '').split() if not x.startswith('['))
    txt = m.transcribe(f'{d}/{k}.mp3', language='ur', fp16=False)['text'].strip()
    y = subprocess.run(['ffmpeg', '-i', f'{d}/{k}.mp3', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    mv = y.split('mean_volume:')[-1].split('dB')[0].strip() if 'mean_volume' in y else '?'
    print(f'{d.split("/")[1]:18s} match {difflib.SequenceMatcher(None, norm(ref), norm(txt)).ratio():.2f}  mean {mv:>6s} dB | {txt}')
