import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const el = new ElevenLabsClient();
const toBuf = async (s) => { if (s?.arrayBuffer) return Buffer.from(await s.arrayBuffer()); const ch = []; for await (const c of s) ch.push(Buffer.from(c)); return Buffer.concat(ch); };
const run = async (path, fn) => { try { fs.writeFileSync(path, await toBuf(await fn())); console.log('ok', path); } catch (e) { console.log('FAIL', path, String(e.message || e).slice(0, 160)); } };
await run('music/romance.mp3', () => el.music.compose({modelId: 'music_v1', musicLengthMs: 18000, prompt: 'Instrumental only, no vocals. Sweeping romantic movie-trailer cue: lush strings, soft piano, a gentle harp glissando, slow 70 BPM, swelling and dreamy like a Bollywood rom-com trailer, building to a big held emotional chord.'}));
await run('music/main.mp3', () => el.music.compose({modelId: 'music_v1', musicLengthMs: 34000, prompt: 'Instrumental only, no vocals. Upbeat modern desi pop for a food-app ad: punchy 808 kick and claps, dhol accents, bright plucky synth hook, playful and confident, 112 BPM, big hit on the first downbeat, steady energy for a voiceover, clean ending.'}));
for (const [k, text, d] of [['heartbeat', 'Two slow dramatic heartbeats, deep and cinematic', 1.6], ['crunch', 'Biting into crispy french fries, close and crunchy', 0.8], ['shutter', 'Camera shutter click', 0.4], ['whoosh_big', 'Big cinematic whoosh transition into a bass drop impact', 1.4]]) {
  await run(`sfx/${k}.mp3`, () => el.textToSoundEffects.convert({text, durationSeconds: d, promptInfluence: 0.6}));
}
