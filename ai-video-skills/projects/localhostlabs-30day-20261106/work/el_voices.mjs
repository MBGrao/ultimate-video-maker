import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const el = new ElevenLabsClient();
const seen = new Set();
for (const q of [{language: 'ur', gender: 'male', pageSize: 40}, {search: 'pakistani', pageSize: 30}, {search: 'urdu conversational', pageSize: 30}, {language: 'ur', category: 'professional', pageSize: 30}]) {
  const r = await el.voices.getShared({...q, sort: 'usage_character_count_1y'});
  console.log('\n==', JSON.stringify(q), r.voices.length);
  for (const v of r.voices) { if (seen.has(v.voiceId)) continue; seen.add(v.voiceId);
    console.log(`  ${v.voiceId} | ${v.name} | ${v.gender} ${v.age} ${v.accent} | ${v.language} | ${v.useCase || ''} | use1y ${v.usageCharacterCount1Y} | ${(v.description || '').replace(/\s+/g, ' ').slice(0, 110)}`); }
}
