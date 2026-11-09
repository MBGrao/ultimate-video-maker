import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const el = new ElevenLabsClient(); const seen = new Set();
for (const q of [{language: 'ur', gender: 'female'}, {search: 'pakistani', gender: 'female'}, {search: 'urdu', gender: 'female'}, {search: 'aunty', gender: 'female'}, {search: 'desi mother', gender: 'female'}, {language: 'hi', gender: 'female', age: 'middle_aged'}]) {
  const r = await el.voices.getShared({pageSize: 10, sort: 'usage_character_count_1y', ...q});
  for (const v of r.voices) { if (seen.has(v.voiceId)) continue; seen.add(v.voiceId);
    console.log(`${v.voiceId} | ${v.name} | ${v.age} ${v.accent} | ${v.language} | ${v.useCase || ''} | use ${v.usageCharacterCount1Y} | ${(v.description || '').replace(/\s+/g, ' ').slice(0, 90)}`); }
}
