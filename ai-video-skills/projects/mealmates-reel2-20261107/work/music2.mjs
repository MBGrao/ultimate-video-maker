// romance cue cut to the trailer: tension under the hook, warmth for "two strangers", full swell into the record scratch (no fade)
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const el = new ElevenLabsClient();
const toBuf = async (s) => { if (s?.arrayBuffer) return Buffer.from(await s.arrayBuffer()); const ch = []; for await (const c of s) ch.push(Buffer.from(c)); return Buffer.concat(ch); };
const plan = {
  positiveGlobalStyles: ['cinematic romantic movie trailer score', 'orchestral strings', 'grand piano', 'harp', 'Bollywood rom-com', 'instrumental', '72 BPM'],
  negativeGlobalStyles: ['vocals', 'choir singing', 'drums kit', 'electronic', 'fade out', 'lo-fi'],
  sections: [
    {sectionName: 'Tension', positiveLocalStyles: ['quiet low cello drone', 'soft timpani pulse like a heartbeat', 'single sparse piano notes', 'mysterious, intimate'], negativeLocalStyles: ['loud', 'melody'], durationMs: 6400, lines: []},
    {sectionName: 'Two strangers', positiveLocalStyles: ['warm violins enter', 'tender piano melody', 'harp glissando', 'hopeful romantic', 'gently building'], negativeLocalStyles: ['percussion'], durationMs: 6300, lines: []},
    {sectionName: 'Swell', positiveLocalStyles: ['full orchestra swell', 'soaring violins', 'big rising crescendo', 'cymbal swell', 'maximum emotion', 'sustained at full intensity to the very last second', 'abrupt end on the climax'], negativeLocalStyles: ['fade out', 'resolution', 'quiet ending'], durationMs: 7300, lines: []},
  ],
};
try {
  const buf = await toBuf(await el.music.compose({modelId: 'music_v1', compositionPlan: plan}));
  fs.writeFileSync('music/romance2.mp3', buf); console.log('ok music/romance2.mp3', buf.length);
} catch (e) { console.log('FAIL', String(e.message || e).slice(0, 300)); }
