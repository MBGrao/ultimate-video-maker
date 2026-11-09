import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const times = process.argv.slice(2).map(Number);
const BROWSER = '/Users/mbgrao/Desktop/brag/ai-video-skills/_browsers/chrome-headless-shell-149/chrome-headless-shell';
let serveUrl = 'build';
if (!fs.existsSync('build/index.html') || process.env.REBUNDLE) {
  serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), outDir: path.resolve('build'), enableCaching: true, rspack: true});
}
const comp = await selectComposition({serveUrl, id: 'LocalhostLabsReel', browserExecutable: BROWSER});
fs.mkdirSync('out/stills', {recursive: true});
for (const t of times) {
  const frame = Math.min(comp.durationInFrames - 1, Math.round(t * 30));
  await renderStill({composition: comp, serveUrl, frame, output: `out/stills/s_${t.toFixed(2)}.png`, browserExecutable: BROWSER, scale: 0.5, imageFormat: 'png'});
  console.log('still', t);
}
