import {loadFont as loadBricolage} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadSans} from '@remotion/google-fonts/InstrumentSans';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import TL from './timeline.json';

// Brand tokens measured from localhostlabs.tech CSS (light theme + dark "how we work" section)
export const C = {
  page: '#f3efe4',
  paper: '#ece7da',
  paper2: '#e4dfd1',
  card: '#faf7ef',
  ink: '#1b1914',
  ink2: '#5c574c',
  ink3: '#8e887c',
  line: 'rgba(27,25,20,.14)',
  line2: 'rgba(27,25,20,.07)',
  acc: '#f24d18',
  acc2: '#ff7245',
  accInk: '#c43710',
  accDeep: '#241910',
  dark: '#12110e',
  dark2: '#1c1a15',
  darkInk: '#f4f0e6',
  darkInk2: '#b9b3a6',
  darkLine: 'rgba(244,240,230,.14)',
  lime: '#cff55a',
  limeDeep: '#1c2700',
  ok: '#22a35a',
  wa: '#d9fdd3',
  waDark: '#075e54',
  sticky: '#ffe27a',
  ig: '#0095f6',
};

export const DISPLAY = loadBricolage('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']}).fontFamily;
export const SERIF = loadSerif('italic', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const SANS = loadSans('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['500', '700'], subsets: ['latin']}).fontFamily;

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const DURATION = TL.duration;
export const MUSIC_OFFSET = TL.musicOffset;

type Word = {w: string; t0: number; t1: number};
type Line = {start: number; end: number; ro: string; scene: string; words: Word[]};
export const LN = TL.lines as Record<string, Line>;
export const SCENES = TL.scenes as {id: string; start: number; end: number}[];
export const SC = Object.fromEntries(SCENES.map((s) => [s.id, s])) as Record<string, {id: string; start: number; end: number}>;
export const BEATS = TL.beats as number[];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** start time of a spoken word in line k (by index, or the first word that starts with the given text) */
export const wt = (k: string, w: string | number, nth = 0): number => {
  const L = LN[k];
  if (typeof w === 'number') return L.words[w].t0;
  const hits = L.words.filter((x) => norm(x.w).startsWith(norm(w)));
  return hits.length ? hits[Math.min(nth, hits.length - 1)].t0 : L.start;
};

// --- pure timing helpers (every frame is a function of t) ---
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const L = (a: number, b: number, p: number) => a + (b - a) * p;
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const eo5 = (x: number) => 1 - Math.pow(1 - x, 5);
export const ei = (x: number) => x * x * x;
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** back-out pop: overshoot then settle */
export const eb = (x: number, s = 1.9) => {
  const c3 = s + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
};
/** damped spring 0->1 starting at t0 */
export const spr = (t: number, t0: number, k = 9, d = 5.5) => {
  const x = t - t0;
  if (x <= 0) return 0;
  return 1 - Math.exp(-d * x) * Math.cos(k * x);
};
/** enter (a..a+din) then exit (b..b+dout) envelope */
export const env = (t: number, a: number, b: number, din = 0.3, dout = 0.25) => Math.min(eo(P(t, a, a + din)), 1 - ei(P(t, b, b + dout)));
