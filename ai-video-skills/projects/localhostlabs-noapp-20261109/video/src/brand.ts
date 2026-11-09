import React from 'react';
import {getInputProps} from 'remotion';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadSerif} from '@remotion/google-fonts/InstrumentSerif';
import {loadFont as loadSans} from '@remotion/google-fonts/InstrumentSans';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadHand} from '@remotion/google-fonts/Caveat';
import EN from './timeline.json';
import HI from './timeline_hi.json';

// one design, two voices: --props='{"lang":"hi"}' renders the Hindi cut
export const LANG = ((getInputProps() as {lang?: string}).lang ?? 'en') as 'en' | 'hi';
const TL = (LANG === 'hi' ? HI : EN) as typeof EN;

// localhostlabs brand kit (same as the 30-day reels)
export const C = {
  page: '#f4f1ea',
  paper: '#efe9dc',
  white: '#ffffff',
  ink: '#111111',
  ink2: '#4a4741',
  ink3: '#8d887d',
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
  wa: '#075e54',
  marker: '#1b1c1f',
};

export const HEAD = loadInterTight('normal', {weights: ['600', '800', '900'], subsets: ['latin']}).fontFamily;
export const SERIF = loadSerif('italic', {weights: ['400'], subsets: ['latin']}).fontFamily;
export const SANS = loadSans('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;
export const MONO = loadMono('normal', {weights: ['500', '700', '800'], subsets: ['latin']}).fontFamily;
export const HAND = loadHand('normal', {weights: ['600', '700'], subsets: ['latin']}).fontFamily;

export const FPS = 30;
export const W = 1080;
export const H = 1920;

export type Word = {w: string; t0: number; t1: number};
export type Line = {start: number; end: number; ro: string; words: Word[]};
export type Scene = {id: string; start: number; end: number};
export const LN = TL.lines as unknown as Record<string, Line>;
export const EV = TL.events as unknown as Record<string, number>;
export const SCENES = TL.scenes as Scene[];
export const SC = Object.fromEntries(SCENES.map((s) => [s.id, s])) as Record<string, Scene>;
export const DURATION = TL.duration;

// --- pure timing helpers (every frame is a function of t) ---
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
export const pop = (t: number, at: number, rot = 0, from = 0.5): React.CSSProperties => ({opacity: clamp((t - at) / 0.08), transform: `scale(${L(from, 1, clamp(spr(t, at), 0, 1.3))}) rotate(${rot}deg)`});

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** start time of a spoken word in line k (nth match) */
export const wt = (k: string, w: string, nth = 0) => {
  const hits = LN[k].words.filter((x) => norm(x.w).startsWith(norm(w)));
  return hits.length ? hits[Math.min(nth, hits.length - 1)].t0 : LN[k].start;
};
