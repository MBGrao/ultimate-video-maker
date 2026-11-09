// ElevenLabs Music + Sound Effects for the reels (key from ELEVENLABS_API_KEY via --env-file).
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const el = new ElevenLabsClient();
fs.mkdirSync('music', {recursive: true}); fs.mkdirSync('sfx', {recursive: true});
const toBuf = async (s) => { if (Buffer.isBuffer(s)) return s; if (s?.arrayBuffer) return Buffer.from(await s.arrayBuffer()); const ch = []; for await (const c of s) ch.push(Buffer.from(c)); return Buffer.concat(ch); };
const MUSIC = {
  d1: 'Instrumental only, no vocals. Bright, clean, modern minimal tech-explainer bed for an Instagram reel, 112 BPM, steady four-on-the-floor soft kick, crisp claps on 2 and 4, plucky marimba and soft synth chords, warm sub bass, optimistic and confident, Apple-keynote feel, subtle risers every 8 bars, consistent energy so a voiceover sits on top, clean ending.',
  d2: 'Instrumental only, no vocals. Playful-suspense explainer bed for an Instagram reel about a scam warning, 112 BPM, tight hip-hop drums with a soft kick and snappy snare, pizzicato strings and muted plucked bass giving a sneaky detective feel for the first part, then turning bright and resolved with warm keys in the second half, consistent energy under a voiceover, clean ending.',
};
const SFX = {
  pop: 'Soft satisfying UI pop, a chat bubble appearing, short and clean',
  swoosh: 'Quick airy whoosh for a card sliding across the screen, short, modern UI',
  ding: 'Gentle bright notification ding, single note, clean',
  key_turn: 'Old metal key inserted into a lock and turned, then a satisfying lock click, close up, dry',
  door: 'Front door closing firmly in a hallway, single thud with a latch click',
  call_end: 'Phone call ending beep, three short descending tones',
  stamp: 'Rubber stamp slammed hard on paper on a wooden desk, punchy thud',
  typing: 'Fast typing on a laptop keyboard for two seconds, crisp',
  riser: 'Short tension riser whoosh building up for one second then cut',
  cash: 'Cash register cha-ching, short and bright',
};
for (const [k, prompt] of Object.entries(MUSIC)) {
  try {
    const s = await el.music.compose({prompt, musicLengthMs: 62000, modelId: 'music_v1'});
    fs.writeFileSync(`music/${k}.mp3`, await toBuf(s)); console.log('music ok', k);
  } catch (e) { console.log('music FAIL', k, String(e.message || e).slice(0, 200)); }
}
for (const [k, text] of Object.entries(SFX)) {
  try {
    const s = await el.textToSoundEffects.convert({text, promptInfluence: 0.6, ...(k === 'typing' ? {durationSeconds: 2} : k === 'riser' ? {durationSeconds: 1.2} : {})});
    fs.writeFileSync(`sfx/${k}.mp3`, await toBuf(s)); console.log('sfx ok', k);
  } catch (e) { console.log('sfx FAIL', k, String(e.message || e).slice(0, 200)); }
}
