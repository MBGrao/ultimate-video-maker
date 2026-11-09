// ElevenLabs v3 with acting tags + per-character timestamps. Tags like [sassy] are spoken as direction, not words:
// they are dropped before the spoken words are paired 1:1 with the on-screen Roman words.
// usage: node --env-file=/Users/mbgrao/Desktop/brag/.env.local tts.mjs <voices.json> [onlyKey] [outDir]
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const [voicesPath = 'voices.json', only, outDir = 'vo'] = process.argv.slice(2);
const el = new ElevenLabsClient();
const V = JSON.parse(fs.readFileSync(voicesPath, 'utf8'));
const S = JSON.parse(fs.readFileSync('scripts.json', 'utf8')).ad1;
fs.mkdirSync(outDir, {recursive: true});
const wp = `${outDir}/words.json`; const out = fs.existsSync(wp) ? JSON.parse(fs.readFileSync(wp, 'utf8')) : {};
for (const L of S.lines.filter((x) => !only || x.k === only)) {
  const voice = V[L.role]; if (!voice) continue;
  const r = await el.textToSpeech.convertWithTimestamps(voice.id, {text: L.tts, modelId: 'eleven_v3', outputFormat: 'mp3_44100_192',
    voiceSettings: {stability: voice.stability ?? 0.5, similarityBoost: 0.8, style: voice.style ?? 0.45, useSpeakerBoost: true}});
  fs.writeFileSync(`${outDir}/${L.k}.mp3`, Buffer.from(r.audioBase64, 'base64'));
  const al = r.alignment || r.normalizedAlignment; const ch = al.characters, st = al.characterStartTimesSeconds, en = al.characterEndTimesSeconds;
  const words = []; let cur = null;
  for (let c = 0; c < ch.length; c++) {
    if (/\s/.test(ch[c])) { if (cur) { words.push(cur); cur = null; } continue; }
    if (!cur) cur = {s: '', t0: st[c], t1: en[c]}; cur.s += ch[c]; cur.t1 = en[c];
  }
  if (cur) words.push(cur);
  const spoken = words.filter((w) => !/^\[.*\]$/.test(w.s));
  const shown = L.ro.split(/\s+/); const ok = spoken.length === shown.length;
  out[L.k] = {role: L.role, scene: L.scene, ro: L.ro, fit: ok ? 'exact' : `prop ${spoken.length}/${shown.length}`, end: +en[en.length - 1].toFixed(3),
    first: +(spoken[0]?.t0 ?? 0).toFixed(3),
    words: shown.map((w, j) => { const s = ok ? spoken[j] : spoken[Math.min(spoken.length - 1, Math.floor((j * spoken.length) / shown.length))]; return {w, t0: +s.t0.toFixed(3), t1: +s.t1.toFixed(3)}; })};
  console.log(L.k.padEnd(7), L.role.padEnd(9), out[L.k].fit.padEnd(9), `${out[L.k].end}s`, L.ro);
}
fs.writeFileSync(wp, JSON.stringify(out, null, 1));
