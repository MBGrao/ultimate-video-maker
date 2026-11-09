import React from 'react';
import {C, EV, HEAD, L, LN, MONO, P, SANS, SERIF, clamp, ei, eo, eo5, pop} from './brand';

type S = {t: number};

// ---------------- backgrounds ----------------
export const Grid: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: C.page}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.line2} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.line2} 1.5px, transparent 1.5px)`, backgroundSize: '72px 72px', backgroundPosition: '-1px -1px'}} />
    <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 1100px 900px at 50% 40%, rgba(255,255,255,.55), transparent 70%)'}} />
  </div>
);
export const Term: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse 900px 800px at 50% 45%, #1b2019 0%, ${C.term} 70%)`}}>
    <div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(233,242,234,.12) 1.6px, transparent 2.2px)', backgroundSize: '34px 34px'}} />
  </div>
);

// ---------------- brand ----------------
export const Mark: React.FC<{size: number}> = ({size}) => (
  <div style={{width: size, height: size, background: C.red, color: '#241910', transform: 'rotate(-8deg)', display: 'grid', placeItems: 'center', fontFamily: MONO, fontWeight: 800, fontSize: size * 0.53, letterSpacing: '-0.04em', lineHeight: 1, flexShrink: 0}}>ll</div>
);
export const Logo: React.FC<{size?: number; ink?: string}> = ({size = 44, ink = C.ink}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.32}}>
    <Mark size={size} />
    <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: size * 0.7, letterSpacing: '-0.04em', color: ink, lineHeight: 1}}>
      localhost <span style={{fontFamily: SERIF, fontWeight: 400, fontSize: size * 0.82, letterSpacing: '-0.01em'}}>labs</span>
    </div>
  </div>
);

/** series label (left) + the question counter (right), which appears on "Three questions" and stays to the end */
export const TopBar: React.FC<S> = ({t}) => {
  const label = '> hot.take';
  const typed = Math.floor(clamp((t - 0.02) / 0.4) * label.length);
  const blink = Math.floor(t * 2.2) % 2 === 0;
  const n = t >= EV.c3 ? 3 : t >= EV.c2 ? 2 : t >= EV.c1 ? 1 : 0;
  const last = [EV.c0, EV.c1, EV.c2, EV.c3][n];
  const bump = 1 + 0.4 * Math.max(0, 1 - (t - last) / 0.22);
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 146, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, background: C.term, borderRadius: 14, padding: '12px 20px 12px 16px', boxShadow: '0 10px 24px -14px rgba(0,0,0,.6)'}}>
        <span style={{width: 14, height: 14, borderRadius: 99, background: C.red, opacity: blink ? 1 : 0.35, boxShadow: `0 0 12px ${C.red}`}} />
        <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.red, whiteSpace: 'pre'}}>{label.slice(0, typed)}</span>
        <span style={{width: 16, height: 32, background: C.red, opacity: blink ? 1 : 0}} />
      </div>
      {t >= EV.c0 - 0.05 ? (
        <div style={{...pop(t, EV.c0 - 0.05, 0, 0.6), transformOrigin: '100% 50%', display: 'flex', alignItems: 'center', gap: 16, background: C.term, borderRadius: 14, padding: '14px 20px', boxShadow: '0 10px 24px -14px rgba(0,0,0,.6)', border: '2px solid rgba(233,242,234,.1)'}}>
          <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 32, color: n ? C.green : C.termInk, display: 'inline-block', minWidth: 60, textAlign: 'center', transform: `scale(${bump})`}}>{n}/3</span>
          <div style={{display: 'flex', gap: 6}}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{width: 36, height: 10, borderRadius: 99, background: i <= n ? C.green : 'rgba(233,242,234,.22)'}} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ---------------- burned-in subtitles: phrase by phrase, current word lit ----------------
const chunks = (ws: {w: string; t0: number; t1: number}[]) => {
  const out: (typeof ws)[] = [];
  let cur: typeof ws = [];
  ws.forEach((w, i) => {
    cur.push(w);
    const end = /[.?!:,]$/.test(w.w) && cur.length >= 2;
    if (end || cur.length >= 6 || i === ws.length - 1) {
      out.push(cur);
      cur = [];
    }
  });
  // never leave a single dangling word at the end of a line
  if (out.length > 1 && out[out.length - 1].length === 1) out[out.length - 2].push(...out.pop()!);
  return out;
};
export const Captions: React.FC<S & {hidden?: boolean}> = ({t, hidden}) => {
  const k = Object.keys(LN).find((key) => t >= LN[key].start - 0.06 && t < LN[key].end + 0.3);
  if (!k || hidden) return null;
  const line = LN[k];
  const cs = chunks(line.words);
  const idx = Math.max(0, cs.findIndex((c, i) => t < (cs[i + 1]?.[0].t0 ?? 1e9) - 0.03));
  const c = cs[idx];
  const a = eo(P(t, line.start - 0.06, line.start + 0.1)) * (1 - ei(P(t, line.end + 0.16, line.end + 0.3)));
  const swap = idx > 0 ? eo(P(t, c[0].t0 - 0.03, c[0].t0 + 0.09)) : 1;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1436, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{background: 'rgba(17,17,17,.93)', borderRadius: 30, padding: '18px 32px 21px', maxWidth: 940, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: 1.2, color: '#fff', boxShadow: '0 18px 40px -20px rgba(0,0,0,.6)', border: '2px solid rgba(255,255,255,.08)', transform: `translateY(${(1 - a) * 14}px) scale(${L(0.94, 1, swap)})`}}>
        {c.map((w, i) => {
          const on = t >= w.t0 - 0.02;
          const cur = on && t < w.t1 + 0.04;
          return (
            <span key={i} style={{color: cur ? C.green : on ? '#fff' : 'rgba(255,255,255,.4)'}}>
              {w.w}
              {i < c.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- text + stamps ----------------
export const Head: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = C.ink, children, style}) => (
  <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 0.92, letterSpacing: '-0.045em', textTransform: 'uppercase', color, whiteSpace: 'nowrap', ...style}}>{children}</div>
);
export const Rise: React.FC<{t: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, at, dur = 0.38, children, style}) => {
  const p = eo5(P(t, at, at + dur));
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 108}%)`, opacity: p > 0 ? 1 : 0}}>{children}</div>
    </div>
  );
};
export const Stamp: React.FC<{t: number; at: number; children: React.ReactNode; color?: string; bg?: string; rot?: number; size?: number}> = ({t, at, children, color = C.red, bg = 'rgba(255,255,255,.92)', rot = -7, size = 80}) => {
  const p = P(t, at, at + 0.16);
  if (p <= 0) return null;
  return (
    <div style={{display: 'inline-block', border: `${size * 0.08}px solid ${color}`, color, background: bg, fontFamily: HEAD, fontWeight: 900, fontSize: size, lineHeight: 1, padding: `${size * 0.14}px ${size * 0.26}px ${size * 0.16}px`, letterSpacing: '-0.03em', textTransform: 'uppercase', borderRadius: size * 0.14, transform: `rotate(${rot}deg) scale(${L(1.8, 1, eo(p))})`, opacity: clamp(p * 3), whiteSpace: 'nowrap', boxShadow: '0 20px 40px -20px rgba(0,0,0,.5)'}}>
      {children}
    </div>
  );
};
export const Chip: React.FC<{children: React.ReactNode; color?: string; bg?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.ink, bg = C.white, size = 30, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, background: bg, color, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: '0.04em', padding: `${size * 0.4}px ${size * 0.7}px`, borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 12px 26px -16px rgba(0,0,0,.5)', ...style}}>{children}</div>
);

// ---------------- the spreadsheet (B-roll stand-in for "a sheet filling itself") ----------------
export const ROWS: [string, string, string, string][] = [
  ['1041', 'Ayesha K.', 'Chocolate cake', '2'],
  ['1042', 'Bilal R.', 'Croissant box', '1'],
  ['1043', 'Sana M.', 'Cupcakes ×12', '3'],
  ['1044', 'Hamza T.', 'Brownies', '2'],
  ['1045', 'Zara A.', 'Cheesecake', '1'],
  ['1046', 'Usman F.', 'Cookie tin', '4'],
  ['1047', 'Maryam S.', 'Birthday cake', '1'],
  ['1048', 'Ali H.', 'Donuts ×6', '2'],
  ['1049', 'Hina Q.', 'Tea cakes', '5'],
  ['1050', 'Omar Z.', 'Macarons', '2'],
];
const COLS = [['#', 118], ['Customer', 250], ['Item', 312], ['Qty', 92], ['Status', 168]] as const;
export const Sheet: React.FC<{t: number; fill: (i: number) => number; title: string; live?: boolean; rows?: number; from?: (i: number) => number}> = ({t, fill, title, live = true, rows = 8, from}) => (
  <div style={{width: 960, background: C.white, borderRadius: 30, overflow: 'hidden', boxShadow: '0 50px 90px -40px rgba(17,17,17,.4)', border: '1.5px solid rgba(17,17,17,.08)'}}>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px', background: '#f6f7f5', borderBottom: '1.5px solid rgba(17,17,17,.08)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 40, height: 40, borderRadius: 9, background: C.green, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: MONO, fontWeight: 800, fontSize: 22}}>▦</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.ink}}>{title}</div>
      </div>
      {live ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.greenDeep, background: C.greenTint, padding: '8px 14px', borderRadius: 999}}>
          <span style={{width: 12, height: 12, borderRadius: 99, background: C.green, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 5))}} />⚡ AUTO-SYNC
        </div>
      ) : (
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.redDeep, background: C.redTint, padding: '8px 14px', borderRadius: 999}}>✋ MANUAL</div>
      )}
    </div>
    <div style={{display: 'flex', background: '#fbfbfa', borderBottom: '1.5px solid rgba(17,17,17,.08)'}}>
      {COLS.map(([n, w]) => (
        <div key={n} style={{width: w, padding: '12px 18px', fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.ink3, letterSpacing: '0.06em', textTransform: 'uppercase'}}>{n}</div>
      ))}
    </div>
    {Array.from({length: rows}).map((_, i) => {
      const r = ROWS[i % ROWS.length];
      const p = fill(i);
      const flash = p > 0 ? 1 - P(p, 0.3, 1) : 0;
      const dy = from ? from(i) : 0;
      return (
        <div key={i} style={{display: 'flex', height: 66, alignItems: 'center', borderBottom: '1.5px solid rgba(17,17,17,.06)', background: `rgba(0,194,122,${0.22 * flash})`, transform: `translateY(${dy}px)`, opacity: from && p <= 0 ? 0 : 1}}>
          {[r[0], r[1], r[2], r[3]].map((v, j) => (
            <div key={j} style={{width: COLS[j][1], padding: '0 18px', fontFamily: j === 0 ? MONO : SANS, fontWeight: j === 0 ? 700 : 600, fontSize: 28, color: j === 0 ? C.ink3 : C.ink, whiteSpace: 'nowrap', overflow: 'hidden', opacity: p > 0 ? 1 : 0}}>
              {p > 0 ? (j === 2 ? v.slice(0, Math.ceil(v.length * clamp(p * 2.2))) : v) : ''}
            </div>
          ))}
          <div style={{width: COLS[4][1], padding: '0 14px'}}>
            {p >= 0.6 ? <span style={{fontFamily: MONO, fontWeight: 800, fontSize: 20, color: C.greenDeep, background: C.greenTint, padding: '6px 12px', borderRadius: 999}}>✓ SYNCED</span> : p > 0 ? <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 20, color: C.ink3}}>…</span> : null}
          </div>
        </div>
      );
    })}
  </div>
);
