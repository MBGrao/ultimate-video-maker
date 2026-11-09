import whisper, json, difflib, glob, subprocess
m = whisper.load_model('small')
ref = [L for L in json.load(open('scripts.json'))['d1_pk']['lines'] if L['k'] == 'p2'][0]['tts']
norm = lambda s: ''.join(ch for ch in s if ch.isalpha())
for f in sorted(glob.glob('audition/*/p2.mp3')):
    r = m.transcribe(f, language='ur', fp16=False)['text'].strip()
    sim = difflib.SequenceMatcher(None, norm(ref.replace('‌', '')), norm(r)).ratio()
    lufs = subprocess.run(['ffmpeg', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr.split('I:')[-1].split('LUFS')[0].strip()
    print(f.split('/')[1].ljust(9), f'match {sim:.2f}', f'loud {lufs}', '|', r)
