import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
import fs from 'node:fs';
const el = new ElevenLabsClient();
const toBuf = async (s) => { if (s?.arrayBuffer) return Buffer.from(await s.arrayBuffer()); const ch = []; for await (const c of s) ch.push(Buffer.from(c)); return Buffer.concat(ch); };
const jobs = [
  ['music/bed.mp3', () => el.music.compose({modelId: 'music_v1', musicLengthMs: 36000, prompt: 'Instrumental only, no vocals. Playful desi comedy background for a Pakistani food-app Instagram ad: bouncy dhol and tabla groove, plucky sitar riff, pizzicato strings and claps, cheeky and upbeat, 112 BPM, consistent energy for dialogue on top, clean ending.'})],
  ['music/sad.mp3', () => el.music.compose({modelId: 'music_v1', musicLengthMs: 7000, prompt: 'Instrumental only. Over-the-top tragic solo violin with soft strings, melodramatic Bollywood heartbreak sting, slow, 7 seconds.'})],
];
const SFX = [
  ['dhoom', 'Dramatic Indian TV serial zoom-in hit, "dhoom" orchestral stab with deep drum boom and whoosh', 1.6],
  ['scratch', 'Vinyl record scratch, comedic stop', 0.8],
  ['cat', 'Cat yowls in surprise and scurries away fast on a tiled floor', 1.4],
  ['tsk', 'A man clicking his tongue "tsk tsk" disapprovingly, close and dry', 0.8],
  ['ring', 'Mobile phone ringing once, modern ringtone, then a call connecting click', 1.6],
  ['buzzer', 'Game show wrong answer buzzer, short and funny', 0.8],
  ['rain', 'Soft night rain on a park with distant thunder rumble', 4.5],
  ['crowd', 'Busy restaurant ambience with light chatter and cutlery, Pakistan', 4.0],
  ['notif', 'Bright happy app notification chime, match found', 1.0],
];
for (const [path, fn] of jobs) { try { fs.writeFileSync(path, await toBuf(await fn())); console.log('ok', path); } catch (e) { console.log('FAIL', path, String(e.message || e).slice(0, 160)); } }
for (const [k, text, d] of SFX) { try { fs.writeFileSync(`sfx/${k}.mp3`, await toBuf(await el.textToSoundEffects.convert({text, durationSeconds: d, promptInfluence: 0.6}))); console.log('ok sfx', k); } catch (e) { console.log('FAIL', k, String(e.message || e).slice(0, 160)); } }
