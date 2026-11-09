import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const r = await new ElevenLabsClient().voices.search({search: process.argv[2], pageSize: 5});
console.log(r.voices[0]?.voiceId || '');
