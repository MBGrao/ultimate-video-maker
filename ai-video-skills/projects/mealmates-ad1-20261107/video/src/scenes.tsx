import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ANTON, BUB, C, INTER, L, LN, P, SC, clamp, ei, eio, eo, eo5, mouthAt, pop, spr, wt} from './brand';
import {Bubble, Failed, Logo, Outline, PizzaMouth, Rain, Shot, whip} from './parts';

type S = {t: number};

// ============ HOOK: crash zoom into the "DEAL FOR 2" board ============
export const Hook: React.FC<S> = ({t}) => {
  const z = eio(P(t, 0.22, 0.62));
  const s = L(1, 1.5, z);
  const shake = t > 0.55 && t < 1.0 ? (1 - P(t, 0.55, 1.0)) * 10 : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '894px 380px', transform: `translate(${L(0, -232, z) + Math.sin(t * 61) * shake * 0.6}px, ${L(0, 180, z) + Math.cos(t * 53) * shake * 0.6}px) scale(${s})`}}>
        <Img src={staticFile('img/s1_menu.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
        {/* the board's blank yellow panel, now with the deal */}
        <div style={{position: 'absolute', left: 690, top: 150, width: 420, textAlign: 'center', fontFamily: ANTON, color: C.red, lineHeight: 0.92, transform: 'rotate(-1deg)', textShadow: '0 2px 0 rgba(255,255,255,.4)'}}>
          <div style={{fontSize: 150}}>DEAL</div>
          <div style={{fontSize: 118}}>FOR 2</div>
          <div style={{display: 'inline-block', marginTop: 14, fontFamily: INTER, fontWeight: 900, fontSize: 40, color: '#fff', background: C.red, padding: '6px 18px', borderRadius: 10}}>2 PERSONS ONLY</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 1150, textAlign: 'center'}}>
        <div style={{...pop(t, 0.12, -2, 0.6)}}>
          <Outline size={100}>Jab deal 2 ki ho…</Outline>
        </div>
        <div style={{...pop(t, 0.95, 2, 0.6), marginTop: 16}}>
          <Outline size={112} color={C.amberLight}>…aur aap 1 ho</Outline>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ PIZZA talks ============
export const Pizza: React.FC<S> = ({t}) => {
  const o = mouthAt(t);
  const sq = 1 + 0.025 * o;
  return (
    <>
      <Shot src="img/s2_pizza.png" t={t} a={SC.pizza.start} b={SC.pizza.end} s0={1.06} s1={1.16} fx={540} fy={900}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '540px 920px', transform: `scaleY(${sq}) scaleX(${2 - sq})`}}>
          <PizzaMouth t={t} x={540} y={1060} w={250} />
        </div>
      </Shot>
      <div style={{position: 'absolute', left: 60, top: 230, ...pop(t, SC.pizza.start + 0.1, -3, 0.5)}}>
        <div style={{background: C.amberLight, color: C.ink, fontFamily: INTER, fontWeight: 900, fontSize: 40, padding: '12px 24px', borderRadius: 999}}>🍕 Menu ka pizza</div>
      </div>
    </>
  );
};

// ============ MONTAGE: waiter / cat / mirror ============
const Attempt: React.FC<{t: number; id: string; src: string; n: number; ask: string; fx: number; fy: number; dx?: number}> = ({t, id, src, n, ask, fx, fy, dx = 0}) => {
  const a = SC[id].start, b = SC[id].end;
  return (
    <AbsoluteFill style={whip(t, a)}>
      <Shot src={src} t={t} a={a} b={b} s0={1.05} s1={1.18} fx={fx} fy={fy} dx={dx} />
      <Bubble t={t} at={a + 0.04} text={ask} who="Hamza" x={60} y={1430} />
      <Failed t={t} at={a + 0.5} n={n} />
      <div style={{position: 'absolute', right: 50, top: 160, fontFamily: ANTON, fontSize: 52, color: '#fff', textShadow: '0 3px 12px rgba(0,0,0,.6)'}}>{n}/4</div>
    </AbsoluteFill>
  );
};
export const Waiter: React.FC<S> = ({t}) => <Attempt t={t} id="waiter" src="img/s3_waiter.png" n={1} ask="Bhai, pizza share karo ge? 🍕" fx={480} fy={640} />;
export const Cat: React.FC<S> = ({t}) => <Attempt t={t} id="cat" src="img/s4_cat.png" n={2} ask="Billo, pizza? 🥺" fx={600} fy={900} dx={-70} />;
export const Mirror: React.FC<S> = ({t}) => <Attempt t={t} id="mirror" src="img/s5_mirror.png" n={3} ask="Tu hi aa ja yaar… 🥲" fx={700} fy={700} />;

// ============ CALL: Ammi ============
export const Call: React.FC<S> = ({t}) => {
  const a = SC.call.start;
  const fail = wt('ammi', 'nahi');
  const half = (src: string, pos: string, top: number, s: number): React.ReactNode => (
    <div style={{position: 'absolute', left: 0, top, width: 1080, height: 960, overflow: 'hidden'}}>
      <Img src={staticFile(src)} style={{width: 1080, height: 960, objectFit: 'cover', objectPosition: pos, transform: `scale(${s})`}} />
    </div>
  );
  const talk = t >= LN.ammi.start && t < LN.ammi.end ? Math.abs(Math.sin(t * 9)) * 0.012 : 0;
  return (
    <AbsoluteFill style={{...whip(t, a), background: '#000'}}>
      {half('img/s6_boycall.png', 'center 22%', 0, L(1.04, 1.12, P(t, a, SC.call.end)))}
      {half('img/s6_ammi.png', 'center 26%', 960, L(1.04, 1.14, P(t, a, SC.call.end)) + talk)}
      <div style={{position: 'absolute', left: 0, right: 0, top: 930, height: 60, background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: INTER, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: '0.04em'}}>
        📞 {t < LN.ammi.start ? 'CALLING AMMI…' : 'AMMI · 00:0' + Math.min(9, Math.floor(t - LN.ammi.start + 1))}
      </div>
      <Bubble t={t} at={a + 0.15} text="Ammi, pizza? 🥺" who="Hamza" x={60} y={560} />
      <Failed t={t} at={fail} n={4} />
    </AbsoluteFill>
  );
};

// ============ BENCH: when all hope is gone (slow motion + rain) ============
export const Bench: React.FC<S> = ({t}) => {
  const a = SC.bench.start;
  return (
    <AbsoluteFill>
      <Shot src="img/s7_bench.png" t={t} a={a} b={SC.bench.end} s0={1.02} s1={1.14} fx={500} fy={1250} filter="saturate(0.72) brightness(0.92)" />
      <Rain t={t} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 760px 1100px at 50% 60%, transparent 40%, rgba(0,0,0,.6) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: eo(P(t, a + 0.3, a + 0.9)), fontFamily: INTER, fontWeight: 800, fontSize: 30, letterSpacing: '0.4em', color: 'rgba(255,255,255,.8)'}}>SLOW MOTION · 0.25x</div>
    </AbsoluteFill>
  );
};

// ============ APP: MealMates kholo (screens in the site's own style and copy) ============
export const App: React.FC<S> = ({t}) => {
  const a = SC.app.start;
  const ph = eo5(P(t, a, a + 0.4));
  const tap = a + 0.65;
  const matchAt = a + 1.75;
  const matching = t >= tap + 0.1 && t < matchAt;
  const matched = t >= matchAt;
  const mp = eo5(P(t, matchAt, matchAt + 0.35));
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 900px 1100px at 50% 45%, ${C.cream} 0%, ${C.creamDeep} 55%, #fed7aa 100%)`}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', ...pop(t, a + 0.1, 0, 0.7)}}>
        <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 84, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1}}>
          Match <span style={{color: C.orangeDeep}}>seconds</span> mein ⚡
        </div>
        <div style={{fontFamily: INTER, fontWeight: 700, fontSize: 32, color: C.ink2, marginTop: 10}}>Get matched within seconds · mealmatesapp.com</div>
      </div>
      <div style={{position: 'absolute', left: 190, top: 430, width: 700, height: 1180, borderRadius: 90, background: '#0f1115', padding: 20, boxShadow: '0 60px 100px -50px rgba(124,45,18,.6)', transform: `translateY(${(1 - ph) * 900}px)`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 72, background: '#fff', overflow: 'hidden', fontFamily: INTER}}>
          <div style={{position: 'absolute', top: 20, left: '50%', width: 190, height: 44, marginLeft: -95, borderRadius: 99, background: '#0f1115'}} />
          <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '96px 34px 18px'}}>
            <Logo size={110} />
            <div style={{fontWeight: 900, fontSize: 40, color: C.ink}}>MealMates</div>
          </div>
          {/* deals list */}
          <div style={{padding: '0 30px', opacity: matched ? 0 : 1}}>
            <div style={{fontWeight: 800, fontSize: 30, color: C.ink2, marginBottom: 14}}>Deals near you</div>
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
          {/* matching radar */}
          {matching ? (
            <div style={{position: 'absolute', left: 0, right: 0, top: 260, bottom: 0, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 80}}>
              <div style={{position: 'relative', width: 380, height: 380}}>
                {[0, 1, 2].map((i) => {
                  const r = ((t - tap) * 0.9 + i / 3) % 1;
                  return <div key={i} style={{position: 'absolute', left: 190 - 190 * r, top: 190 - 190 * r, width: 380 * r, height: 380 * r, borderRadius: 999, border: `5px solid ${C.orange}`, opacity: 1 - r}} />;
                })}
                <div style={{position: 'absolute', left: 140, top: 140, width: 100, height: 100, borderRadius: 99, background: `linear-gradient(135deg, ${C.orange}, ${C.amber})`, display: 'grid', placeItems: 'center', fontSize: 50}}>🍕</div>
              </div>
              <div style={{fontWeight: 900, fontSize: 40, color: C.ink, marginTop: 30}}>Matching…</div>
            </div>
          ) : null}
          {/* matched: the site's "Found your food buddy!" card */}
          {matched ? (
            <div style={{position: 'absolute', left: 30, right: 30, top: 300, opacity: mp, transform: `translateY(${(1 - mp) * 60}px) scale(${L(0.9, 1, clamp(spr(t, matchAt), 0, 1.2))})`}}>
              <div style={{borderRadius: 34, padding: '34px 30px', background: `linear-gradient(160deg, ${C.cream}, #fff)`, border: `3px solid ${C.orange}`, textAlign: 'center', boxShadow: '0 30px 60px -30px rgba(234,88,12,.5)'}}>
                <div style={{position: 'relative', width: 200, height: 200, margin: '0 auto', borderRadius: 999, overflow: 'hidden', border: `8px solid ${C.amberLight}`, background: '#ddd'}}>
                  <Img src={staticFile('img/ref_bilal.png')} style={{position: 'absolute', left: -208, top: -56, width: 600, height: 900}} />
                </div>
                <div style={{fontWeight: 900, fontSize: 46, color: C.ink, marginTop: 20}}>Found your food buddy! 🤝</div>
                <div style={{fontWeight: 800, fontSize: 32, color: C.orangeDeep, marginTop: 8}}>Bilal · 1.2 km</div>
                <div style={{fontWeight: 700, fontSize: 28, color: C.ink2, marginTop: 6}}>Also wants the Pizza Deal for 2</div>
                <div style={{marginTop: 22, borderRadius: 999, padding: '20px 0', fontWeight: 900, fontSize: 32, color: '#fff', background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`}}>Start Chat</div>
              </div>
            </div>
          ) : null}
        </div>
        {/* tap */}
        {t > tap - 0.15 && t < tap + 0.35 ? (
          <div style={{position: 'absolute', left: 350 - 40, top: 960 - 40, width: 80, height: 80, borderRadius: 99, border: `5px solid ${C.orange}`, background: 'rgba(255,255,255,.6)', opacity: 1 - P(t, tap, tap + 0.35), transform: `scale(${L(0.6, 1.5, eo(P(t, tap - 0.15, tap + 0.35)))})`}} />
        ) : null}
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
      const x = 540 + Math.cos(ang) * sp * k, y = 900 + Math.sin(ang) * sp * k + 900 * k * k;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 18, height: 10, background: [C.orange, C.amberLight, C.green, C.logoRed][i % 4], transform: `rotate(${i * 40 + k * 600}deg)`, opacity: 1 - k / 2}} />;
    })}
  </AbsoluteFill>
);

// ============ TABLE: bill aadha aadha ============
export const Table: React.FC<S> = ({t}) => {
  const a = SC.table.start;
  const nod = t > BUB.aadha + 0.2 ? Math.sin((t - BUB.aadha) * 14) * 10 * Math.exp(-(t - BUB.aadha) * 1.5) : 0;
  const save = LN.pizza2.start + 0.5;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateY(${nod}px)`}}>
        <Shot src="img/s8_table.png" t={t} a={a} b={SC.table.end} s0={1.04} s1={1.14} fx={540} fy={900} />
      </AbsoluteFill>
      {/* the pizza is back, in the corner */}
      <div style={{position: 'absolute', right: 40, top: 1090, width: 300, height: 300, borderRadius: 999, overflow: 'hidden', border: `8px solid ${C.amberLight}`, boxShadow: '0 20px 40px -16px rgba(0,0,0,.6)', ...pop(t, LN.pizza2.start - 0.15, 6, 0.4)}}>
        <div style={{position: 'absolute', left: -61, top: -209, width: 1080, height: 1920, transform: 'scale(0.39)', transformOrigin: '0 0'}}>
          <Img src={staticFile('img/s2_pizza.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
          <PizzaMouth t={t} x={540} y={1060} w={250} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 165, textAlign: 'center', ...pop(t, save, -3, 0.5)}}>
        <span style={{display: 'inline-block', background: C.green, color: '#fff', fontFamily: INTER, fontWeight: 900, fontSize: 70, padding: '14px 34px', borderRadius: 24, boxShadow: '0 20px 40px -16px rgba(0,0,0,.5)'}}>50% off for both!</span>
      </div>
      <Bubble t={t} at={BUB.bill} text="Bill? 🤔" who="Bilal" side="right" x={700} y={800} color="#fff" />
      <Bubble t={t} at={BUB.aadha} text="Aadha aadha. ✌️" who="Hamza" x={50} y={900} color={C.amberLight} />
    </AbsoluteFill>
  );
};

// ============ END CARD ============
export const End: React.FC<S> = ({t}) => {
  const a = SC.end.start;
  const v3 = LN.vo3, v4 = LN.vo4;
  return (
    <AbsoluteFill style={{background: `linear-gradient(165deg, ${C.orange} 0%, ${C.orangeDeep} 45%, ${C.amber} 100%)`}}>
      <AbsoluteFill style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.14) 2px, transparent 2.6px)', backgroundSize: '34px 34px'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', justifyContent: 'center', ...pop(t, a + 0.05, 0, 0.6)}}>
        <div style={{background: '#fff', borderRadius: 40, padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 30px 60px -30px rgba(0,0,0,.5)'}}>
          <Logo size={190} />
          <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 72, color: C.ink, letterSpacing: '-0.03em'}}>MealMates</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 60, right: 60, top: 560, textAlign: 'center'}}>
        <div style={{...pop(t, v3.start - 0.05, -2, 0.6)}}>
          <Outline size={118} stroke={C.ink}>Deal 2 ki hai.</Outline>
        </div>
        <div style={{...pop(t, wt('vo3', 'dost') - 0.05, 2, 0.6), marginTop: 12}}>
          <Outline size={104} color={C.amberLight} stroke={C.ink}>Dost hum de dein ge.</Outline>
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', ...pop(t, v4.start - 0.05, 0, 0.6)}}>
        <span style={{display: 'inline-block', background: '#fff', color: C.orangeDeep, fontFamily: INTER, fontWeight: 900, fontSize: 66, padding: '24px 54px', borderRadius: 999, boxShadow: '0 24px 50px -20px rgba(0,0,0,.5)', transform: `scale(${1 + 0.04 * Math.sin(Math.max(0, t - v4.end) * 6)})`}}>Waitlist join karo →</span>
        <div style={{fontFamily: INTER, fontWeight: 900, fontSize: 60, color: '#fff', marginTop: 30, letterSpacing: '-0.02em'}}>mealmatesapp.com</div>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 24, background: 'rgba(255,255,255,.22)', border: '2px solid rgba(255,255,255,.5)', borderRadius: 999, padding: '12px 26px', fontFamily: INTER, fontWeight: 800, fontSize: 32, color: '#fff'}}>
          <span style={{width: 16, height: 16, borderRadius: 99, background: '#fff', opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 3))}} /> Launching soon · Lahore · Multan
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const _u = [ei, eio, ANTON];
