// ElevenLabs voiceover with per-character timestamps -> vo/<video>/<line>.mp3 + words.json
// usage: node --env-file=/Users/mbgrao/Desktop/brag/.env.local tts.mjs <video> <voiceId> [model] [onlyLineKey] [outDir]
// The SDK reads ELEVENLABS_API_KEY from the environment; the key is never in this file.
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const [video, voiceId, model = 'eleven_v3', only, outDir] = process.argv.slice(2);
const el = new ElevenLabsClient();
const S = JSON.parse(fs.readFileSync('scripts.json', 'utf8'))[video];
const dir = outDir || `vo/${video}`; fs.mkdirSync(dir, {recursive: true});
const wordsPath = `${dir}/words.json`;
const out = fs.existsSync(wordsPath) ? JSON.parse(fs.readFileSync(wordsPath, 'utf8')) : {};
const lines = S.lines.filter((L) => !only || L.k === only);
for (const L of lines) {
  const text = L.tts || L.ro;
  const i = S.lines.indexOf(L);
  const req = {
    text, modelId: model, outputFormat: 'mp3_44100_192',
    voiceSettings: {stability: 0.5, similarityBoost: 0.8, style: 0.35, useSpeakerBoost: true},
    ...(S.lang === 'ur' && model !== 'eleven_v3' ? {languageCode: 'ur'} : {}),
    ...(model !== 'eleven_v3' ? {previousText: S.lines[i - 1]?.tts || S.lines[i - 1]?.ro, nextText: S.lines[i + 1]?.tts || S.lines[i + 1]?.ro} : {}),
  };
  const r = await el.textToSpeech.convertWithTimestamps(voiceId, req);
  fs.writeFileSync(`${dir}/${L.k}.mp3`, Buffer.from(r.audioBase64, 'base64'));
  const al = r.alignment || r.normalizedAlignment;
  // characters -> words of the spoken text, then pair 1:1 with the on-screen Roman words
  const spoken = text.split(/\s+/), shown = L.ro.split(/\s+/);
  const chars = al.characters, st = al.characterStartTimesSeconds, en = al.characterEndTimesSeconds;
  const wt = []; let cur = null;
  for (let c = 0; c < chars.length; c++) {
    if (/\s/.test(chars[c])) { if (cur) { wt.push(cur); cur = null; } continue; }
    if (!cur) cur = {t0: st[c], t1: en[c]}; else cur.t1 = en[c];
  }
  if (cur) wt.push(cur);
  const ok = wt.length === shown.length;
  const words = shown.map((w, j) => {
    const src = ok ? wt[j] : wt[Math.min(wt.length - 1, Math.floor((j * wt.length) / shown.length))];
    return {w, t0: +src.t0.toFixed(3), t1: +src.t1.toFixed(3)};
  });
  out[L.k] = {scene: L.scene, ro: L.ro, words, fit: ok ? 'exact' : `prop ${wt.length}/${shown.length}`, end: +en[en.length - 1].toFixed(3)};
  console.log(L.k.padEnd(6), out[L.k].fit.padEnd(10), out[L.k].end + 's', L.ro);
}
fs.writeFileSync(wordsPath, JSON.stringify(out, null, 1));
