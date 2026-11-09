import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ANTON, C, EV, FPS, INTER, L, LN, P, SC, SCENES, clamp, ei, eio, eo, eo5, mouthAt, pop, spr, wt} from './brand2';
import {Logo, Outline, PizzaMouth, Rain, Shot, whip} from './parts2';

type S = {t: number};

// ---------------- speakers ----------------
const WHO: Record<string, {name: string; col: string; ink: string}> = {
  narrator: {name: '🎙️ Narrator', col: '#ffffff', ink: C.ink},
  hamza: {name: 'Hamza', col: C.orange, ink: '#fff'},
  reflection: {name: 'Hamza (aaina)', col: '#fdba74', ink: C.ink},
  bilal: {name: 'Bilal', col: C.amberLight, ink: C.ink},
  waiter: {name: 'Waiter', col: '#374151', ink: '#fff'},
  announcer: {name: '📢 Announcer', col: C.red, ink: '#fff'},
  pizza: {name: '🍕 Pizza', col: '#ef4444', ink: '#fff'},
  ammi: {name: 'Ammi', col: '#f472b6', ink: '#fff'},
};

/** one big karaoke card per spoken line, with the speaker's name tag */
export const SpeechCard: React.FC<{t: number; top?: number}> = ({t, top = 1400}) => {
  const k = Object.keys(LN).find((key) => t >= LN[key].start - 0.06 && t < LN[key].end + 0.28);
  if (!k) return null;
  const line = LN[k];
  const who = WHO[line.role];
  const a = eo(P(t, line.start - 0.06, line.start + 0.1)) * (1 - ei(P(t, line.end + 0.14, line.end + 0.28)));
  const hl = line.role === 'narrator' ? C.amberLight : who.col === '#ffffff' ? C.amberLight : who.col;
  return (
    <div style={{position: 'absolute', left: 44, right: 44, top, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', opacity: a, transform: `translateY(${(1 - a) * 22}px) scale(${L(0.96, 1, a)})`}}>
      <div style={{marginLeft: 26, marginBottom: -14, zIndex: 2, background: who.col, color: who.ink, fontFamily: INTER, fontWeight: 900, fontSize: 32, padding: '8px 20px', borderRadius: 999, boxShadow: '0 8px 18px -8px rgba(0,0,0,.6)', border: '3px solid #111827'}}>{who.name}</div>
      <div style={{alignSelf: 'stretch', background: 'rgba(17,24,39,.94)', border: `4px solid ${who.col === '#ffffff' ? 'rgba(255,255,255,.25)' : who.col}`, borderRadius: 34, padding: '30px 34px 26px', fontFamily: INTER, fontWeight: 800, fontSize: 54, lineHeight: 1.18, color: '#fff', boxShadow: '0 24px 50px -24px rgba(0,0,0,.8)'}}>
        {line.words.map((w, i) => {
          const on = t >= w.t0 - 0.02, cur = on && t < w.t1 + 0.05;
          return (
            <span key={i} style={{color: cur ? hl : on ? '#fff' : 'rgba(255,255,255,.35)', display: 'inline-block', transform: cur ? 'translateY(-3px)' : 'none'}}>
              {w.w}
              {i < line.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------- partner-hunt hearts: one breaks on every FAIL ----------------
const FAILS = ['a1', 'a2', 'a3', 'a4'];
const failAt = (k: string) => wt(k, 'fail');
export const Hearts: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', right: 44, top: 140, display: 'flex', gap: 10, background: 'rgba(17,24,39,.75)', borderRadius: 999, padding: '10px 18px'}}>
    {FAILS.map((k, i) => {
      const at = failAt(k);
      const broken = t >= at;
      const sh = broken && t < at + 0.4 ? Math.sin((t - at) * 60) * 8 * (1 - (t - at) / 0.4) : 0;
      return (
        <span key={k} style={{fontSize: 52, display: 'inline-block', transform: `translateX(${sh}px) scale(${broken ? 1 + 0.4 * Math.max(0, 1 - (t - at) / 0.25) : 1})`, filter: broken && t > at + 0.4 ? 'grayscale(1) opacity(.7)' : 'none'}}>{broken ? '💔' : '❤️'}</span>
      );
    })}
  </div>
);

/** FAIL! stamp, exactly on the announcer's "FAIL" */
const FailStamp: React.FC<{t: number; k: string; n: number}> = ({t, k, n}) => {
  const at = failAt(k) - 0.03;
  const p = P(t, at, at + 0.14);
  if (p <= 0) return null;
  return (
    <>
      <AbsoluteFill style={{background: C.red, opacity: Math.max(0, 0.35 - (t - at)) }} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center'}}>
        <div style={{transform: `rotate(-8deg) scale(${L(2.2, 1, eo(p))})`, opacity: clamp(p * 3), border: `14px solid ${C.red}`, background: 'rgba(255,255,255,.95)', borderRadius: 22, padding: '6px 40px 0', textAlign: 'center', boxShadow: '0 30px 60px -20px rgba(0,0,0,.6)'}}>
          <div style={{fontFamily: ANTON, fontSize: 46, color: C.ink, letterSpacing: '0.08em'}}>ATTEMPT {n}</div>
          <div style={{fontFamily: ANTON, fontSize: 190, color: C.red, lineHeight: 0.95}}>FAIL!</div>
        </div>
      </div>
    </>
  );
};

// ---------------- comic burst wipe ----------------
export const Burst: React.FC<{t: number; at: number; color?: string}> = ({t, at, color = C.orange}) => {
  const p = P(t, at - 0.3, at + 0.3);
  if (p <= 0 || p >= 1) return null;
  const r = p < 0.5 ? eio(p * 2) * 1500 : (1 - eio((p - 0.5) * 2)) * 1500;
  const cx = 540, cy = 960;
  const spikes = Array.from({length: 24}).map((_, i) => {
    const a = (i / 24) * Math.PI * 2, rr = r * (i % 2 ? 0.86 : 1.12);
    return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
  }).join(' ');
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="1080" height="1920">
        <defs>
          <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="13" cy="13" r="5" fill="rgba(255,255,255,.28)" />
          </pattern>
        </defs>
        <polygon points={spikes} fill={color} />
        <polygon points={spikes} fill="url(#dots)" />
      </svg>
    </AbsoluteFill>
  );
};

// ======================= SCENES =======================
const HookWords: React.FC<{t: number}> = ({t}) => {
  const ws = LN.n1.words;
  const L1 = ws.slice(0, 5), L2 = ws.slice(5);
  const row = (arr: typeof ws, size: number, col: string) => (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px'}}>
      {arr.map((w, i) => (
        <span key={i} style={{...pop(t, w.t0 - 0.05, 0, 0.3), display: 'inline-block'}}>
          <Outline size={size} color={col}>{w.w}</Outline>
        </span>
      ))}
    </div>
  );
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1130}}>
      {row(L1, 84, '#fff')}
      <div style={{height: 14}} />
      {row(L2, 112, C.amberLight)}
    </div>
  );
};
export const Hook: React.FC<S> = ({t}) => {
  const z = eio(P(t, 0.22, 0.62));
  const shake = t > 0.55 && t < 1.0 ? (1 - P(t, 0.55, 1.0)) * 10 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '894px 380px', transform: `translate(${L(0, -232, z) + Math.sin(t * 61) * shake * 0.6}px, ${L(0, 180, z) + Math.cos(t * 53) * shake * 0.6}px) scale(${L(1, 1.5, z) + 0.03 * P(t, 0.6, SC.hook.end)})`}}>
        <Img src={staticFile('img/s1_menu.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 690, top: 150, width: 420, textAlign: 'center', fontFamily: ANTON, color: C.red, lineHeight: 0.92, transform: 'rotate(-1deg)'}}>
          <div style={{fontSize: 150}}>DEAL</div>
          <div style={{fontSize: 118}}>FOR 2</div>
        </div>
      </div>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,.55) 100%)'}} />
      <HookWords t={t} />
    </AbsoluteFill>
  );
};

export const Pizza: React.FC<S> = ({t}) => {
  const sq = 1 + 0.025 * mouthAt(t);
  return (
    <Shot src="img/s2_pizza.png" t={t} a={SC.pizza.start} b={SC.pizza.end} s0={1.06} s1={1.18} fx={540} fy={860}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 920px', transform: `scaleY(${sq}) scaleX(${2 - sq})`}}>
        <PizzaMouth t={t} x={540} y={1060} w={250} />
      </div>
    </Shot>
  );
};

const Attempt: React.FC<{t: number; id: string; src: string; fk: string; n: number; fx: number; fy: number; dx?: number; reactAt?: number}> = ({t, id, src, fk, n, fx, fy, dx = 0, reactAt}) => {
  const a = SC[id].start, b = SC[id].end;
  const react = reactAt !== undefined && t > reactAt ? Math.sin((t - reactAt) * 30) * 6 * Math.exp(-(t - reactAt) * 4) : 0;
  return (
    <AbsoluteFill style={whip(t, a)}>
      <AbsoluteFill style={{transform: `translateX(${react}px)`}}>
        <Shot src={src} t={t} a={a} b={b} s0={1.05} s1={1.2} fx={fx} fy={fy} dx={dx} />
      </AbsoluteFill>
      <FailStamp t={t} k={fk} n={n} />
    </AbsoluteFill>
  );
};
export const Waiter: React.FC<S> = ({t}) => <Attempt t={t} id="waiter" src="img/s3_waiter.png" fk="a1" n={1} fx={480} fy={600} reactAt={LN.w1.start} />;
export const Cat: React.FC<S> = ({t}) => <Attempt t={t} id="cat" src="img/s4_cat.png" fk="a2" n={2} fx={600} fy={860} dx={-90} reactAt={EV.cat} />;
export const Mirror: React.FC<S> = ({t}) => <Attempt t={t} id="mirror" src="img/s5_mirror.png" fk="a3" n={3} fx={760} fy={640} reactAt={LN.r1.start} />;

export const Call: React.FC<S> = ({t}) => {
  const a = SC.call.start;
  const amTalk = t >= LN.am.start && t < LN.am.end;
  const hTalk = t >= LN.h4.start && t < LN.h4.end;
  const half = (src: string, pos: string, top: number, s: number, lit: boolean) => (
    <div style={{position: 'absolute', left: 0, top, width: 1080, height: 960, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: 1080, height: 960, objectFit: 'cover', objectPosition: pos, transform: `scale(${s})`, filter: lit ? 'none' : 'brightness(.62) saturate(.8)'}} />
    </div>
  );
  return (
    <AbsoluteFill style={{...whip(t, a), background: '#000'}}>
      {half('img/s6_boycall.png', 'center 22%', 0, L(1.04, 1.12, P(t, a, SC.call.end)), !amTalk)}
      {half('img/s6_ammi.png', 'center 26%', 960, L(1.04, 1.14, P(t, a, SC.call.end)) + (amTalk ? Math.abs(Math.sin(t * 9)) * 0.012 : 0), !hTalk)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 930, height: 60, background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: INTER, fontWeight: 900, fontSize: 36, color: '#fff'}}>📞</div>
      <FailStamp t={t} k="a4" n={4} />
    </AbsoluteFill>
  );
};

export const Bench: React.FC<S> = ({t}) => (
  <AbsoluteFill>
    <Shot src="img/s7_bench.png" t={t} a={SC.bench.start} b={SC.bench.end} s0={1.02} s1={1.16} fx={500} fy={1250} filter="saturate(0.65) brightness(0.9)" />
    <Rain t={t} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 760px 1100px at 50% 60%, transparent 40%, rgba(0,0,0,.65) 100%)'}} />
  </AbsoluteFill>
);

export const App: React.FC<S> = ({t}) => {
  const a = SC.app.start, tap = EV.tap, matchAt = EV.match;
  const ph = eo5(P(t, a, a + 0.4));
  const matching = t >= tap + 0.1 && t < matchAt, matched = t >= matchAt;
  const mp = eo5(P(t, matchAt, matchAt + 0.35));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 1100px at 50% 45%, ${C.cream} 0%, ${C.creamDeep} 55%, #fed7aa 100%)`}}>
      <div style={{position: 'absolute', left: 190, top: 150, width: 700, height: 1180, borderRadius: 90, background: '#0f1115', padding: 20, boxShadow: '0 60px 100px -50px rgba(124,45,18,.6)', transform: `translateY(${(1 - ph) * 900}px)`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 72, background: '#fff', overflow: 'hidden', fontFamily: INTER}}>
          <div style={{position: 'absolute', top: 20, left: '50%', width: 190, height: 44, marginLeft: -95, borderRadius: 99, background: '#0f1115'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '96px 34px 18px'}}>
            <Logo size={110} />
            <div style={{fontWeight: 900, fontSize: 40, color: C.ink}}>MealMates</div>
          </div>
          <div style={{padding: '0 30px', opacity: matched ? 0 : 1}}>
            {[['🍕', 'Pizza Deal for 2', true], ['🍔', 'Burger Deal for 2', false], ['🍗', 'Karahi Deal for 2', false]].map(([e, n, hi], i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: 18, borderRadius: 22, marginBottom: 14, border: `3px solid ${hi && t >= tap ? C.orange : '#f1e6da'}`, background: hi && t >= tap ? C.cream : '#fff'}}>
                <div style={{width: 84, height: 84, borderRadius: 18, background: C.creamDeep, display: 'grid', placeItems: 'center', fontSize: 50}}>{e as string}</div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 900, fontSize: 32, color: C.ink}}>{n as string}</div>
                  <div style={{fontWeight: 700, fontSize: 24, color: C.ink2}}>Split & Save · 50% off for both</div>
                </div>
              </div>
            ))}
            <div style={{marginTop: 10, textAlign: 'center', borderRadius: 999, padding: '22px 0', fontWeight: 900, fontSize: 34, color: '#fff', background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, transform: `scale(${1 - 0.05 * Math.sin(Math.PI * P(t, tap - 0.1, tap + 0.15))})`}}>Find a food buddy</div>
          </div>
          {matching ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: 260, bottom: 0, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80}}>
              <div style={{position: 'relative', width: 380, height: 380}}>
                {[0, 1, 2].map((i) => {
                  const r = ((t - tap) * 1.1 + i / 3) % 1;
                  return <div key={i} style={{position: 'absolute', left: 190 - 190 * r, top: 190 - 190 * r, width: 380 * r, height: 380 * r, borderRadius: 999, border: `5px solid ${C.orange}`, opacity: 1 - r}} />;
                })}
                <div style={{position: 'absolute', left: 140, top: 140, width: 100, height: 100, borderRadius: 99, background: `linear-gradient(135deg, ${C.orange}, ${C.amber})`, display: 'grid', placeItems: 'center', fontSize: 50}}>🍕</div>
              </div>
              <div style={{fontWeight: 900, fontSize: 40, color: C.ink, marginTop: 30}}>Matching…</div>
            </div>
          ) : null}
          {matched ? (
            <div style={{position: 'absolute', left: 30, right: 30, top: 300, opacity: mp, transform: `translateY(${(1 - mp) * 60}px) scale(${L(0.9, 1, clamp(spr(t, matchAt), 0, 1.2))})`}}>
              <div style={{borderRadius: 34, padding: '34px 30px', background: `linear-gradient(160deg, ${C.cream}, #fff)`, border: `3px solid ${C.orange}`, textAlign: 'center'}}>
                <div style={{position: 'relative', width: 200, height: 200, margin: '0 auto', borderRadius: 999, overflow: 'hidden', border: `8px solid ${C.amberLight}`, background: '#ddd'}}>
                  <Img src={staticFile('img/ref_bilal.png')} style={{position: 'absolute', left: -208, top: -56, width: 600, height: 900}} />
                </div>
                <div style={{fontWeight: 900, fontSize: 46, color: C.ink, marginTop: 20}}>Found your food buddy! 🤝</div>
                <div style={{fontWeight: 800, fontSize: 32, color: C.orangeDeep, marginTop: 8}}>Bilal · 1.2 km</div>
                <div style={{marginTop: 22, borderRadius: 999, padding: '20px 0', fontWeight: 900, fontSize: 32, color: '#fff', background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`}}>Start Chat</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {matched ? <Confetti t={t} at={matchAt} /> : null}
    </AbsoluteFill>
  );
};
const Confetti: React.FC<{t: number; at: number}> = ({t, at}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {Array.from({length: 46}).map((_, i) => {
      const k = t - at; if (k > 2) return null;
      const ang = (i / 46) * Math.PI * 2, sp = 500 + (i % 7) * 90;
      return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(ang) * sp * k, top: 760 + Math.sin(ang) * sp * k + 900 * k * k, width: 18, height: 10, background: [C.orange, C.amberLight, C.green, C.logoRed][i % 4], transform: `rotate(${i * 40 + k * 600}deg)`, opacity: 1 - k / 2}} />;
    })}
  </AbsoluteFill>
);

export const Table: React.FC<S> = ({t}) => {
  const a = SC.table.start;
  const h = LN.h5.start;
  const nod = t > h ? Math.sin((t - h) * 14) * 10 * Math.exp(-(t - h) * 1.5) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateY(${nod}px)`}}>
        <Shot src="img/s8_table.png" t={t} a={a} b={SC.table.end} s0={1.04} s1={1.16} fx={540} fy={860} />
      </AbsoluteFill>
      <div style={{position: 'absolute', right: 40, top: 1000, width: 300, height: 300, borderRadius: 999, overflow: 'hidden', border: `8px solid ${C.amberLight}`, boxShadow: '0 20px 40px -16px rgba(0,0,0,.6)', ...pop(t, LN.p2.start - 0.15, 6, 0.4), opacity: t > LN.p2.end + 0.6 ? 1 - P(t, LN.p2.end + 0.6, LN.p2.end + 0.9) : clamp((t - LN.p2.start + 0.15) / 0.1)}}>
        <div style={{position: 'absolute', left: -61, top: -209, width: 1080, height: 1920, transform: 'scale(0.39)', transformOrigin: '0 0'}}>
          <Img src={staticFile('img/s2_pizza.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
          <PizzaMouth t={t} x={540} y={1060} w={250} />
        </div>
      </div>
      {t >= EV.save - 0.05 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', ...pop(t, wt('n5', 'fifty') - 0.05, -3, 0.4)}}>
          <span style={{display: 'inline-block', background: C.green, color: '#fff', fontFamily: INTER, fontWeight: 900, fontSize: 80, padding: '14px 36px', borderRadius: 26, boxShadow: '0 20px 40px -16px rgba(0,0,0,.5)', border: '5px solid #fff'}}>50% OFF FOR BOTH!</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const End: React.FC<S> = ({t}) => {
  const a = SC.end.start;
  const n6 = LN.n6.words, n7 = LN.n7;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={staticFile('img/s8_table.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover', filter: 'blur(14px) brightness(.8)', transform: 'scale(1.1)'}} />
      <AbsoluteFill style={{background: `linear-gradient(170deg, rgba(249,115,22,.92) 0%, rgba(234,88,12,.9) 50%, rgba(245,158,11,.92) 100%)`}} />
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.14) 2px, transparent 2.6px)', backgroundSize: '34px 34px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 200, display: 'flex', justifyContent: 'center', ...pop(t, a + 0.05, 0, 0.6)}}>
        <div style={{background: '#fff', borderRadius: 40, padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 30px 60px -30px rgba(0,0,0,.5)'}}>
          <Logo size={190} />
          <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 72, color: C.ink, letterSpacing: '-0.03em'}}>MealMates</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 520, textAlign: 'center'}}>
        {[n6.slice(0, 4), n6.slice(4)].map((row, r) => (
          <div key={r} style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 20px', marginTop: r ? 10 : 0}}>
            {row.map((w, i) => (
              <span key={i} style={{...pop(t, w.t0 - 0.05, 0, 0.3), display: 'inline-block'}}>
                <Outline size={r ? 82 : 112} color={r ? C.amberLight : '#fff'} stroke={C.ink}>{w.w}</Outline>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 940, textAlign: 'center', ...pop(t, n7.start - 0.05, 0, 0.6)}}>
        <span style={{display: 'inline-block', background: '#fff', color: C.orangeDeep, fontFamily: INTER, fontWeight: 900, fontSize: 66, padding: '24px 54px', borderRadius: 999, boxShadow: '0 24px 50px -20px rgba(0,0,0,.5)', transform: `scale(${1 + 0.04 * Math.sin(Math.max(0, t - n7.end) * 6)})`}}>Waitlist join karo →</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1110, textAlign: 'center', ...pop(t, wt('n7', 'mealmatesapp') - 0.05, 0, 0.6)}}>
        <span style={{fontFamily: INTER, fontWeight: 900, fontSize: 72, color: '#fff', letterSpacing: '-0.02em', textShadow: '0 6px 20px rgba(0,0,0,.3)'}}>mealmatesapp.com</span>
      </div>
    </AbsoluteFill>
  );
};

// ======================= MAIN =======================
const VIEW: Record<string, React.FC<S>> = {hook: Hook, pizza: Pizza, waiter: Waiter, cat: Cat, mirror: Mirror, call: Call, bench: Bench, app: App, table: Table, end: End};
export const Main2: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cur = SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
  const View = VIEW[cur.id];
  const hunt = ['waiter', 'cat', 'mirror', 'call'].includes(cur.id);
  const kinetic = cur.id === 'hook' || cur.id === 'end';
  const dip = P(t, SC.bench.start - 0.25, SC.bench.start) * (1 - P(t, SC.bench.start, SC.bench.start + 0.35));
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <View t={t} />
      {hunt ? <Hearts t={t} /> : null}
      {!kinetic ? <SpeechCard t={t} top={cur.id === 'app' ? 1390 : 1400} /> : null}
      <Burst t={t} at={SC.pizza.start} />
      <AbsoluteFill style={{background: '#000', opacity: dip, pointerEvents: 'none'}} />
      <Burst t={t} at={SC.app.start} color={C.amber} />
      <Burst t={t} at={SC.end.start} />
    </AbsoluteFill>
  );
};
export const _u = [eo5, ei];
