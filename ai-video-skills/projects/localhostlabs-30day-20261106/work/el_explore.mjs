// Read-only look at the ElevenLabs account: plan, credits, models, voices, and library voices for Urdu/Hindi.
// Key comes from ELEVENLABS_API_KEY (loaded with node --env-file=.env.local), never from code.
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const el = new ElevenLabsClient();
const sub = await el.user.subscription.get();
console.log('PLAN', sub.tier, '| chars used', sub.characterCount, '/', sub.characterLimit, '| voice slots', sub.voiceSlotsUsed, '/', sub.voiceLimit, '| can use library voices:', sub.canUseInstantVoiceCloning);
const models = await el.models.list();
for (const m of models) if (/v3|multilingual|flash|turbo/.test(m.modelId)) console.log('MODEL', m.modelId, '| langs', (m.languages || []).length, (m.languages || []).some(l => l.languageId === 'ur') ? 'has ur' : '', (m.languages || []).some(l => l.languageId === 'hi') ? 'has hi' : '', '| timestamps?', m.canDoTextToSpeech);
const mine = await el.voices.search({pageSize: 50});
console.log('MY VOICES', mine.voices.length, mine.voices.slice(0, 30).map(v => `${v.name}[${v.labels?.accent || ''}/${v.labels?.gender || ''}]`).join(', '));
for (const q of [{language: 'ur'}, {language: 'hi', accent: 'pakistani'}, {language: 'hi'}]) {
  const r = await el.voices.getShared({pageSize: 12, ...q, sort: 'usage_character_count_1y'});
  console.log('\nLIBRARY', JSON.stringify(q));
  for (const v of r.voices) console.log(`  ${v.voiceId} | ${v.name} | ${v.gender} ${v.age} ${v.accent} | ${v.language}/${v.locale || ''} | use ${v.usageCharacterCount1Y ?? ''} | free_users_allowed ${v.freeUsersAllowed} | ${(v.description || '').slice(0, 70)}`);
}
