import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const s = await new ElevenLabsClient().user.subscription.get();
console.log('ElevenLabs', s.tier, '| characters used', s.characterCount, 'of', s.characterLimit, '| resets', new Date(s.nextCharacterCountResetUnix * 1000).toISOString().slice(0, 10));
