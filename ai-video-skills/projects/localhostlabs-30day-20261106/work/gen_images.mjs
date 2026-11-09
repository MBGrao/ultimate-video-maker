// OpenAI image generation for the reels. Key comes from OPENAI_API_KEY (node --env-file=.env), never from code.
import OpenAI from 'openai';
import fs from 'node:fs';
const oa = new OpenAI();
const OUT = '../video/public/img'; fs.mkdirSync(OUT, {recursive: true});
const MODELS = ['gpt-image-2.6-sunburst', 'gpt-image-2.5-sunburst', 'gpt-image-2', 'gpt-image-1.5'];
const CLAY = 'Premium 3D render in a soft clay / Pixar style, matte materials, soft studio lighting with gentle shadow, Apple-keynote minimal, warm cream and white tones with red-orange (#FF4D2E) and green (#00C27A) accents. Centered single subject, generous empty space around it, no text, no logos, no letters.';
const RISO = 'Retro editorial risograph print illustration, exactly two inks: red-orange (#FF4D2E) and near-black, on warm cream paper (#F3EFE4), visible halftone dots and slight ink misregistration, bold simple shapes, mid-century magazine style. No text, no letters, no logos.';
const JOBS = [
  ['pk_confused', '1024x1024', true, `A friendly middle-aged Pakistani shopkeeper uncle in a white shalwar kameez and dark waistcoat, neat mustache, scratching his head with a puzzled expression, three small floating question marks above him, full body standing. ${CLAY}`],
  ['pk_shop', '1024x1024', true, `A miniature traditional Pakistani mithai sweet shop storefront: glass counter with colourful sweets (jalebi, gulab jamun, barfi), red-orange striped awning, small hanging lantern, isometric 3/4 view. ${CLAY}`],
  ['pk_bike', '1024x1024', true, `A cute miniature Pakistani-style 70cc delivery motorbike with a red-orange delivery box on the back seat, three-quarter view. ${CLAY}`],
  ['pk_munshi', '1024x1024', true, `An elderly munshi accountant with round glasses and a cap, sitting at a small wooden desk writing in a red cloth-bound ledger (bahi khata), a few stacked cartons behind him, three-quarter view. ${CLAY}`],
  ['en_confused', '1024x1024', true, `A friendly young coffee shop owner in a canvas apron, puzzled, hand on chin, three small floating question marks above her head, full body standing. ${CLAY}`],
  ['en_store', '1024x1024', true, `A miniature cute coffee shop storefront with a green (#00C27A) awning, big window, a blank chalkboard A-frame sign, potted plant, isometric 3/4 view. ${CLAY}`],
  ['en_card', '1024x1024', true, `A smartphone showing a coffee loyalty stamp card with small coffee-cup stamps, standing next to a matching physical paper loyalty card and a coffee cup, three-quarter view. ${CLAY}`],
  ['en_office', '1024x1024', true, `A miniature back office: small desk with an open laptop showing simple bar charts, stacked coffee bean sacks and cardboard boxes, a clipboard, three-quarter view. ${CLAY}`],
  ['d2_gone', '1024x1536', false, `Seen from behind: a software developer with a backpack walking out through an open doorway into bright light, carrying a giant old-fashioned key over his shoulder and a laptop under his arm. A dramatic long shadow on the floor. ${RISO}`],
  ['d2_rent', '1024x1024', false, `A small neat shop-house building with a large blank hanging sign board on its door (the sign is empty), a man seen from behind standing outside looking up at it, hands on hips. ${RISO}`],
  ['d2_keys', '1024x1024', false, `Three large vintage skeleton keys hanging together on a single brass ring, slightly fanned out, centred, lots of empty paper around them. ${RISO}`],
];
const only = process.argv[2];
let model = null;
async function gen(name, size, transparent, prompt) {
  for (const m of model ? [model] : MODELS) {
    for (const bg of transparent ? ['transparent', null] : [null]) {
      try {
        const r = await oa.images.generate({model: m, prompt: bg ? prompt : prompt.replace('Centered single subject', 'Centered single subject on a plain pure white background'), size, quality: 'high', n: 1, ...(bg ? {background: 'transparent', output_format: 'png'} : {output_format: 'png'})});
        fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.data[0].b64_json, 'base64'));
        model = m; console.log('ok', name, m, bg || 'opaque'); return;
      } catch (e) { console.log('retry', name, m, bg, String(e.message || e).slice(0, 140)); }
    }
  }
  console.log('FAILED', name);
}
// first job alone to settle the model, then the rest 3 at a time
const jobs = JOBS.filter((j) => !only || j[0] === only);
await gen(...jobs[0]);
for (let i = 1; i < jobs.length; i += 3) await Promise.all(jobs.slice(i, i + 3).map((j) => gen(...j)));
