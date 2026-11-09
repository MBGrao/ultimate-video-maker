import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, CINZEL, EV, FPS, INTER, L, LN, P, PLAYFAIR, PLAYFAIR_B, SC, SCENES, clamp, ei, eio, eo, eo5, pop, spr, wt} from './brand';

type S = {t: number};

// ---------------- building blocks ----------------
const Shot: React.FC<{src: string; t: number; a: number; b: number; s0?: number; s1?: number; fx?: number; fy?: number; dx?: number; dy?: number; filter?: string; children?: React.ReactNode}> = ({src, t, a, b, s0 = 1.04, s1 = 1.12, fx = 540, fy = 960, dx = 0, dy = 0, filter, children}) => {
  const p = P(t, a, b);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${dx * p}px, ${dy * p}px) scale(${L(s0, s1, p)})`, filter}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
        {children}
      </div>
    </AbsoluteFill>
  );
};
const Logo: React.FC<{size: number}> = ({size}) => <Img src={staticFile('img/logo.png')} style={{width: size, height: (size * 342) / 729, objectFit: 'contain'}} />;

/** film look for the trailer half: letterbox bars, grain, vignette (bars fly off on the beat drop) */
const Film: React.FC<{t: number}> = ({t}) => {
  const off = eio(P(t, EV.drop - 0.05, EV.drop + 0.35));
  if (off >= 1) return null;
  const bar = 250;
  const seed = Math.floor(t * 24) % 8;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 760px 1150px at 50% 50%, transparent 45%, rgba(0,0,0,.55) 100%)', opacity: 1 - off}} />
      <AbsoluteFill style={{opacity: 0.16 * (1 - off), mixBlendMode: 'overlay', backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' seed='${seed}' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bar, background: '#000', transform: `translateY(${-off * bar}px)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bar, background: '#000', transform: `translateY(${off * bar}px)`}} />
    </AbsoluteFill>
  );
};

/** trailer title card (Cinzel caps), shown word by word with the narrator */
const TrailerTitle: React.FC<{t: number; k: string; split?: number; top?: number; size?: number; hi?: string[]}> = ({t, k, split, top = 820, size = 70, hi = []}) => {
  const line = LN[k];
  if (t < line.start - 0.2 || t > line.end + 0.45) return null;
  const fade = eo(P(t, line.start - 0.2, line.start + 0.2)) * (1 - ei(P(t, line.end + 0.2, line.end + 0.45)));
  const rows = split ? [line.words.slice(0, split), line.words.slice(split)] : [line.words];
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top, textAlign: 'center', opacity: fade, transform: `scale(${L(1.04, 1, P(t, line.start - 0.2, line.end + 0.4))})`}}>
      {rows.map((r, i) => (
        <div key={i} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 0.32em', fontFamily: CINZEL, fontWeight: 700, fontSize: size, letterSpacing: '0.1em', lineHeight: 1.25, color: '#f5efe3', textShadow: '0 4px 30px rgba(0,0,0,.8)'}}>
          {r.map((w, j) => {
            const on = eo(P(t, w.t0 - 0.12, w.t0 + 0.25));
            const h = hi.some((x) => w.w.toLowerCase().includes(x));
            return (
              <span key={j} style={{opacity: on, filter: `blur(${(1 - on) * 6}px)`, color: h ? C.gold : undefined}}>
                {w.w.toUpperCase()}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** movie subtitle in the bottom bar (italic serif), with a small speaker name */
const Subtitle: React.FC<{t: number; k: string}> = ({t, k}) => {
  const line = LN[k];
  if (t < line.start - 0.1 || t > line.end + 0.3) return null;
  const a = eo(P(t, line.start - 0.1, line.start + 0.1)) * (1 - ei(P(t, line.end + 0.15, line.end + 0.3)));
  const who = line.role === 'ayesha' ? 'AYESHA' : line.role === 'zain' ? 'ZAIN' : '';
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1690, textAlign: 'center', opacity: a}}>
      {who ? <div style={{fontFamily: CINZEL, fontWeight: 600, fontSize: 26, letterSpacing: '0.3em', color: C.gold, marginBottom: 4}}>{who}</div> : null}
      <div style={{fontFamily: PLAYFAIR, fontWeight: 500, fontSize: 60, color: '#fff8e7'}}>
        {line.words.map((w, i) => (
          <span key={i} style={{opacity: t >= w.t0 - 0.03 ? 1 : 0.28}}>
            {w.w}
            {i < line.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

/** brand-half karaoke card */
const WHO: Record<string, [string, string]> = {narrator: ['', C.amberLight], ayesha: ['Ayesha', '#fb7185'], zain: ['Zain', '#60a5fa']};
const Card: React.FC<{t: number; keys: string[]; top?: number}> = ({t, keys, top = 1450}) => {
  const k = keys.find((x) => t >= LN[x].start - 0.06 && t < LN[x].end + 0.28);
  if (!k) return null;
  const line = LN[k];
  const [name, col] = WHO[line.role];
  const a = eo(P(t, line.start - 0.06, line.start + 0.1)) * (1 - ei(P(t, line.end + 0.14, line.end + 0.28)));
  return (
    <div style={{position: 'absolute', left: 44, right: 44, top, opacity: a, transform: `translateY(${(1 - a) * 20}px)`}}>
      {name ? <div style={{display: 'inline-block', marginLeft: 26, marginBottom: -12, position: 'relative', zIndex: 2, background: col, color: '#fff', fontFamily: INTER, fontWeight: 900, fontSize: 30, padding: '6px 18px', borderRadius: 999, border: '3px solid #111827'}}>{name}</div> : null}
      <div style={{background: 'rgba(17,24,39,.93)', borderRadius: 32, padding: '26px 32px 24px', fontFamily: INTER, fontWeight: 800, fontSize: 50, lineHeight: 1.18, color: '#fff', boxShadow: '0 24px 50px -24px rgba(0,0,0,.8)'}}>
        {line.words.map((w, i) => {
          const on = t >= w.t0 - 0.02, cur = on && t < w.t1 + 0.05;
          return (
            <span key={i} style={{color: cur ? col : on ? '#fff' : 'rgba(255,255,255,.35)'}}>
              {w.w}
              {i < line.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Burst: React.FC<{t: number; at: number; color?: string}> = ({t, at, color = C.orange}) => {
  const p = P(t, at - 0.28, at + 0.3);
  if (p <= 0 || p >= 1) return null;
  const r = p < 0.48 ? eio(p / 0.48) * 1500 : (1 - eio((p - 0.48) / 0.52)) * 1500;
  const pts = Array.from({length: 26}).map((_, i) => {
    const a = (i / 26) * Math.PI * 2, rr = r * (i % 2 ? 0.84 : 1.14);
    return `${540 + Math.cos(a) * rr},${960 + Math.sin(a) * rr}`;
  }).join(' ');
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="1080" height="1920">
        <polygon points={pts} fill={color} />
      </svg>
    </AbsoluteFill>
  );
};

// ======================= TRAILER HALF =======================
export const Hook: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <Shot src="img/r1_room.png" t={t} a={0} b={SC.room.end} s0={1.18} s1={1.1} filter="blur(10px) brightness(.45) saturate(.9)" />
    <TrailerTitle t={t} k="n1" split={3} top={780} size={78} />
    <TrailerTitle t={t} k="n2" split={6} top={760} size={58} hi={['fifty', 'percent']} />
  </AbsoluteFill>
);
export const Room: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <Shot src="img/r1_room.png" t={t} a={SC.room.start} b={SC.room.end} s0={1.06} s1={1.16} fx={540} fy={900} />
    <TrailerTitle t={t} k="n3" split={2} top={1180} size={66} />
  </AbsoluteFill>
);
export const Ayesha: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <Shot src="img/r2_ayesha.png" t={t} a={SC.ayesha.start} b={SC.ayesha.end} s0={1.08} s1={1.2} fx={560} fy={620} />
  </AbsoluteFill>
);
export const Zain: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <Shot src="img/r3_zain.png" t={t} a={SC.zain.start} b={SC.zain.end} s0={1.08} s1={1.2} fx={560} fy={620} />
  </AbsoluteFill>
);
/** the menu reveal: the blank banner reads PIZZA DEAL FOR 2; freeze on the record scratch */
const MenuPlate: React.FC<{t: number; frozen?: boolean}> = ({t, frozen}) => {
  const zoom = eio(P(t, LN.zn2.start - 0.1, LN.zn2.start + 0.35));
  return (
    <Shot src="img/r4_menu.png" t={frozen ? EV.scratch : t} a={SC.menu.start} b={EV.scratch} s0={1.04} s1={1.12} fx={720} fy={840} filter={frozen ? 'grayscale(1) brightness(.55) contrast(1.1)' : undefined}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '720px 840px', transform: `translate(${-170 * zoom}px, ${40 * zoom}px) scale(${1 + 0.3 * zoom})`}}>
        <Img src={staticFile('img/r4_menu.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 404, top: 722, width: 630, height: 234, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(2.4deg) skewX(-12deg)'}}>
          <div style={{fontFamily: PLAYFAIR_B, fontWeight: 900, fontSize: 96, color: '#a51c1c', lineHeight: 0.95, letterSpacing: '-0.01em', opacity: 0.92}}>Pizza Deal</div>
          <div style={{fontFamily: PLAYFAIR_B, fontWeight: 900, fontSize: 70, color: '#2a1d14', lineHeight: 1.05, opacity: 0.9}}>for 2</div>
        </div>
      </div>
    </Shot>
  );
};
export const Menu: React.FC<S> = ({t}) => {
  const frozen = t >= EV.scratch;
  return (
    <AbsoluteFill style={{transform: frozen ? `rotate(${Math.sin((t - EV.scratch) * 70) * 1.2 * Math.max(0, 1 - (t - EV.scratch) / 0.2)}deg)` : 'none'}}>
      <MenuPlate t={t} frozen={frozen} />
    </AbsoluteFill>
  );
};
export const Twist: React.FC<S> = ({t}) => {
  const ws = LN.n4.words;
  const rows = [ws.slice(0, 5), ws.slice(5)];
  return (
    <AbsoluteFill>
      <MenuPlate t={t} frozen />
      <div style={{position: 'absolute', left: 50, right: 50, top: 0, textAlign: 'center'}}>
        {rows.map((r, i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: i ? 1130 : 330, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 18px'}}>
            {r.map((w, j) => {
              const big = i === 1 && /pizza|deal|for|two/i.test(w.w);
              return (
                <span key={j} style={{...pop(t, w.t0 - 0.05, 0, 0.4), display: 'inline-block', fontFamily: INTER, fontWeight: 900, fontSize: big ? 112 : 88, lineHeight: 1.02, letterSpacing: '-0.03em', textTransform: 'uppercase', color: big ? C.amberLight : '#fff', textShadow: '0 8px 30px rgba(0,0,0,.7)'}}>
                  {w.w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ======================= BRAND HALF =======================
export const App: React.FC<S> = ({t}) => {
  const a = SC.app.start, tap = EV.tap, matchAt = EV.match, chat = EV.chat, split = EV.split;
  const ph = eo5(P(t, a + 0.1, a + 0.55));
  const matching = t >= tap + 0.1 && t < matchAt;
  const mp = eo5(P(t, matchAt, matchAt + 0.35));
  const view = t < matchAt ? 'deals' : t < chat ? 'match' : t < split ? 'chat' : 'split';
  const chips: [string, string][] = [['✅ Verified users only', 'verified'], ['💬 Chat', 'chat'], ['📍 Meet up', 'meet'], ['🧾 Split the bill', 'split']];
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 1200px at 50% 40%, #fdba74 0%, ${C.orange} 55%, ${C.orangeDeep} 100%)`}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.15) 2px, transparent 2.6px)', backgroundSize: '34px 34px'}} />
      <div style={{position: 'absolute', left: 205, top: 150, width: 670, height: 1130, borderRadius: 88, background: '#0f1115', padding: 20, boxShadow: '0 60px 100px -40px rgba(124,45,18,.8)', transform: `translateY(${(1 - ph) * 1000}px) rotate(${(1 - ph) * 8}deg)`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 70, background: '#fff', overflow: 'hidden', fontFamily: INTER}}>
          <div style={{position: 'absolute', top: 20, left: '50%', width: 180, height: 42, marginLeft: -90, borderRadius: 99, background: '#0f1115'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '92px 30px 14px'}}>
            <Logo size={100} />
            <div style={{fontWeight: 900, fontSize: 38, color: C.ink}}>MealMates</div>
          </div>
          {view === 'deals' ? (
            <div style={{padding: '0 28px'}}>
              {matching ? (
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 170}}>
                  <div style={{position: 'relative', width: 360, height: 360}}>
                    {[0, 1, 2].map((i) => {
                      const r = ((t - tap) * 1.1 + i / 3) % 1;
                      return <div key={i} style={{position: 'absolute', left: 180 - 180 * r, top: 180 - 180 * r, width: 360 * r, height: 360 * r, borderRadius: 999, border: `5px solid ${C.orange}`, opacity: 1 - r}} />;
                    })}
                    <div style={{position: 'absolute', left: 130, top: 130, width: 100, height: 100, borderRadius: 99, background: `linear-gradient(135deg, ${C.orange}, ${C.amber})`, display: 'grid', placeItems: 'center', fontSize: 50}}>🍕</div>
                  </div>
                  <div style={{fontWeight: 900, fontSize: 44, color: C.ink, marginTop: 30}}>Matching…</div>
                  <div style={{fontWeight: 700, fontSize: 28, color: C.ink2, marginTop: 8}}>Pizza Deal for 2 · nearby</div>
                </div>
              ) : (
                <>
                  <div style={{fontWeight: 900, fontSize: 40, color: C.ink, margin: '18px 4px 18px', ...pop(t, a + 0.4, 0, 0.8)}}>Deals near you 📍</div>
                  {[['🍕', 'Pizza Deal for 2', true], ['🍔', 'Burger Deal for 2', false], ['🍛', 'Karahi Deal for 2', false]].map(([e, n, hi], i) => (
                    <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: 20, borderRadius: 24, marginBottom: 16, border: `3px solid ${hi && t >= tap ? C.orange : '#f1e6da'}`, background: hi && t >= tap ? C.cream : '#fff', ...pop(t, a + 0.5 + i * 0.12, 0, 0.8)}}>
                      <div style={{width: 100, height: 100, borderRadius: 20, background: C.creamDeep, display: 'grid', placeItems: 'center', fontSize: 58}}>{e as string}</div>
                      <div>
                        <div style={{fontWeight: 900, fontSize: 34, color: C.ink}}>{n as string}</div>
                        <div style={{fontWeight: 600, fontSize: 25, color: C.ink2, marginTop: 4}}>Split & Save · 50% off for both</div>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop: 30, textAlign: 'center', borderRadius: 999, padding: '26px 0', fontWeight: 900, fontSize: 36, color: '#fff', background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, transform: `scale(${1 - 0.05 * Math.sin(Math.PI * P(t, tap - 0.1, tap + 0.15))})`}}>Find a food buddy</div>
                </>
              )}
            </div>
          ) : null}
          {view === 'match' ? (
            <div style={{margin: '90px 26px 0', opacity: mp, transform: `scale(${L(0.9, 1, clamp(spr(t, matchAt), 0, 1.2))})`, borderRadius: 32, padding: '30px 26px', background: `linear-gradient(160deg, ${C.cream}, #fff)`, border: `3px solid ${C.orange}`, textAlign: 'center'}}>
              <div style={{position: 'relative', width: 190, height: 190, margin: '0 auto', borderRadius: 999, overflow: 'hidden', border: `8px solid ${C.amberLight}`}}>
                <Img src={staticFile('img/ref_zain.png')} style={{position: 'absolute', left: -89, top: -64, width: 369, height: 553}} />
              </div>
              <div style={{fontWeight: 900, fontSize: 42, color: C.ink, marginTop: 18}}>Found your food buddy! 🤝</div>
              <div style={{fontWeight: 900, fontSize: 36, color: C.ink, marginTop: 10}}>Zain</div>
              <div style={{fontWeight: 800, fontSize: 27, color: C.orangeDeep, marginTop: 2}}>also wants the Pizza Deal for 2</div>
              <div style={{display: 'inline-block', marginTop: 14, background: '#ecfdf5', color: C.green, fontWeight: 800, fontSize: 26, padding: '8px 16px', borderRadius: 999}}>✓ Verified</div>
            </div>
          ) : null}
          {view === 'match' ? (
            <div style={{margin: '36px 26px 0', textAlign: 'center', borderRadius: 999, padding: '26px 0', fontWeight: 900, fontSize: 36, color: '#fff', background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, ...pop(t, matchAt + 0.7, 0, 0.6)}}>Start chat 💬</div>
          ) : null}
          {view === 'chat' ? (
            <div style={{padding: '0 26px', display: 'flex', flexDirection: 'column', gap: 18}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0 18px', borderBottom: '2px solid #f1e6da', marginBottom: 6}}>
                <div style={{position: 'relative', width: 70, height: 70, borderRadius: 999, overflow: 'hidden', border: `4px solid ${C.amberLight}`}}>
                  <Img src={staticFile('img/ref_zain.png')} style={{position: 'absolute', left: -32, top: -24, width: 133, height: 200}} />
                </div>
                <div>
                  <div style={{fontWeight: 900, fontSize: 32, color: C.ink}}>Zain</div>
                  <div style={{fontWeight: 700, fontSize: 22, color: C.green}}>✓ Verified · Pizza Deal for 2</div>
                </div>
              </div>
              <div style={{alignSelf: 'flex-start', ...pop(t, chat, 0, 0.6), background: '#f3f4f6', borderRadius: '26px 26px 26px 6px', padding: '18px 22px', fontWeight: 700, fontSize: 32, color: C.ink}}>Check out this deal! 🍕</div>
              <div style={{alignSelf: 'flex-end', ...pop(t, chat + 0.55, 0, 0.6), background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, color: '#fff', borderRadius: '26px 26px 6px 26px', padding: '18px 22px', fontWeight: 800, fontSize: 32}}>8pm? Half the fries are mine 😄</div>
              <div style={{alignSelf: 'flex-start', ...pop(t, chat + 1.1, 0, 0.6), background: '#f3f4f6', borderRadius: '26px 26px 26px 6px', padding: '18px 22px', fontWeight: 700, fontSize: 32, color: C.ink}}>Deal 🤝</div>
            </div>
          ) : null}
          {view === 'chat' ? (
            <div style={{position: 'absolute', left: 22, right: 22, bottom: 128, display: 'flex', gap: 12, alignItems: 'center'}}>
              <div style={{flex: 1, borderRadius: 999, border: '2px solid #e5e7eb', padding: '18px 24px', fontSize: 26, fontWeight: 600, color: '#9ca3af'}}>Type a message…</div>
              <div style={{width: 66, height: 66, borderRadius: 999, background: C.orange, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 30, fontWeight: 900}}>➤</div>
            </div>
          ) : null}
          {view === 'split' ? (
            <div style={{margin: '110px 26px 0', textAlign: 'center', ...pop(t, split, 0, 0.6)}}>
              <div style={{fontWeight: 900, fontSize: 46, color: C.ink}}>Split & Save</div>
              <div style={{display: 'flex', gap: 14, marginTop: 20}}>
                {['Ayesha', 'Zain'].map((n) => (
                  <div key={n} style={{flex: 1, borderRadius: 22, padding: '22px 0', background: C.cream, border: `3px solid ${C.orange}`}}>
                    <div style={{fontWeight: 800, fontSize: 28, color: C.ink2}}>{n}</div>
                    <div style={{fontWeight: 900, fontSize: 44, color: C.orangeDeep}}>½ bill</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop: 22, background: C.green, color: '#fff', borderRadius: 999, padding: '18px 0', fontWeight: 900, fontSize: 36}}>50% off for both!</div>
              <div style={{fontSize: 120, marginTop: 40, ...pop(t, split + 0.35, -6, 0.3)}}>🍕🤝</div>
            </div>
          ) : null}
          {view === 'split'
            ? Array.from({length: 34}).map((_, i) => {
                const d = t - split;
                if (d < 0 || d > 2.2) return null;
                const x = 315 + Math.cos(i * 2.4) * (120 + (i % 5) * 50) * Math.min(1, d * 3);
                const y = 330 - Math.abs(Math.sin(i * 1.7)) * 260 * Math.min(1, d * 3) + d * d * 260;
                return <div key={i} style={{position: 'absolute', left: x, top: y, width: 16, height: 26, borderRadius: 4, background: [C.orange, C.amber, C.green, '#fb7185', '#60a5fa'][i % 5], transform: `rotate(${i * 47 + d * 400}deg)`, opacity: 1 - P(d, 1.6, 2.2)}} />;
              })
            : null}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 112, borderTop: '2px solid #f1e6da', background: '#fff', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 14}}>
            {[['🏠', 'deals'], ['🤝', 'match'], ['💬', 'chat'], ['🧾', 'split']].map(([e, v]) => (
              <div key={v} style={{fontSize: 44, opacity: view === v ? 1 : 0.35, transform: `scale(${view === v ? 1.1 : 1})`}}>{e}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 1300, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12}}>
        {chips.map(([label, key], i) => {
          const at = wt('n6', key);
          return t >= at - 0.05 ? (
            <div key={label} style={{...pop(t, at - 0.05, [-4, 3, -3, 4][i], 0.4), background: '#fff', color: C.ink, fontFamily: INTER, fontWeight: 900, fontSize: 34, padding: '12px 22px', borderRadius: 999, boxShadow: '0 12px 24px -12px rgba(0,0,0,.5)'}}>{label}</div>
          ) : null;
        })}
      </div>
      <Card t={t} keys={['n5', 'n6']} top={1500} />
    </AbsoluteFill>
  );
};

export const Table: React.FC<S> = ({t}) => {
  const half = EV.half;
  const draw = eio(P(t, half - 0.05, half + 0.45));
  return (
    <AbsoluteFill>
      <Shot src="img/r5_table.png" t={t} a={SC.table.start} b={SC.table.end} s0={1.05} s1={1.16} fx={760} fy={1080}>
        <svg width="1080" height="1920" style={{position: 'absolute', left: 0, top: 0}}>
          <path d="M 628 1080 L 652 1400" stroke="#fff" strokeWidth="10" strokeDasharray="26 18" strokeLinecap="round" fill="none" pathLength={1} style={{strokeDasharray: `${draw} 1`, filter: 'drop-shadow(0 0 8px rgba(0,0,0,.7))'}} />
        </svg>
      </Shot>
      {t >= half ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center', ...pop(t, half + 0.2, 6, 0.3)}}>
          <div style={{background: C.amberLight, color: C.ink, fontFamily: INTER, fontWeight: 900, fontSize: 64, padding: '14px 28px', borderRadius: 24, border: '5px solid #111827', boxShadow: '0 16px 30px -12px rgba(0,0,0,.6)'}}>50 / 50 🍟</div>
        </div>
      ) : null}
      <Card t={t} keys={['zn3', 'ay3']} top={1460} />
    </AbsoluteFill>
  );
};

export const End: React.FC<S> = ({t}) => {
  const n7 = LN.n7, n8 = LN.n8;
  const tag = n7.words.slice(1);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile('img/r5_table.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover', filter: 'blur(16px) brightness(.8)', transform: 'scale(1.1)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(170deg, rgba(249,115,22,.93) 0%, rgba(234,88,12,.9) 50%, rgba(245,158,11,.93) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', justifyContent: 'center', ...pop(t, n7.start - 0.05, 0, 0.6)}}>
        <div style={{background: '#fff', borderRadius: 40, padding: '24px 40px', display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 30px 60px -30px rgba(0,0,0,.5)'}}>
          <Logo size={180} />
          <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 70, color: C.ink, letterSpacing: '-0.03em'}}>MealMates</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 520, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 18px'}}>
        {tag.map((w, i) => (
          <span key={i} style={{...pop(t, w.t0 - 0.05, 0, 0.4), display: 'inline-block', fontFamily: INTER, fontWeight: 900, fontSize: 92, letterSpacing: '-0.03em', lineHeight: 1.05, color: /save|money|together/i.test(w.w) ? C.cream : '#fff', textShadow: '0 6px 24px rgba(0,0,0,.25)'}}>{w.w}</span>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', ...pop(t, n8.start - 0.05, 0, 0.6)}}>
        <span style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.2)', border: '3px solid rgba(255,255,255,.6)', borderRadius: 999, padding: '12px 28px', fontFamily: INTER, fontWeight: 800, fontSize: 38, color: '#fff'}}>
          <span style={{width: 16, height: 16, borderRadius: 99, background: '#fff', opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 3))}} />
          Launching soon · Lahore · Multan
        </span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', ...pop(t, wt('n8', 'join') - 0.05, 0, 0.6)}}>
        <span style={{display: 'inline-block', background: '#fff', color: C.orangeDeep, fontFamily: INTER, fontWeight: 900, fontSize: 64, padding: '22px 52px', borderRadius: 999, boxShadow: '0 24px 50px -20px rgba(0,0,0,.5)', transform: `scale(${1 + 0.04 * Math.sin(Math.max(0, t - n8.end) * 6)})`}}>Join the waitlist →</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1270, textAlign: 'center', ...pop(t, wt('n8', 'mealmatesapp') - 0.05, 0, 0.6)}}>
        <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 74, color: '#fff', letterSpacing: '-0.02em'}}>mealmatesapp.com</span>
      </div>
    </AbsoluteFill>
  );
};

// ======================= MAIN =======================
const VIEW: Record<string, React.FC<S>> = {hook: Hook, room: Room, ayesha: Ayesha, zain: Zain, menu: Menu, twist: Twist, app: App, table: Table, end: End};
export const Main: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cur = SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
  const View = VIEW[cur.id];
  const xfade = (id: string) => (t >= SC[id].start && t < SC[id].start + 0.35 ? 1 - eo(P(t, SC[id].start, SC[id].start + 0.35)) : 0);
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <View t={t} />
      {/* soft dissolves through black inside the trailer, like a real trailer */}
      {['room', 'ayesha', 'zain', 'menu'].map((id) => (xfade(id) > 0 ? <AbsoluteFill key={id} style={{background: '#000', opacity: xfade(id) * 0.85}} /> : null))}
      <Film t={t} />
      {['ay1', 'zn1', 'ay2', 'zn2'].map((k) => <Subtitle key={k} t={t} k={k} />)}
      <Burst t={t} at={SC.app.start} />
      <Burst t={t} at={SC.end.start} color={C.amberLight} />
      <span style={{display: 'none'}}>{L(0, 1, 0)}</span>
    </AbsoluteFill>
  );
};
