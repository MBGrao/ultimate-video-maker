import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, HEAD, L, MONO, P, SANS, SERIF, W, clamp, eb, ei, eio, eo, eo5, spr, useV} from './brand';

export type Look = 'grid' | 'paper' | 'term' | 'red';

// ---------------- backgrounds ----------------
export const Bg: React.FC<{look: Look}> = ({look}) => {
  const {t} = useV();
  if (look === 'term')
    return (
      <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 900px 800px at 50% 45%, #1b2019 0%, ${C.term} 70%)`}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(233,242,234,.13) 1.6px, transparent 2.2px)', backgroundSize: '34px 34px'}} />
      </div>
    );
  if (look === 'red') return <div style={{position: 'absolute', inset: 0, background: C.red}} />;
  if (look === 'paper') {
    // retro editorial paper: warm stock, halftone corners, faint grain that shifts every few frames
    const seed = Math.floor(t * 6) % 3;
    return (
      <div style={{position: 'absolute', inset: 0, background: C.paper}}>
        <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(255,77,46,.55) 2.2px, transparent 2.6px)`, backgroundSize: '18px 18px', WebkitMaskImage: 'radial-gradient(ellipse 620px 520px at 105% -5%, #000 0%, transparent 70%)', maskImage: 'radial-gradient(ellipse 620px 520px at 105% -5%, #000 0%, transparent 70%)'}} />
        <div style={{position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, rgba(17,17,17,.38) 2px, transparent 2.5px)`, backgroundSize: '16px 16px', WebkitMaskImage: 'radial-gradient(ellipse 600px 520px at -8% 104%, #000 0%, transparent 70%)', maskImage: 'radial-gradient(ellipse 600px 520px at -8% 104%, #000 0%, transparent 70%)'}} />
        <div style={{position: 'absolute', inset: 0, opacity: 0.22, mixBlendMode: 'multiply', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .1  0 0 0 0 .08  0 0 0 0 .05  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`}} />
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0, background: C.page}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.line2} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.line2} 1.5px, transparent 1.5px)`, backgroundSize: '72px 72px', backgroundPosition: '-1px -1px'}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1100px 900px at 50% 40%, rgba(255,255,255,.55), transparent 70%)'}} />
    </div>
  );
};

// ---------------- brand ----------------
export const Mark: React.FC<{size: number; bg?: string; fg?: string}> = ({size, bg = C.red, fg = '#241910'}) => (
  <div style={{width: size, height: size, background: bg, color: fg, transform: 'rotate(-8deg)', display: 'grid', placeItems: 'center', fontFamily: MONO, fontWeight: 800, fontSize: size * 0.53, letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0}}>ll</div>
);
export const Logo: React.FC<{size?: number; ink?: string}> = ({size = 44, ink = C.ink}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.32}}>
    <Mark size={size} />
    <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: size * 0.7, letterSpacing: '-0.04em', color: ink, lineHeight: 1}}>
      localhost <span style={{fontFamily: SERIF, fontWeight: 400, fontSize: size * 0.82, letterSpacing: '-0.01em'}}>labs</span>
    </div>
  </div>
);

/** terminal series label "> explain()" with a blinking block cursor */
export const SeriesLabel: React.FC<{label: string; alarm?: boolean}> = ({label, alarm}) => {
  const {t} = useV();
  const typed = Math.floor(clamp((t - 0.05) / 0.5) * label.length);
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, background: C.term, borderRadius: 14, padding: '12px 20px 12px 16px', boxShadow: '0 10px 24px -14px rgba(0,0,0,.6)'}}>
      {alarm ? <span style={{width: 14, height: 14, borderRadius: 99, background: C.red, opacity: blink ? 1 : 0.35, boxShadow: `0 0 12px ${C.red}`}} /> : null}
      <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: alarm ? C.red : C.green, whiteSpace: 'pre'}}>
        {label.slice(0, typed)}
      </span>
      <span style={{width: 16, height: 32, background: alarm ? C.red : C.green, opacity: blink ? 1 : 0}} />
    </div>
  );
};

export const TopBar: React.FC<{dark?: boolean}> = ({dark}) => {
  const {tl} = useV();
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 146, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <SeriesLabel label={tl.series} alarm={tl.series.includes('scam')} />
      <Logo size={42} ink={dark ? C.termInk : C.ink} />
    </div>
  );
};

// ---------------- karaoke subtitle pill ----------------
export const Captions: React.FC<{hidden?: boolean}> = ({hidden}) => {
  const {t, tl} = useV();
  const k = Object.keys(tl.lines).find((key) => t >= tl.lines[key].start - 0.06 && t < tl.lines[key].end + 0.3);
  if (!k || hidden) return null;
  const line = tl.lines[k];
  const a = eo(P(t, line.start - 0.06, line.start + 0.12)) * (1 - ei(P(t, line.end + 0.16, line.end + 0.3)));
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1436, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{background: 'rgba(17,17,17,.93)', borderRadius: 30, padding: '18px 32px 21px', maxWidth: 920, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.22, color: '#fff', transform: `translateY(${(1 - a) * 14}px)`, boxShadow: '0 18px 40px -20px rgba(0,0,0,.6)', border: '2px solid rgba(255,255,255,.08)'}}>
        {line.words.map((w, i) => {
          const on = t >= w.t0 - 0.02;
          const cur = on && t < w.t1 + 0.04;
          return (
            <span key={i} style={{color: cur ? C.green : on ? '#fff' : 'rgba(255,255,255,.38)'}}>
              {w.w}
              {i < line.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- text ----------------
export const Rise: React.FC<{at: number; out?: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, out, dur = 0.42, children, style}) => {
  const {t} = useV();
  const p = eo5(P(t, at, at + dur));
  const q = out === undefined ? 0 : ei(P(t, out, out + 0.22));
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 108 - q * 108}%)`, opacity: p > 0 ? 1 : 0}}>{children}</div>
    </div>
  );
};
export const Head: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = C.ink, children, style}) => (
  <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 0.92, letterSpacing: '-0.045em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
export const Em: React.FC<{color?: string; children: React.ReactNode; scale?: number}> = ({color = C.red, children, scale = 1.15}) => (
  <span style={{fontFamily: SERIF, fontWeight: 400, textTransform: 'none', letterSpacing: '-0.01em', color, fontSize: `${scale}em`, lineHeight: 0.7}}>{children}</span>
);
export const Mono: React.FC<{size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size = 28, color = C.ink2, children, style}) => (
  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: size, letterSpacing: '0.08em', textTransform: 'uppercase', color, ...style}}>{children}</div>
);

// ---------------- motion helpers ----------------
export const popStyle = (t: number, at: number, rot = 0, from = 0.55): React.CSSProperties => {
  const p = clamp(spr(t, at), 0, 1.25);
  return {opacity: clamp((t - at) / 0.12), transform: `scale(${L(from, 1, p)}) rotate(${rot}deg)`};
};
export const outStyle = (t: number, a: number, d = 0.24): React.CSSProperties => {
  const q = ei(P(t, a, a + d));
  return {opacity: 1 - q, transform: `translateY(${-q * 50}px)`};
};
export const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);

/** { } sparkle: the brand's code-brace twinkle */
export const Braces: React.FC<{x: number; y: number; size?: number; at: number; color?: string; rot?: number}> = ({x, y, size = 64, at, color = C.red, rot = -10}) => {
  const {t} = useV();
  const p = eb(P(t, at, at + 0.45));
  const tw = 1 + 0.07 * Math.sin((t - at) * 4.5);
  return (
    <div style={{position: 'absolute', left: x - size, top: y - size * 0.6, fontFamily: MONO, fontWeight: 800, fontSize: size, color, transform: `scale(${p * tw}) rotate(${rot}deg)`, opacity: p > 0 ? 1 : 0, letterSpacing: '-0.05em'}}>
      {'{ }'}
    </div>
  );
};
export const Spark: React.FC<{x: number; y: number; size: number; at: number; color?: string}> = ({x, y, size, at, color = C.red}) => {
  const {t} = useV();
  const p = eb(P(t, at, at + 0.45));
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${p * (1 + 0.08 * Math.sin((t - at) * 5))}) rotate(${(t - at) * 30}deg)`, opacity: p > 0 ? 1 : 0}}>
      <path d="M0 -50 C 6 -10 10 -6 50 0 C 10 6 6 10 0 50 C -6 10 -10 6 -50 0 C -10 -6 -6 -10 0 -50 Z" fill={color} />
    </svg>
  );
};

export const Stamp: React.FC<{at: number; children: React.ReactNode; color?: string; bg?: string; rot?: number; size?: number}> = ({at, children, color = C.red, bg = 'transparent', rot = -8, size = 96}) => {
  const {t} = useV();
  const p = P(t, at, at + 0.2);
  if (p <= 0) return null;
  return (
    <div style={{display: 'inline-block', border: `${size * 0.075}px solid ${color}`, color, background: bg, fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1, padding: `${size * 0.12}px ${size * 0.24}px ${size * 0.14}px`, letterSpacing: '-0.03em', textTransform: 'uppercase', borderRadius: size * 0.14, transform: `rotate(${rot}deg) scale(${L(1.9, 1, eo(p))})`, opacity: clamp(p * 3), whiteSpace: 'nowrap'}}>
      {children}
    </div>
  );
};

export const Tap: React.FC<{at: number; x: number; y: number}> = ({at, x, y}) => {
  const {t} = useV();
  const p = P(t, at - 0.18, at + 0.45);
  if (p <= 0 || p >= 1) return null;
  const press = P(t, at - 0.18, at), ring = P(t, at, at + 0.45);
  return (
    <>
      <div style={{position: 'absolute', left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 99, background: 'rgba(255,255,255,.8)', border: '3px solid rgba(17,17,17,.45)', transform: `scale(${L(1.3, 0.85, eo(press)) * (1 - 0.3 * ring)})`, opacity: 1 - ring}} />
      <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 99, border: '4px solid rgba(17,17,17,.3)', transform: `scale(${L(0.4, 1.4, eo(ring))})`, opacity: ring > 0 ? 1 - ring : 0}} />
    </>
  );
};

/** white Apple-minimal card */
export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; pad?: number}> = ({children, style, pad = 36}) => (
  <div style={{background: C.white, borderRadius: 44, padding: pad, boxShadow: '0 50px 90px -40px rgba(17,17,17,.35), 0 2px 0 rgba(17,17,17,.04)', border: '1.5px solid rgba(17,17,17,.06)', ...style}}>{children}</div>
);

/** optional generated art: shows public/img/<name>.png when it exists (OpenAI images), else the fallback */
export const Art: React.FC<{name: string; have: string[]; fallback: React.ReactNode; size: number; style?: React.CSSProperties}> = ({name, have, fallback, size, style}) =>
  have.includes(name) ? <Img src={staticFile(`img/${name}.png`)} style={{width: size, height: size, objectFit: 'contain', ...style}} /> : <>{fallback}</>;

// ---------------- line-art icons that draw themselves on ----------------
type Stroke = {d: string; fill?: string; w?: number; color?: string};
export const Icon: React.FC<{strokes: Stroke[]; at: number; size: number; dur?: number; color?: string}> = ({strokes, at, size, dur = 0.9, color = C.ink}) => {
  const {t} = useV();
  const n = strokes.length;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: 'visible'}}>
      {strokes.map((s, i) => {
        const a = at + (i / n) * dur * 0.6;
        const p = eio(P(t, a, a + dur * 0.55));
        const f = eo(P(t, a + dur * 0.35, a + dur * 0.75));
        return (
          <path key={i} d={s.d} fill={s.fill ?? 'none'} fillOpacity={s.fill ? f : 0} stroke={s.color ?? color} strokeWidth={s.w ?? 6.5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        );
      })}
    </svg>
  );
};
const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;
export const ICONS: Record<string, Stroke[]> = {
  // mithai ki dukaan: sign board, striped awning, glass counter with sweets
  shop: [
    {d: 'M58 22 H142 V50 H58 Z', fill: C.greenTint},
    {d: 'M20 56 H180 L168 88 H32 Z', fill: C.red},
    {d: 'M60 56 L56 88 M100 56 V88 M140 56 L144 88', color: '#fff', w: 5},
    {d: 'M34 88 V178 H166 V88'},
    {d: 'M48 116 H152 V178 H48 Z', fill: C.redTint},
    {d: `${circ(68, 140, 10)} ${circ(94, 140, 10)} ${circ(120, 140, 10)}`, fill: '#f7b733'},
    {d: `${circ(80, 162, 9)} ${circ(106, 162, 9)} ${circ(132, 162, 9)}`, fill: C.red},
    {d: 'M14 178 H186'},
  ],
  // delivery bike with a box
  bike: [
    {d: circ(52, 150, 24)},
    {d: circ(150, 150, 24)},
    {d: 'M52 150 L78 112 H124 L150 150'},
    {d: 'M84 104 H122', w: 9},
    {d: 'M138 150 L152 96 L170 90'},
    {d: 'M30 66 H92 V108 H30 Z', fill: C.red},
    {d: 'M44 82 H78', color: '#fff', w: 5},
    {d: 'M178 120 H196 M172 136 H198 M176 104 H190', w: 4, color: C.ink3},
  ],
  // munshi's ledger: open book, glasses, pen
  ledger: [
    {d: 'M100 66 C82 56 48 56 24 64 V166 C48 158 82 158 100 168 C118 158 152 158 176 166 V64 C152 56 118 56 100 66 Z', fill: '#fff'},
    {d: 'M100 66 V168'},
    {d: 'M40 86 H84 M40 104 H84 M40 122 H76 M116 86 H160 M116 104 H160 M116 122 H150', w: 4.5, color: C.ink3},
    {d: `${circ(70, 40, 15)} ${circ(110, 40, 15)} M85 40 H95`, w: 5},
    {d: 'M150 150 L186 104 L194 110 L158 156 L148 160 Z', fill: C.red},
  ],
  // coffee storefront
  store: [
    {d: 'M20 60 H180 L168 92 H32 Z', fill: C.green},
    {d: 'M60 60 L56 92 M100 60 V92 M140 60 L144 92', color: '#fff', w: 5},
    {d: 'M34 92 V178 H166 V92'},
    {d: 'M50 112 H104 V160 H50 Z', fill: '#eaf3ff'},
    {d: 'M120 112 H150 V178 H120 Z'},
    {d: 'M70 22 H124 V38 C124 50 114 54 97 54 C80 54 70 50 70 38 Z M124 28 C134 28 134 42 124 42', fill: C.redTint},
    {d: 'M14 178 H186'},
  ],
  // loyalty: phone with stamp grid + paper card
  loyalty: [
    {d: 'M70 18 H150 Q160 18 160 28 V172 Q160 182 150 182 H70 Q60 182 60 172 V28 Q60 18 70 18 Z', fill: '#fff'},
    {d: `${circ(88, 70, 11)} ${circ(110, 70, 11)} ${circ(132, 70, 11)} ${circ(88, 98, 11)}`, fill: C.green},
    {d: `${circ(110, 98, 11)} ${circ(132, 98, 11)}`, w: 4, color: C.ink3},
    {d: 'M80 136 H140', w: 9, color: C.red},
    {d: 'M14 112 L74 98 L86 150 L26 164 Z', fill: C.redTint},
    {d: `${circ(42, 128, 6)} ${circ(58, 124, 6)}`, fill: C.red, w: 4},
  ],
  // back office: boxes, clipboard, chart
  office: [
    {d: 'M18 120 H78 V178 H18 Z', fill: '#f3d9b1'},
    {d: 'M30 72 H78 V120 H30 Z', fill: '#f3d9b1'},
    {d: 'M48 120 V136 M54 72 V86', w: 5},
    {d: 'M100 40 H176 V178 H100 Z', fill: '#fff'},
    {d: 'M122 30 H154 V48 H122 Z', fill: C.ink},
    {d: 'M118 150 V128 M136 150 V108 M154 150 V90', w: 10, color: C.green},
    {d: 'M114 160 H164', w: 4, color: C.ink3},
  ],
  // ---- day 2 ----
  key: [
    {d: circ(52, 100, 30), fill: '#ffd36b'},
    {d: circ(52, 100, 11)},
    {d: 'M82 100 H178'},
    {d: 'M150 100 V122 M166 100 V116', w: 8},
  ],
  lock: [
    {d: 'M66 92 V66 A34 34 0 0 1 134 66 V92', w: 10},
    {d: 'M44 92 H156 V176 H44 Z', fill: C.red},
    {d: `${circ(100, 124, 11)} M100 134 V152`, color: '#fff', w: 7},
  ],
  mail: [
    {d: 'M24 56 H176 V150 H24 Z', fill: '#fff'},
    {d: 'M24 56 L100 112 L176 56'},
    {d: 'M24 150 L80 104 M176 150 L120 104', w: 4.5, color: C.ink3},
  ],
  laptop: [
    {d: 'M44 44 H156 V128 H44 Z', fill: C.term},
    {d: 'M60 66 L76 80 L60 94 M86 96 H112', color: C.green, w: 6},
    {d: 'M22 140 H178 L166 156 H34 Z', fill: '#ddd'},
  ],
  server: [
    {d: 'M40 40 H160 V82 H40 Z', fill: '#fff'},
    {d: 'M40 92 H160 V134 H40 Z', fill: '#fff'},
    {d: 'M40 144 H160 V186 H40 Z', fill: '#fff'},
    {d: `${circ(62, 61, 6)} ${circ(62, 113, 6)} ${circ(62, 165, 6)}`, fill: C.green, color: C.green},
    {d: 'M90 61 H140 M90 113 H140 M90 165 H140', w: 5, color: C.ink3},
  ],
  house: [
    {d: 'M24 96 L100 34 L176 96', w: 8},
    {d: 'M40 86 V180 H160 V86', fill: '#fff'},
    {d: 'M84 180 V126 H116 V180', fill: C.redTint},
    {d: 'M54 104 H76 V126 H54 Z', fill: '#eaf3ff'},
    {d: 'M14 180 H186'},
  ],
};

// ---------------- phone frame ----------------
export const Phone: React.FC<{w: number; h: number; children: React.ReactNode; screen?: string; style?: React.CSSProperties}> = ({w, h, children, screen = '#fff', style}) => (
  <div style={{position: 'absolute', width: w, height: h, borderRadius: w * 0.15, background: '#101010', padding: w * 0.028, boxShadow: '0 50px 90px -40px rgba(17,17,17,.6), inset 0 0 0 3px #3a3a3a', ...style}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.125, background: screen, overflow: 'hidden'}}>
      {children}
      <div style={{position: 'absolute', top: w * 0.028, left: '50%', width: w * 0.3, height: w * 0.07, marginLeft: -w * 0.15, background: '#101010', borderRadius: 99}} />
    </div>
  </div>
);

// ---------------- transitions ----------------
/** two-band diagonal wipe, fully covering at `at` */
export const Wipe: React.FC<{at: number; c1?: string; c2?: string; dur?: number}> = ({at, c1 = C.red, c2 = C.ink, dur = 0.56}) => {
  const {t} = useV();
  const p = P(t, at - dur / 2, at + dur / 2);
  if (p <= 0 || p >= 1) return null;
  const band = (lag: number, color: string) => {
    const q = eio(clamp((p - lag) / 0.82));
    return <div style={{position: 'absolute', top: -600, left: L(-W - 2300, W + 300, q), width: 2300, height: 3200, background: color, transform: 'rotate(12deg)'}} />;
  };
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      {band(0, c1)}
      {band(0.18, c2)}
    </div>
  );
};

/** typed text with a block cursor (terminal) */
export const Typed: React.FC<{text: string; at: number; cps?: number; color?: string; size?: number; cursor?: boolean}> = ({text, at, cps = 22, color = C.termInk, size = 44, cursor = true}) => {
  const {t} = useV();
  const n = Math.floor(clamp((t - at) * cps, 0, text.length));
  const done = n >= text.length;
  const blink = Math.floor(t * 2.2) % 2 === 0;
  if (t < at) return null;
  return (
    <span style={{fontFamily: MONO, fontWeight: 700, fontSize: size, color, whiteSpace: 'pre'}}>
      {text.slice(0, n)}
      {cursor ? <span style={{display: 'inline-block', width: size * 0.55, height: size * 0.95, background: color, verticalAlign: '-0.12em', marginLeft: 4, opacity: !done || blink ? 1 : 0}} /> : null}
    </span>
  );
};

export const eoP = (t: number, a: number, d = 0.4) => eo5(P(t, a, a + d));
