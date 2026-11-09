import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const el = new ElevenLabsClient(); const seen = new Set();
for (const q of [{language: 'hi', gender: 'male', useCases: ['social_media']}, {language: 'hi', gender: 'male', useCases: ['narrative_story']}, {language: 'hi', gender: 'male', search: 'conversational'}, {language: 'hi', gender: 'male'}, {language: 'hi', gender: 'male', search: 'hinglish'}]) {
  try {
    const r = await el.voices.getShared({pageSize: 8, sort: 'usage_character_count_1y', ...q});
    for (const v of r.voices) { if (seen.has(v.voiceId)) continue; seen.add(v.voiceId);
      console.log(`${v.voiceId} | ${v.name} | ${v.gender} ${v.age} ${v.accent} | ${v.useCase || ''} | use ${v.usageCharacterCount1Y} | ${(v.description || '').replace(/\s+/g, ' ').slice(0, 90)}`); }
  } catch (e) { console.log('ERR', JSON.stringify(q), String(e.message).slice(0, 120)); }
}
