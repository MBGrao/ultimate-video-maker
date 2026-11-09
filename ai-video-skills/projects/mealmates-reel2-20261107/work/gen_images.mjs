// OpenAI photoreal "romance trailer" stills for MealMates reel 2. Refs first, then scenes edited from the refs.
import OpenAI, {toFile} from 'openai';
import fs from 'node:fs';
const oa = new OpenAI(); const OUT = '../video/public/img';
const M = ['gpt-image-2.6-sunburst', 'gpt-image-1.5'];
const FILM = 'Photorealistic cinematic film still, anamorphic lens, shallow depth of field, warm tungsten restaurant light with soft bokeh, subtle film grain, romantic-comedy movie look, shot on 35mm. Modern Lahore, Pakistan. No text, no letters, no logos, no watermarks.';
const AY = 'Ayesha: a 24-year-old Pakistani woman, long dark wavy hair, expressive eyes, wearing a cream short kurta over jeans with small gold earrings';
const ZN = 'Zain: a 25-year-old Pakistani man, short neat dark hair, light stubble, wearing a denim jacket over a white t-shirt';
const REFS = {ref_ayesha: `Portrait character reference of ${AY}, waist up, friendly natural smile, plain warm-grey studio background. ${FILM}`, ref_zain: `Portrait character reference of ${ZN}, waist up, friendly natural smile, plain warm-grey studio background. ${FILM}`};
const SCENES = {
  r1_room: [['ref_ayesha', 'ref_zain'], `Wide shot of a busy, cosy restaurant at night: Ayesha (first reference) sits alone at a table on the left, Zain (second reference) sits alone at a table on the right across the room, both holding menus and glancing at each other, other diners softly blurred between them, fairy lights, slow-motion romantic mood. Vertical 9:16 composition. ${FILM}`],
  r2_ayesha: [['ref_ayesha'], `Close-up of Ayesha (reference) at her restaurant table, looking across the room over the top of her menu with a soft, hopeful smile, a strand of hair in front of her face, golden bokeh behind. Vertical composition. ${FILM}`],
  r3_zain: [['ref_zain'], `Close-up of Zain (reference) at his restaurant table, looking back across the room with a nervous, smitten half-smile, holding a menu, warm bokeh behind. Vertical composition. ${FILM}`],
  r4_menu: [['ref_ayesha'], `Over-the-shoulder shot from behind Ayesha (reference) as she lowers her menu: the open menu page shows a big glossy photo of a pepperoni pizza with fries and two drinks, and a large EMPTY blank cream-colored banner area above the photo (no writing). Restaurant bokeh beyond. Vertical composition. ${FILM}`],
  r5_table: [['ref_ayesha', 'ref_zain'], `Ayesha (first reference) and Zain (second reference) now sitting at the same table as friendly new acquaintances, laughing, a large pepperoni pizza and a basket of fries between them, Zain reaching for fries while Ayesha playfully guards half of them with her hand, warm friendly mood (not romantic). Vertical composition. ${FILM}`],
};
async function save(n, b) { fs.writeFileSync(`${OUT}/${n}.png`, Buffer.from(b, 'base64')); console.log('ok', n); }
const [mode] = process.argv.slice(2);
if (mode === 'refs') await Promise.all(Object.entries(REFS).map(async ([n, p]) => { for (const m of M) { try { const r = await oa.images.generate({model: m, prompt: p, size: '1024x1536', quality: 'high', output_format: 'png'}); return save(n, r.data[0].b64_json); } catch (e) { console.log('retry', n, m, String(e.message).slice(0, 120)); } } }));
else await Promise.all(Object.entries(SCENES).map(async ([n, [refs, p]]) => {
  const imgs = await Promise.all(refs.map((r) => toFile(fs.createReadStream(`${OUT}/${r}.png`), `${r}.png`, {type: 'image/png'})));
  for (const m of M) { try { const r = await oa.images.edit({model: m, image: imgs, prompt: p, size: '1024x1536', quality: 'high'}); return save(n, r.data[0].b64_json); } catch (e) { console.log('retry', n, m, String(e.message).slice(0, 160)); } }
}));
