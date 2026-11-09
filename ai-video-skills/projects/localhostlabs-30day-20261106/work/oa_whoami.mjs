const k = process.env.OPENAI_API_KEY || '';
console.log('key type:', k.startsWith('sk-proj-') ? 'project key (sk-proj-…)' : k.startsWith('sk-svcacct-') ? 'service-account key' : k.startsWith('sk-') ? 'legacy user key' : 'unknown', '| ends', k.slice(-4));
const r = await fetch('https://api.openai.com/v1/models', {headers: {Authorization: `Bearer ${k}`}});
console.log('models list:', r.status, '| org header:', r.headers.get('openai-organization'), '| project header:', r.headers.get('openai-project'));
const c = await fetch('https://api.openai.com/v1/chat/completions', {method: 'POST', headers: {Authorization: `Bearer ${k}`, 'Content-Type': 'application/json'},
  body: JSON.stringify({model: 'gpt-4o-mini', messages: [{role: 'user', content: 'Reply with OK'}], max_tokens: 3})});
const j = await c.json();
console.log('tiny chat call:', c.status, j.error ? `${j.error.code}: ${j.error.message.slice(0, 120)}` : 'worked', '| org header:', c.headers.get('openai-organization'), '| project:', c.headers.get('openai-project'));
