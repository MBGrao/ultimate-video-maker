// OpenAI: overhead desk with a blank page (question 3 + CTA) and a marker pen cut-out that follows the handwriting.
import OpenAI from 'openai';
import fs from 'node:fs';
const oa = new OpenAI(); const OUT = '../video/public/img';
const save = (n, b) => { fs.writeFileSync(`${OUT}/${n}.png`, Buffer.from(b, 'base64')); console.log('ok', n); };
const jobs = [
  ['desk', {size: '1024x1536', prompt: 'Top-down overhead photograph of a single blank white A4 sheet of paper lying straight and centered on a warm light-oak wooden desk, filling most of the frame. A sticky note and the corner of a laptop at the top edge, a coffee cup partly visible at the bottom-right corner. Soft natural window light from the left with gentle shadows, photorealistic, crisp detail, calm workspace of a small software studio. The paper is completely blank. No text, no letters, no logos, no hands.'}, ['gpt-image-2.6-sunburst', 'gpt-image-1.5']],
  ['pen', {size: '1024x1024', background: 'transparent', prompt: 'A single black felt-tip marker pen without cap, photographed from directly above, lying diagonally with the writing tip pointing to the bottom-left corner, realistic, soft shadow, isolated cut-out on a fully transparent background. No text or logos.'}, ['gpt-image-1.5']],
];
await Promise.all(jobs.map(async ([n, p, models]) => {
  for (const m of models) { try { const r = await oa.images.generate({model: m, quality: 'high', output_format: 'png', ...p}); return save(n, r.data[0].b64_json); } catch (e) { console.log('retry', n, m, String(e.message).slice(0, 160)); } }
}));
