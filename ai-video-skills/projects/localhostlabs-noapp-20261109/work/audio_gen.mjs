// ElevenLabs music cut to this reel's beats (composition plan) + the SFX the script calls for. Key comes from the env file.
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const el = new ElevenLabsClient();
const LANG = process.argv[2] || 'en', SUF = LANG === 'en' ? '' : `_${LANG}`;
const T = JSON.parse(fs.readFileSync(`../video/src/timeline${SUF}.json`, 'utf8')); const E = T.events; const ms = (s) => Math.round(s * 1000);
const toBuf = async (s) => { if (s?.arrayBuffer) return Buffer.from(await s.arrayBuffer()); const ch = []; for await (const c of s) ch.push(Buffer.from(c)); return Buffer.concat(ch); };
const run = async (path, fn) => { try { fs.writeFileSync(path, await toBuf(await fn())); console.log('ok', path); } catch (e) { console.log('FAIL', path, String(e.message || e).slice(0, 200)); } };
const q3 = T.scenes.find((s) => s.id === 'q3'), cta = T.scenes.find((s) => s.id === 'cta');
const plan = {
  positiveGlobalStyles: ['modern minimal tech-house', 'punchy 808 kick', 'crisp hi-hats', 'clean synth plucks', 'confident', 'instrumental', '120 BPM', 'social media reel music'],
  negativeGlobalStyles: ['vocals', 'lyrics', 'choir', 'fade out', 'lo-fi', 'orchestral'],
  sections: [
    {sectionName: 'Cold open', positiveLocalStyles: ['huge bass hit on the very first beat', 'bold driving drums', 'immediate energy'], negativeLocalStyles: ['intro build', 'quiet start'], durationMs: ms(E.dont), lines: []},
    {sectionName: 'Groove', positiveLocalStyles: ['steady driving groove', 'bright plucky synth motif', 'ticking hi-hats', 'focused, motivating'], negativeLocalStyles: ['breakdown'], durationMs: ms(q3.start - E.dont), lines: []},
    {sectionName: 'Tension', positiveLocalStyles: ['drums drop out', 'filtered pad', 'clock-like ticking percussion', 'suspense building', 'rising tension'], negativeLocalStyles: ['full drums'], durationMs: ms(cta.start - q3.start), lines: []},
    {sectionName: 'Resolve', positiveLocalStyles: ['full groove returns', 'warm uplifting chords', 'confident', 'ends on one clean final hit'], negativeLocalStyles: ['fade out'], durationMs: ms(T.duration - cta.start), lines: []},
  ],
};
await run(`music/bed${SUF}.mp3`, () => el.music.compose({modelId: 'music_v1', compositionPlan: plan}));
const SFX = [
  ['bass_hit', 'Deep punchy cinematic bass hit impact with a short sub drop', 1.2],
  ['sword', 'Fast sharp sword slice swish, metallic blade whoosh cutting the air', 0.8],
  ['tick', 'Single soft clean clock tick, subtle UI tick', 0.5],
  ['click', 'Crisp single computer mouse click', 0.5],
  ['clock_fast', 'Clock ticking extremely fast like a time-lapse fast-forward', 2.5],
  ['paper_rip', 'One quick sheet of paper being torn in half, crisp rip', 1.0],
  ['pen', 'Felt-tip marker pen drawing lines and writing quickly on paper, close up', 3.0],
  ['boom', 'Low deep cinematic boom with sub bass rumble and debris scatter', 2.2],
];
if (LANG === 'en') await Promise.all(SFX.map(([k, text, d]) => run(`sfx/${k}.mp3`, () => el.textToSoundEffects.convert({text, durationSeconds: d, promptInfluence: 0.6}))));
