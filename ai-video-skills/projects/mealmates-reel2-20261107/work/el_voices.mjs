import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const el = new ElevenLabsClient(); const seen = new Set();
for (const q of [{search: 'movie trailer', gender: 'male', language: 'en'}, {search: 'trailer', gender: 'male'}, {search: 'pakistani', gender: 'female', language: 'en'}, {search: 'south asian', gender: 'female'}, {search: 'pakistani', gender: 'male', language: 'en'}]) {
  const r = await el.voices.getShared({pageSize: 7, sort: 'usage_character_count_1y', ...q});
  for (const v of r.voices) { if (seen.has(v.voiceId)) continue; seen.add(v.voiceId);
    console.log(`${v.voiceId} | ${v.name} | ${v.gender} ${v.age} ${v.accent} | ${v.useCase || ''} | use ${v.usageCharacterCount1Y} | ${(v.description || '').replace(/\s+/g, ' ').slice(0, 80)}`); }
}
