// OpenAI images for MealMates Ad 1. Characters first (refs), then scenes edited from the refs so the cast stays consistent.
// run: env -u OPENAI_API_KEY node --env-file=/Users/mbgrao/Desktop/brag/.env gen_images.mjs [refs|scenes] [name]
import OpenAI, {toFile} from 'openai';
import fs from 'node:fs';
const oa = new OpenAI();
const OUT = '../video/public/img'; fs.mkdirSync(OUT, {recursive: true});
const MODEL = 'gpt-image-2.6-sunburst', FALLBACK = 'gpt-image-1.5';
const STYLE = 'Premium 3D animated feature-film still (Pixar / Disney style), expressive comedic acting, cinematic lighting, shallow depth of field, warm grade with orange and amber accents, set in Lahore, Pakistan. No text, no letters, no logos, no watermarks.';
const BOY = 'Hamza: a lanky 22-year-old Pakistani guy, messy black hair, light stubble, big expressive eyes, wearing an orange hoodie, dark jeans and white sneakers';
const BILAL = 'Bilal: a cheerful chubby 24-year-old Pakistani guy with round glasses, short beard and a mustard-yellow t-shirt';
const REFS = {
  ref_boy: [`Character turnaround reference of ${BOY}, standing, full body, front view, neutral friendly expression, plain light-grey studio background. ${STYLE}`, '1024x1536'],
  ref_bilal: [`Character reference of ${BILAL}, standing, full body, front view, big friendly smile, plain light-grey studio background. ${STYLE}`, '1024x1536'],
};
const SCENES = {
  s1_menu: [['ref_boy'], `Night street outside a cosy pizza restaurant in Lahore. Hamza (the guy in the reference, orange hoodie) stands alone in the foreground, seen from the side, staring up dramatically at a huge illuminated menu board on the restaurant wall. The menu board shows a big pizza photo and one large EMPTY blank yellow panel (no writing). Moody neon, steam from the restaurant. Vertical composition, board in the upper half. ${STYLE}`],
  s2_pizza: [[], `Close-up of a large glossy pepperoni pizza photo on a restaurant menu board, the pizza has two big expressive cartoon eyes with eyebrows raised in a sassy look, and NO mouth (leave the lower-middle of the pizza plain cheese). Centered, warm light. ${STYLE}`],
  s3_waiter: [[], `Inside a busy pizza restaurant, a smug waiter in a black apron and bow tie wags one finger "no" straight at the camera with a cheeky smile, eyebrows raised. Vertical composition, waiter centered. ${STYLE}`],
  s4_cat: [[], `A chubby orange street cat on a restaurant doorstep in Lahore sprinting away from the camera in panic, legs a blur, one ear flipped, comedic motion, dust puff behind it. Vertical composition. ${STYLE}`],
  s5_mirror: [['ref_boy'], `Hamza (the guy in the reference, orange hoodie) in a small restaurant washroom, pointing hopefully at his own reflection in the mirror with a pleading face, his reflection looks back unimpressed with arms crossed. Vertical composition. ${STYLE}`],
  s6_boycall: [['ref_boy'], `Hamza (the guy in the reference, orange hoodie) holding a phone to his ear with a huge hopeful grin, standing on a Lahore street at night, warm shop lights behind. Vertical composition, waist up. ${STYLE}`],
  s6_ammi: [[], `A strict middle-aged Pakistani mother (Ammi) in a printed cotton shalwar kameez with a dupatta over her shoulders, standing in a home kitchen holding a phone to her ear, one eyebrow raised, unimpressed, a rolling pin in her other hand. Vertical composition, waist up. ${STYLE}`],
  s7_bench: [['ref_boy'], `Hamza (the guy in the reference, orange hoodie) collapsed dramatically on a park bench at night in light rain, slumped sideways with arms hanging, staring at the sky in tragic despair, a single street lamp lighting him like a sad movie scene. Vertical composition. ${STYLE}`],
  s8_table: [['ref_boy', 'ref_bilal'], `Hamza (the guy in the orange hoodie from the first reference) and Bilal (the guy with round glasses and mustard t-shirt from the second reference) sitting together at a restaurant table, laughing and each lifting a slice from one big shared pepperoni pizza with stretchy cheese, warm cosy restaurant. Vertical composition, both faces visible. ${STYLE}`],
};
const [mode = 'refs', only] = process.argv.slice(2);
async function save(name, b64) { fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(b64, 'base64')); console.log('ok', name); }
async function gen(name, prompt, size) {
  for (const m of [MODEL, FALLBACK]) {
    try { const r = await oa.images.generate({model: m, prompt, size, quality: 'high', n: 1, output_format: 'png'}); return save(name, r.data[0].b64_json); }
    catch (e) { console.log('retry', name, m, String(e.message || e).slice(0, 160)); }
  }
}
async function edit(name, refs, prompt) {
  if (!refs.length) return gen(name, prompt, '1024x1536');
  const imgs = await Promise.all(refs.map((r) => toFile(fs.createReadStream(`${OUT}/${r}.png`), `${r}.png`, {type: 'image/png'})));
  for (const m of [MODEL, FALLBACK]) {
    try { const r = await oa.images.edit({model: m, image: imgs, prompt, size: '1024x1536', quality: 'high'}); return save(name, r.data[0].b64_json); }
    catch (e) { console.log('retry-edit', name, m, String(e.message || e).slice(0, 200)); }
  }
}
if (mode === 'refs') await Promise.all(Object.entries(REFS).filter(([k]) => !only || k === only).map(([k, [p, s]]) => gen(k, p, s)));
else { const jobs = Object.entries(SCENES).filter(([k]) => !only || k === only); for (let i = 0; i < jobs.length; i += 3) await Promise.all(jobs.slice(i, i + 3).map(([k, [refs, p]]) => edit(k, refs, p))); }
