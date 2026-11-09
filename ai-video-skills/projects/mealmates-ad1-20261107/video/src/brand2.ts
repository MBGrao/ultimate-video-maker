import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import TL from './timeline2.json';

// MealMates brand (mealmatesapp.com CSS, via the earlier pitch build): orange -> amber, green for savings
export const C = {
  orange: '#f97316',
  orangeDeep: '#ea580c',
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  cream: '#fff7ed',
  creamDeep: '#ffedd5',
  red: '#dc2626',
  logoRed: '#e2382f',
  green: '#10b981',
  greenDeep: '#059669',
  ink: '#111827',
  ink2: '#4b5563',
  white: '#ffffff',
};
export const INTER = loadInter('normal', {weights: ['500', '700', '800', '900'], subsets: ['latin']}).fontFamily;
export const ANTON = loadAnton('normal', {weights: ['400'], subsets: ['latin']}).fontFamily;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = TL.duration;
type Word = {w: string; t0: number; t1: number};
export type Line = {file_start: number; start: number; end: number; ro: string; role: string; scene: string; words: Word[]};
export const LN = TL.lines as Record<string, Line>;
export const SCENES = TL.scenes as {id: string; start: number; end: number}[];
export const SC = Object.fromEntries(SCENES.map((s) => [s.id, s])) as Record<string, {id: string; start: number; end: number}>;
export const EV = TL.events as Record<string, number>;
export const MOUTH = TL.mouth as Record<string, {start: number; v: number[]}>;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export const wt = (k: string, w: string) => {
  const hits = LN[k].words.filter((x) => norm(x.w).startsWith(norm(w)));
  return hits.length ? hits[0].t0 : LN[k].start;
};
/** pizza mouth openness 0..1 at time t, from the voice's loudness */
export const mouthAt = (t: number) => {
  for (const m of Object.values(MOUTH)) {
    const i = Math.floor((t - m.start) * 30);
    if (i >= 0 && i < m.v.length) return m.v[i];
  }
  return 0;
};

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const L = (a: number, b: number, p: number) => a + (b - a) * p;
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const eo5 = (x: number) => 1 - Math.pow(1 - x, 5);
export const ei = (x: number) => x * x * x;
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const spr = (t: number, t0: number, k = 12, d = 7) => {
  const x = t - t0;
  return x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(k * x);
};
export const pop = (t: number, at: number, rot = 0, from = 0.5): React.CSSProperties => ({
  opacity: clamp((t - at) / 0.08),
  transform: `scale(${L(from, 1, clamp(spr(t, at), 0, 1.3))}) rotate(${rot}deg)`,
});
