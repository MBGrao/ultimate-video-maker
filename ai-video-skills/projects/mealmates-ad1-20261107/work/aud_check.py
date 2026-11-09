import whisper, json, glob, difflib, subprocess
m = whisper.load_model('small')
S = {L['k']: L for L in json.load(open('scripts.json'))['ad1']['lines']}
norm = lambda s: ''.join(c for c in s if c.isalpha())
for d in sorted(glob.glob('audition/*')):
    w = json.load(open(f'{d}/words.json')); k = list(w)[0]
    ref = ' '.join(x for x in S[k]['tts'].replace('‌', '').split() if not x.startswith('['))
    txt = m.transcribe(f'{d}/{k}.mp3', language='ur', fp16=False)['text'].strip()
    sim = difflib.SequenceMatcher(None, norm(ref), norm(txt)).ratio()
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{d}/{k}.mp3'], capture_output=True, text=True).stdout)
    print(f'{d.split("/")[1]:16s} match {sim:.2f}  {dur:4.1f}s  | {txt}')
