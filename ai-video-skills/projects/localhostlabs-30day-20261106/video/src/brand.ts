import {createContext, useContext} from 'react';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadSans} from '@remotion/google-fonts/InstrumentSans';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import TLS from './timelines.json';

// Brand kit from LOCALHOSTLABS-30-DAY-PLAN.md §1 (+ the site's cream/ink)
export const C = {
  page: '#f4f1ea',
  paper: '#efe9dc',
  white: '#ffffff',
  ink: '#111111',
  ink2: '#4a4741',
  ink3: '#8d887d',
  line: 'rgba(17,17,17,.10)',
  line2: 'rgba(17,17,17,.055)',
  green: '#00c27a',
  greenDeep: '#007a4d',
  greenTint: '#e3f7ee',
  red: '#ff4d2e',
  redDeep: '#c2321a',
  redTint: '#ffe6df',
  term: '#0e0f0d',
  term2: '#171915',
  termInk: '#e9f2ea',
  termDim: '#8a9a8f',
  wa: '#25d366',
  ig: '#0095f6',
};

export const HEAD = loadInterTight('normal', {weights: ['600', '800', '900'], subsets: ['latin']}).fontFamily;
export const SERIF = loadSerif('italic', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const SANS = loadSans('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['500', '700', '800'], subsets: ['latin']}).fontFamily;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export type Word = {w: string; t0: number; t1: number};
export type Line = {start: number; end: number; ro: string; scene: string; words: Word[]};
export type Scene = {id: string; start: number; end: number};
export type TL = {duration: number; musicOffset: number; track: string; lang: 'ur' | 'en'; series: string; scenes: Scene[]; lines: Record<string, Line>};
export const TIMELINES = TLS as unknown as Record<string, TL>;

// --- pure timing helpers (every frame is a function of t) ---
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const P = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const L = (a: number, b: number, p: number) => a + (b - a) * p;
export const eo = (x: number) => 1 - Math.pow(1 - x, 3);
export const eo5 = (x: number) => 1 - Math.pow(1 - x, 5);
export const ei = (x: number) => x * x * x;
export const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const eb = (x: number, s = 1.9) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
export const spr = (t: number, t0: number, k = 11, d = 7) => {
  const x = t - t0;
  return x <= 0 ? 0 : 1 - Math.exp(-d * x) * Math.cos(k * x);
};

// --- per-video context: the current time + that video's timeline ---
export type V = {t: number; vid: string; tl: TL; pk: boolean; wt: (k: string, w: string | number, nth?: number) => number; ln: (k: string) => Line; sc: (id: string) => Scene};
export const VCtx = createContext<V | null>(null);
export const useV = () => useContext(VCtx)!;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
export const makeV = (vid: string, t: number): V => {
  const tl = TIMELINES[vid];
  const ln = (k: string) => tl.lines[k];
  const wt = (k: string, w: string | number, nth = 0) => {
    const Lk = tl.lines[k];
    if (!Lk) return 999;
    if (typeof w === 'number') return Lk.words[Math.min(w, Lk.words.length - 1)].t0;
    const hits = Lk.words.filter((x) => norm(x.w).startsWith(norm(w)));
    return hits.length ? hits[Math.min(nth, hits.length - 1)].t0 : Lk.start;
  };
  const sc = (id: string) => tl.scenes.find((s) => s.id === id) ?? {id, start: 999, end: 999};
  return {t, vid, tl, pk: tl.lang === 'ur', wt, ln, sc};
};
