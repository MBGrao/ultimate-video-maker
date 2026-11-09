// usage: node stills.mjs <vid> [t1 t2 ...]   (no times = one settled still per scene)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const IDS = {d1_pk: 'Day01-PK-WebsiteAppSoftware', d1_en: 'Day01-EN-WebsiteAppSoftware', d2_pk: 'Day02-PK-WhoOwnsYourCode', d2_en: 'Day02-EN-WhoOwnsYourCode'};
const BROWSER = '/Users/mbgrao/Desktop/brag/ai-video-skills/_browsers/chrome-headless-shell-149/chrome-headless-shell';
const [vid, ...ts] = process.argv.slice(2);
const TL = JSON.parse(fs.readFileSync('src/timelines.json', 'utf8'))[vid];
const times = ts.length ? ts.map(Number) : TL.scenes.map((s) => Math.max(s.start + 0.8, s.end - 0.45));
let serveUrl = 'build';
if (!fs.existsSync('build/index.html') || process.env.REBUNDLE) serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: path.resolve('build'), rspack: true});
const comp = await selectComposition({serveUrl, id: IDS[vid], inputProps: {vid}, browserExecutable: BROWSER});
fs.mkdirSync(`out/stills/${vid}`, {recursive: true});
for (const t of times) {
  await renderStill({composition: comp, serveUrl, frame: Math.min(comp.durationInFrames - 1, Math.round(t * 30)), inputProps: {vid}, output: `out/stills/${vid}/s_${t.toFixed(2)}.png`, browserExecutable: BROWSER, scale: 0.4, imageFormat: 'png'});
}
console.log(vid, 'stills', times.map((x) => x.toFixed(1)).join(' '));
