import OpenAI from 'openai';
const ids = []; for await (const m of new OpenAI().models.list()) ids.push(m.id);
console.log(ids.filter((i) => /image|dall|sora|gpt-5|gpt-4o|tts|transcribe/.test(i)).sort().join('\n'));
