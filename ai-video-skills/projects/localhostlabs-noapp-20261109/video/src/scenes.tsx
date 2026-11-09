import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, EV, FPS, HAND, HEAD, L, LN, MONO, P, SANS, SC, SCENES, SERIF, clamp, ei, eio, eo, eo5, pop, spr} from './brand';
import {Captions, Chip, Grid, Head, Logo, ROWS, Rise, Sheet, Stamp, Term, TopBar} from './ui';

type S = {t: number};
const F = 1 / FPS;

// ======================= HOOK: every client walks in saying "I need an app." =======================
const MSGS: [string, string, string][] = [
  ['Can you build us an app?', 'Retail store', '#f59e0b'],
  ['We need an app like Uber 🚖', 'Startup founder', '#6366f1'],
  ['I need an app for my shop', 'Shop owner', '#ef4444'],
  ['How much for an app?', 'Clinic', '#06b6d4'],
  ['Our competitor has an app 😬', 'Restaurant', '#a855f7'],
  ['Just a simple app, like Instagram', 'Agency', '#10b981'],
  ['App for my school?', 'Principal', '#f97316'],
  ['We want an app. Budget is small 🙏', 'Bakery', '#ec4899'],
];
const MsgCard: React.FC<{m: [string, string, string]; w?: number}> = ({m, w = 470}) => (
  <div style={{width: w, background: C.white, borderRadius: 28, padding: '18px 22px', boxShadow: '0 30px 50px -30px rgba(0,0,0,.7)'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8}}>
      <div style={{width: 40, height: 40, borderRadius: 99, background: m[2], color: '#fff', display: 'grid', placeItems: 'center', fontFamily: HEAD, fontWeight: 800, fontSize: 18}}>{m[1][0]}</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.ink2}}>{m[1]}</div>
      <div style={{marginLeft: 'auto', fontFamily: MONO, fontWeight: 600, fontSize: 18, color: C.ink3}}>now</div>
    </div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: C.ink, lineHeight: 1.2}}>{m[0]}</div>
  </div>
);
/** the inbox of "I need an app" messages drifting up behind everything (moving from the first frame) */
const Inbox: React.FC<S & {dim?: number}> = ({t, dim = 0}) => (
  <AbsoluteFill style={{opacity: L(0.55, 0.18, dim), filter: `blur(${L(1.2, 7, dim)}px)`}}>
    {MSGS.map((m, i) => {
      const col = i % 2, y = 260 + Math.floor(i / 2) * 400 + col * 200 - t * 140;
      return (
        <div key={i} style={{position: 'absolute', left: col ? 560 : 50, top: ((y + 2400) % 1900) - 140, transform: `rotate(${col ? 3 : -3}deg)`}}>
          <MsgCard m={m} />
        </div>
      );
    })}
  </AbsoluteFill>
);
/** "I NEED / AN APP." slam text (shared by the hook and the contradiction beat) */
const BigClaim: React.FC<S & {at: number}> = ({t, at}) => {
  const p = P(t, at - 0.02, at + 0.12);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', transform: `scale(${L(1.9, 1, eo(p))})`, opacity: clamp(p * 4)}}>
      <Head size={190} color={C.white} style={{textShadow: '0 20px 60px rgba(0,0,0,.6)'}}>I NEED</Head>
      <Head size={190} color={C.white} style={{marginTop: 18, textShadow: '0 20px 60px rgba(0,0,0,.6)'}}>
        AN <span style={{color: C.red}}>APP.</span>
      </Head>
    </div>
  );
};
const Hook: React.FC<S> = ({t}) => {
  const app = EV.app;
  const punch = eo(P(t, app - 4 * F, app));
  const dim = eo(P(t, app, app + 0.15));
  return (
    <AbsoluteFill>
      <Term />
      <AbsoluteFill style={{transformOrigin: '540px 900px', transform: `scale(${L(1, 1.25, punch)})`}}>
        <Inbox t={t} dim={dim} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', opacity: 1 - dim}}>
          <Chip bg={C.term} color={C.termDim} size={26} style={{border: '2px solid rgba(233,242,234,.15)'}}>EVERY CLIENT. EVERY WEEK.</Chip>
        </div>
        <div style={{position: 'absolute', left: 120, top: 760 + Math.sin(t * 2.4) * 8, opacity: 1 - dim * 0.8, filter: `blur(${dim * 6}px)`, transform: `rotate(${-2 + Math.sin(t * 1.7)}deg) scale(${1 + 0.02 * Math.sin(t * 3)})`}}>
          <div style={{width: 840, background: C.white, borderRadius: 44, padding: '30px 38px 38px', boxShadow: '0 60px 100px -40px rgba(0,0,0,.85)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
              <div style={{width: 64, height: 64, borderRadius: 99, background: C.red, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: HEAD, fontWeight: 800, fontSize: 28}}>NC</div>
              <div>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.ink}}>New client</div>
                <div style={{fontFamily: MONO, fontWeight: 600, fontSize: 20, color: C.ink3}}>just now · 1 new message</div>
              </div>
            </div>
            <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 92, color: C.ink, letterSpacing: '-0.035em', lineHeight: 1}}>I need an app.</div>
          </div>
        </div>
      </AbsoluteFill>
      <BigClaim t={t} at={app} />
    </AbsoluteFill>
  );
};

// ======================= CONTRADICT: crossed out, then a blade slice reveals the sheet =======================
const Con: React.FC<S> = ({t}) => {
  const s = EV.slice;
  const cut = ei(P(t, s, s + 0.22)), cutB = ei(P(t, s + 0.03, s + 0.27));
  const strike = (at: number) => eo(P(t, at, at + 5 * F));
  // the cut: a line through the middle, rotated ~20°
  const yl = 960 + 540 * Math.tan((20 * Math.PI) / 180), yr = 960 - 540 * Math.tan((20 * Math.PI) / 180);
  const old = (
    <AbsoluteFill>
      <Term />
      <Inbox t={t} dim={1} />
      <BigClaim t={t} at={-1} />
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', left: 90, top: 690 + i * 190, width: 900 * strike(EV.dont + i * 3 * F), height: 26, background: C.red, borderRadius: 8, transform: `rotate(${i ? 2 : -3}deg)`, transformOrigin: '0 50%', boxShadow: '0 6px 20px rgba(0,0,0,.4)'}} />
      ))}
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill>
      {/* revealed underneath: the sheet that updates itself */}
      <AbsoluteFill>
        <Grid />
        <div style={{position: 'absolute', left: 60, top: 290}}>
          <Head size={124}>You need</Head>
          <Head size={124} color={C.green} style={{marginTop: 10}}>automation.</Head>
        </div>
        <div style={{position: 'absolute', left: 60, top: 600, transform: `scale(${L(1.06, 1, eo(P(t, s, s + 0.6)))})`, transformOrigin: '50% 0'}}>
          <Sheet t={t} title="orders.xlsx" fill={(i) => P(t, s + 0.15 + i * 0.2, s + 0.15 + i * 0.2 + 0.3)} rows={10} />
        </div>
      </AbsoluteFill>
      {t < s + 0.3 ? (
        <>
          <AbsoluteFill style={{clipPath: `polygon(0 0, 1080px 0, 1080px ${yr}px, 0 ${yl}px)`, transform: `translate(${-820 * cut}px, ${-560 * cut}px) rotate(${-5 * cut}deg)`}}>{old}</AbsoluteFill>
          <AbsoluteFill style={{clipPath: `polygon(0 ${yl}px, 1080px ${yr}px, 1080px 1920px, 0 1920px)`, transform: `translate(${820 * cutB}px, ${560 * cutB}px) rotate(${4 * cutB}deg)`}}>{old}</AbsoluteFill>
        </>
      ) : null}
      {/* the blade glint along the cut */}
      {t > s - 0.06 && t < s + 0.16 ? (
        <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
          <line x1={-40} y1={yl + 15} x2={1120} y2={yr - 15} stroke="#fff" strokeWidth={L(16, 2, P(t, s - 0.06, s + 0.16))} strokeLinecap="round" opacity={1 - P(t, s + 0.04, s + 0.16)} style={{filter: 'drop-shadow(0 0 18px #fff)'}} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

// ======================= STAY: three questions, the third is where budgets die =======================
const Stay: React.FC<S> = ({t}) => {
  const third = EV.third, die = EV.die;
  const drain = eio(P(t, EV.where, die));
  const pct = Math.round(100 * (1 - drain));
  const barC = drain < 0.6 ? C.green : drain < 0.9 ? '#f59e0b' : C.red;
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{position: 'absolute', left: 70, top: 300, display: 'flex', alignItems: 'center', gap: 34}}>
        <div style={{...pop(t, EV.c0, -4, 0.3), fontFamily: SERIF, fontSize: 470, lineHeight: 0.8, color: C.red, marginTop: -30}}>3</div>
        <div>
          <Rise t={t} at={EV.questions - 0.08}>
            <Head size={118}>Questions</Head>
          </Rise>
          <Rise t={t} at={EV.tell - 0.08} style={{marginTop: 10}}>
            <div style={{fontFamily: SERIF, fontSize: 92, color: C.ink2, lineHeight: 1}}>to tell.</div>
          </Rise>
        </div>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 700, display: 'flex', gap: 18}}>
        {[1, 2, 3].map((i) => {
          const at = EV.questions + (i - 1) * 0.12;
          const hot = i === 3 && t >= third - 0.05;
          return (
            <div key={i} style={{flex: 1, height: 170, borderRadius: 30, background: hot ? C.redTint : C.white, border: `4px ${hot ? 'solid' : 'dashed'} ${hot ? C.red : 'rgba(17,17,17,.18)'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ...pop(t, at, 0, 0.7), transform: `${pop(t, at, 0, 0.7).transform} scale(${hot ? 1 + 0.08 * Math.max(0, 1 - (t - third) / 0.3) : 1})`}}>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 26, color: hot ? C.red : C.ink3}}>QUESTION {i}</div>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 80, color: hot ? C.red : C.ink, lineHeight: 1}}>?</div>
            </div>
          );
        })}
      </div>
      {t >= third - 0.1 ? (
        <div style={{position: 'absolute', left: 70, right: 70, top: 920, ...pop(t, third - 0.1, 0, 0.85)}}>
          <div style={{background: C.white, borderRadius: 36, padding: '30px 34px', boxShadow: '0 50px 90px -40px rgba(17,17,17,.35)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.ink3, letterSpacing: '0.08em'}}>PROJECT BUDGET</div>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 64, color: barC, letterSpacing: '-0.03em'}}>{pct}%</div>
            </div>
            <div style={{marginTop: 16, height: 46, borderRadius: 99, background: '#eeece6', overflow: 'hidden'}}>
              <div style={{height: '100%', width: `${100 * (1 - drain)}%`, background: barC, borderRadius: 99}} />
            </div>
            <div style={{marginTop: 18, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: t >= die ? C.red : C.ink2}}>{t >= die ? '☠  Question 3. Where budgets die.' : 'Question 3 decides this.'}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ======================= Q1: who uses it? customers → app, team → tool =======================
const Phone: React.FC<{w: number; h: number; children: React.ReactNode}> = ({w, h, children}) => (
  <div style={{width: w, height: h, borderRadius: w * 0.15, background: '#101010', padding: w * 0.03, boxShadow: '0 50px 90px -40px rgba(17,17,17,.6), inset 0 0 0 3px #3a3a3a'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.125, background: '#fff', overflow: 'hidden'}}>
      {children}
      <div style={{position: 'absolute', top: w * 0.03, left: '50%', width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, background: '#101010', borderRadius: 99}} />
    </div>
  </div>
);
const ShopApp: React.FC<S & {tap: number}> = ({t, tap}) => (
  <div style={{padding: '58px 18px 0', fontFamily: SANS}}>
    <div style={{fontWeight: 700, fontSize: 26, color: C.ink}}>Fresh Bakes 🧁</div>
    <div style={{marginTop: 10, height: 38, borderRadius: 12, background: '#f2f1ee', fontSize: 17, color: C.ink3, display: 'flex', alignItems: 'center', padding: '0 12px'}}>Search cakes, cookies…</div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14}}>
      {[['🎂', 'Birthday', '2,400'], ['🥐', 'Croissant', '450'], ['🧁', 'Cupcakes', '1,200'], ['🍪', 'Cookies', '800']].map(([e, n, p], i) => (
        <div key={i} style={{borderRadius: 16, background: ['#fff4e6', '#fdecef', '#eef6ff', '#f0faf3'][i], padding: '12px 10px'}}>
          <div style={{fontSize: 50, textAlign: 'center'}}>{e}</div>
          <div style={{fontWeight: 700, fontSize: 17, color: C.ink, marginTop: 4}}>{n}</div>
          <div style={{fontWeight: 600, fontSize: 15, color: C.ink3}}>Rs {p}</div>
        </div>
      ))}
    </div>
    <div style={{marginTop: 14, borderRadius: 999, background: C.red, color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: 20, padding: '14px 0', transform: `scale(${1 - 0.06 * Math.sin(Math.PI * P(t, tap - 0.1, tap + 0.15))})`}}>Add to cart</div>
  </div>
);
const Dashboard: React.FC<S> = ({t}) => (
  <div style={{width: 940, height: 600, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 50px 90px -40px rgba(0,0,0,.8)', display: 'flex', flexDirection: 'column'}}>
    <div style={{height: 52, background: '#ecebe7', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px'}}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <div key={c} style={{width: 15, height: 15, borderRadius: 99, background: c}} />
      ))}
      <div style={{marginLeft: 14, flex: 1, height: 32, borderRadius: 9, background: '#fff', fontFamily: MONO, fontSize: 18, color: C.ink3, display: 'flex', alignItems: 'center', padding: '0 14px'}}>ops.freshbakes.internal</div>
    </div>
    <div style={{flex: 1, display: 'flex'}}>
      <div style={{width: 200, background: C.term2, padding: '22px 16px', fontFamily: SANS, fontWeight: 600, fontSize: 22, color: C.termDim}}>
        {['Orders', 'Stock', 'Reports', 'Staff'].map((x, i) => (
          <div key={x} style={{padding: '12px 14px', borderRadius: 12, marginBottom: 6, background: i === 0 ? 'rgba(0,194,122,.18)' : 'transparent', color: i === 0 ? C.green : C.termDim}}>{x}</div>
        ))}
      </div>
      <div style={{flex: 1, padding: 22, fontFamily: SANS}}>
        <div style={{display: 'flex', gap: 14}}>
          {[['Orders today', '128', C.ink], ['Low stock', '3', C.red], ['Reports', 'auto ✓', C.greenDeep]].map(([k, v, c]) => (
            <div key={k} style={{flex: 1, borderRadius: 16, background: '#f6f5f1', padding: '14px 16px'}}>
              <div style={{fontWeight: 600, fontSize: 18, color: C.ink3}}>{k}</div>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 40, color: c, letterSpacing: '-0.03em'}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop: 16}}>
          {ROWS.slice(0, 5).map((r, i) => (
            <div key={i} style={{display: 'flex', gap: 14, alignItems: 'center', height: 50, borderBottom: '1.5px solid #f0efea', fontSize: 21, color: C.ink, fontWeight: 600, opacity: 0.4 + 0.6 * clamp((t * 3 - i) % 6)}}>
              <span style={{fontFamily: MONO, color: C.ink3, width: 70}}>{r[0]}</span>
              <span style={{width: 170}}>{r[1]}</span>
              <span style={{flex: 1}}>{r[2]}</span>
              <span style={{fontFamily: MONO, fontSize: 16, fontWeight: 800, color: C.greenDeep, background: C.greenTint, padding: '4px 10px', borderRadius: 99}}>✓</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
const Q1: React.FC<S> = ({t}) => {
  const s = SC.q1.start, team = EV.team;
  const enter = eo5(P(t, s, s + 0.32));
  const go = eio(P(t, team, team + 0.38));
  const top = L(960, 0, go);
  return (
    <AbsoluteFill style={{background: C.term}}>
      {/* top half: customers -> an app */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960, overflow: 'hidden', transform: `translateY(${(1 - enter) * -960 - go * 960}px)`}}>
        <Grid />
        <div style={{position: 'absolute', left: 110, top: 250}}>
          <Phone w={330} h={660}>
            <ShopApp t={t} tap={EV.customers + 0.5} />
          </Phone>
        </div>
        <div style={{position: 'absolute', left: 500, top: 430}}>
          <Rise t={t} at={EV.customers - 0.1}>
            <Head size={84}>Customers</Head>
          </Rise>
          <Rise t={t} at={EV.customers + 0.25} style={{marginTop: 14}}>
            <Head size={84} color={C.red}>→ App</Head>
          </Rise>
          <div style={{marginTop: 22, opacity: eo(P(t, EV.customers + 0.5, EV.customers + 0.8)), fontFamily: SERIF, fontSize: 48, color: C.ink2}}>…maybe.</div>
        </div>
      </div>
      {/* bottom half: your team -> an internal tool; on "team" it takes the whole frame */}
      <div style={{position: 'absolute', left: 0, top, width: 1080, height: 1920 - top, overflow: 'hidden', transform: `translateY(${(1 - enter) * 960}px)`, background: `radial-gradient(ellipse 900px 800px at 50% 45%, #1b2019 0%, ${C.term} 70%)`, borderTop: go < 1 ? '6px solid #000' : 'none'}}>
        <div style={{position: 'absolute', left: 70, top: L(40, 290, go)}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
            <Head size={92} color={C.termInk}>Team</Head>
            <Head size={92} color={C.green}>→ Tool</Head>
          </div>
        </div>
        <div style={{position: 'absolute', left: 70, top: L(170, 470, go), transform: `scale(${L(0.86, 1, go)})`, transformOrigin: '0 0'}}>
          <Dashboard t={t} />
        </div>
        {t >= EV.tool ? (
          <div style={{position: 'absolute', left: 80, top: 1130}}>
            <Stamp t={t} at={EV.tool} color={C.green} bg="rgba(14,15,13,.9)" rot={-5} size={70}>Internal tool ✓</Stamp>
          </div>
        ) : null}
        {t >= EV.store - 0.1 ? (
          <div style={{position: 'absolute', right: 80, top: 1268, ...pop(t, EV.store - 0.1, 4, 0.6)}}>
            <div style={{position: 'relative'}}>
              <Chip bg="#2a2c28" color={C.termDim} size={30}>App Store listing</Chip>
              <div style={{position: 'absolute', left: -6, right: -6, top: '48%', height: 7, background: C.red, borderRadius: 4, transformOrigin: '0 50%', transform: `scaleX(${eo(P(t, EV.listing, EV.listing + 5 * F))}) rotate(-3deg)`}} />
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ======================= Q2: does it repeat? by hand -> 8x -> cloned rows =======================
const ACTIONS = ['📋 Copy orders', '📊 Pull report', '📦 Update stock'];
const Week: React.FC<S> = ({t}) => {
  const a = SC.q2.start + 0.5;
  return (
    <div style={{display: 'flex', gap: 14}}>
      {['MON', 'TUE', 'WED', 'THU', 'FRI'].map((d, i) => (
        <div key={d} style={{width: 180, borderRadius: 24, background: C.white, padding: '16px 10px', boxShadow: '0 30px 60px -36px rgba(17,17,17,.4)', ...pop(t, a + i * 0.32, 0, 0.7)}}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.ink3, textAlign: 'center', marginBottom: 12}}>{d}</div>
          {ACTIONS.map((x, j) => (
            <div key={j} style={{...pop(t, a + i * 0.32 + 0.08 + j * 0.06, 0, 0.6), fontFamily: SANS, fontWeight: 700, fontSize: 19, color: C.ink, background: ['#fff4e6', '#eef6ff', '#f0faf3'][j], borderRadius: 12, padding: '10px 8px', marginBottom: 8, whiteSpace: 'nowrap', textAlign: 'center'}}>{x}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
/** local "recording" time with the speed ramp: 1x, then ramps to 8x over 0.5 s at `ramp` */
const tau = (t: number, a: number, ramp: number) => {
  if (t < ramp) return Math.max(0, t - a);
  const x = t - ramp, base = ramp - a;
  return x < 0.5 ? base + x + 7 * x * x : base + 2.25 + 8 * (x - 0.5);
};
const Cursor: React.FC<{x: number; y: number}> = ({x, y}) => (
  <svg width="46" height="56" viewBox="0 0 23 28" style={{position: 'absolute', left: x, top: y, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.4))'}}>
    <path d="M1 1 L1 22 L6.5 16.8 L10.4 26 L14 24.4 L10.2 15.4 L17.6 15.4 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const Key: React.FC<{k: string}> = ({k}) => (
  <div style={{display: 'flex', gap: 6}}>
    {['Ctrl', k].map((x) => (
      <div key={x} style={{fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.ink, background: '#fff', border: '2px solid #d6d3cb', borderBottomWidth: 5, borderRadius: 10, padding: '6px 12px'}}>{x}</div>
    ))}
  </div>
);
const Manual: React.FC<S> = ({t}) => {
  const a = EV.copying - 0.1, ramp = EV.ramp;
  const T = tau(t, a, ramp), cyc = 1.15, n = Math.floor(T / cyc), ph = (T % cyc) / cyc;
  const fast = clamp((t - ramp) / 0.5);
  const rowsDone = n + (ph > 0.82 ? 1 : 0);
  // cursor path: chat message -> copy -> sheet row -> paste
  const msgY = 160 + (n % 6) * 96, rowY = 200 + Math.min(n, 7) * 66;
  const seg = (u: number, a0: number, a1: number) => eio(P(u, a0, a1));
  const cx = L(L(150, 260, seg(ph, 0, 0.25)), 760, seg(ph, 0.45, 0.75)), cy = L(L(msgY + 70, msgY + 30, seg(ph, 0, 0.25)), rowY + 30, seg(ph, 0.45, 0.75));
  const showKey = ph > 0.28 && ph < 0.45 ? 'C' : ph > 0.76 && ph < 0.95 ? 'V' : '';
  const mins = Math.floor(T * 9);
  return (
    <div style={{position: 'relative', width: 960, height: 780, filter: fast > 0.5 ? `blur(${fast * 1.4}px)` : 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 330, height: 780, borderRadius: 26, overflow: 'hidden', background: '#ece5dd', boxShadow: '0 40px 80px -40px rgba(0,0,0,.5)'}}>
        <div style={{height: 70, background: C.wa, color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 24, display: 'flex', alignItems: 'center', padding: '0 20px'}}>Orders (WhatsApp)</div>
        {Array.from({length: 7}).map((_, i) => {
          const r = ROWS[(i + n) % ROWS.length];
          return (
            <div key={i} style={{margin: '14px 14px 0', background: i === 0 && ph > 0.25 && ph < 0.5 ? '#cfe8ff' : '#fff', borderRadius: 14, padding: '10px 14px', fontFamily: SANS, fontWeight: 600, fontSize: 20, color: C.ink}}>
              {r[1]}: {r[3]}× {r[2]}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 350, top: 0, width: 610, height: 780, borderRadius: 26, overflow: 'hidden', background: '#fff', boxShadow: '0 40px 80px -40px rgba(0,0,0,.5)'}}>
        <div style={{height: 70, background: '#f6f7f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1.5px solid rgba(17,17,17,.08)'}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 24, color: C.ink}}>orders.xlsx</div>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 18, color: C.redDeep, background: C.redTint, padding: '6px 12px', borderRadius: 999}}>✋ BY HAND</div>
        </div>
        {Array.from({length: 8}).map((_, i) => {
          const k = Math.max(0, rowsDone - 8) + i, r = ROWS[k % ROWS.length], on = k < rowsDone;
          return (
            <div key={i} style={{display: 'flex', height: 66, alignItems: 'center', borderBottom: '1.5px solid rgba(17,17,17,.06)', fontFamily: SANS, fontWeight: 600, fontSize: 24, color: C.ink, gap: 14, padding: '0 18px', background: on && k === rowsDone - 1 && fast < 0.5 ? 'rgba(255,77,46,.08)' : 'transparent'}}>
              <span style={{fontFamily: MONO, color: C.ink3, width: 80}}>{on ? r[0] : ''}</span>
              <span style={{width: 150}}>{on ? r[1] : ''}</span>
              <span style={{flex: 1}}>{on ? r[2] : ''}</span>
              <span style={{width: 30}}>{on ? r[3] : ''}</span>
            </div>
          );
        })}
      </div>
      <Cursor x={cx} y={cy} />
      {showKey ? (
        <div style={{position: 'absolute', left: cx + 40, top: cy - 50}}>
          <Key k={showKey} />
        </div>
      ) : null}
      {/* speed ramp read-out + spinning clock */}
      <div style={{position: 'absolute', right: -10, top: -120, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 64, color: fast > 0 ? C.red : C.ink3, letterSpacing: '-0.03em'}}>{fast > 0 ? `${Math.round(L(1, 8, fast))}×` : '1×'} ⏩</div>
        <svg width="110" height="110" viewBox="-55 -55 110 110">
          <circle r="50" fill="#fff" stroke={C.ink} strokeWidth="6" />
          <line x1="0" y1="0" x2="0" y2="-36" stroke={C.red} strokeWidth="5" strokeLinecap="round" transform={`rotate(${T * 360 * 1.5})`} />
          <line x1="0" y1="0" x2="0" y2="-24" stroke={C.ink} strokeWidth="7" strokeLinecap="round" transform={`rotate(${T * 30})`} />
          <circle r="5" fill={C.ink} />
        </svg>
      </div>
      <div style={{position: 'absolute', left: 0, top: -110, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.ink2}}>{`⏱ ${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m spent copying`}</div>
    </div>
  );
};
const Q2: React.FC<S> = ({t}) => {
  const ifT = EV.q2if, auto = EV.auto, cp = EV.copying - 0.1;
  const part = t < cp ? 'week' : t < ifT ? 'manual' : 'auto';
  return (
    <AbsoluteFill>
      <Grid />
      <div style={{position: 'absolute', left: 60, top: 280}}>
        <Rise t={t} at={SC.q2.start + 0.12}>
          <Head size={124}>It repeats?</Head>
        </Rise>
        {t >= auto - 0.08 ? (
          <div style={{marginTop: 12, ...pop(t, auto - 0.08, -2, 0.6), transformOrigin: '0 50%'}}>
            <Head size={124} color={C.green}>Automate it.</Head>
          </div>
        ) : null}
      </div>
      {part === 'week' ? (
        <div style={{position: 'absolute', left: 60, top: 560}}>
          <Week t={t} />
          <div style={{marginTop: 34, fontFamily: SERIF, fontSize: 64, color: C.ink2, opacity: eo(P(t, EV.every - 0.1, EV.every + 0.2))}}>↻ every single day.</div>
        </div>
      ) : part === 'manual' ? (
        <div style={{position: 'absolute', left: 60, top: 640}}>
          <Manual t={t} />
        </div>
      ) : (
        <div style={{position: 'absolute', left: 60, top: 600 + (t >= auto - 0.08 ? 0 : 0)}}>
          <Sheet t={t} title="orders.xlsx" fill={(i) => (t >= ifT + i * 2 * F ? 1 : 0)} from={(i) => -66 * (1 - eo(P(t, ifT + i * 2 * F, ifT + i * 2 * F + 3 * F)))} rows={10} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ======================= Q3: can you draw it on one page? =======================
type Pt = [number, number];
const along = (pts: Pt[], f: number): Pt => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let d = f * segs.reduce((a, b) => a + b, 0);
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i] || i === segs.length - 1) {
      const u = segs[i] ? clamp(d / segs[i]) : 1;
      return [L(pts[i][0], pts[i + 1][0], u), L(pts[i][1], pts[i + 1][1], u)];
    }
    d -= segs[i];
  }
  return pts[pts.length - 1];
};
const box = (x0: number, y0: number, x1: number, y1: number): Pt[] => [[x0 + 6, y0 + 2], [x1 - 4, y0 - 3], [x1 + 2, y1 - 4], [x0 + 2, y1 + 3], [x0 - 2, y0 + 10], [x0 + 22, y0 + 1]];
const arrow = (x: number, y0: number, y1: number): Pt[] => [[x, y0], [x + 3, y1], [x - 16, y1 - 22], [x + 3, y1], [x + 20, y1 - 20]];
type Stroke = {kind: 'line'; pts: Pt[]; a: number; b: number; color?: string; w?: number} | {kind: 'text'; text: string; x: number; y: number; size: number; a: number; b: number; color?: string};
const textW = (s: string, size: number) => s.length * size * 0.42;
const strokes = (): Stroke[] => {
  const d = EV.draw - 0.35;
  const T = (text: string, cx: number, y: number, size: number, a: number, b: number): Stroke => ({kind: 'text', text, x: cx - textW(text, size) / 2, y, size, a, b});
  return [
    {kind: 'text', text: 'Can you draw it', x: 120, y: 420, size: 96, a: d, b: d + 0.42},
    {kind: 'text', text: 'on one page?', x: 120, y: 525, size: 96, a: d + 0.42, b: d + 0.78},
    {kind: 'line', pts: box(200, 600, 880, 720), a: d + 0.8, b: d + 1.0},
    T('Order comes in', 540, 683, 70, d + 1.0, d + 1.2),
    {kind: 'line', pts: arrow(540, 730, 800), a: d + 1.2, b: d + 1.3},
    {kind: 'line', pts: box(200, 810, 880, 930), a: d + 1.3, b: d + 1.5},
    T('Sheet updates', 540, 893, 70, d + 1.5, d + 1.68),
    {kind: 'line', pts: arrow(540, 940, 1010), a: d + 1.68, b: d + 1.78},
    {kind: 'line', pts: box(200, 1020, 880, 1140), a: d + 1.78, b: d + 1.98},
    T('Team gets a ping ✓', 540, 1103, 70, d + 1.98, d + 2.2),
  ];
};
const SCRIBBLE: Pt[] = Array.from({length: 40}).map((_, i) => [540 + Math.sin(i * 1.9) * 300 * (0.5 + 0.5 * Math.sin(i * 0.7)), 1270 + Math.cos(i * 2.3) * 70 + Math.sin(i * 0.5) * 30] as Pt);
const PenTip: React.FC<{x: number; y: number; o: number}> = ({x, y, o}) => (
  <Img src={staticFile('img/pen.png')} style={{position: 'absolute', left: x - 69, top: y - 261, width: 300, height: 300, opacity: o, filter: 'drop-shadow(8px 14px 10px rgba(0,0,0,.35))'}} />
);
/** the desk + the hand-drawn one-page plan. `done` shows the clean finished page (CTA) */
const Page: React.FC<S & {done?: boolean}> = ({t, done}) => {
  const all = strokes();
  const tt = done ? 999 : t;
  const ifT = EV.ifnot, sc0 = ifT + 0.05, sc1 = ifT + 0.55;
  const scribbling = !done && tt >= sc0;
  // where is the pen?
  let pen: Pt | null = null;
  for (const s of all) {
    if (tt >= s.a && tt < s.b) {
      const f = P(tt, s.a, s.b);
      pen = s.kind === 'line' ? along(s.pts, f) : [s.x + textW(s.text, s.size) * f, s.y - s.size * 0.18];
    }
  }
  if (scribbling && tt < sc1) pen = along(SCRIBBLE, P(tt, sc0, sc1));
  const lastEnd = all[all.length - 1].b;
  if (!pen && !done && tt >= all[0].a - 0.3 && tt < sc0) {
    const s = all.find((x) => x.a > tt);
    const prev = [...all].reverse().find((x) => x.b <= tt);
    const endOf = (x: Stroke): Pt => (x.kind === 'line' ? x.pts[x.pts.length - 1] : [x.x + textW(x.text, x.size), x.y - x.size * 0.18]);
    const startOf = (x: Stroke): Pt => (x.kind === 'line' ? x.pts[0] : [x.x, x.y - x.size * 0.18]);
    if (s && prev) pen = (() => { const u = eio(P(tt, prev.b, s.a)); const p0 = endOf(prev), p1 = startOf(s); return [L(p0[0], p1[0], u), L(p0[1], p1[1], u)] as Pt; })();
    else if (s) pen = [L(900, startOf(s)[0], eo(P(tt, s.a - 0.3, s.a))), L(1500, startOf(s)[1], eo(P(tt, s.a - 0.3, s.a)))];
    else pen = (() => { const p0 = endOf(prev!); return [L(p0[0], 900, eio(P(tt, lastEnd, lastEnd + 0.4))), L(p0[1], 1250, eio(P(tt, lastEnd, lastEnd + 0.4)))] as Pt; })();
  }
  const penO = done ? 0 : 1 - P(tt, sc1, sc1 + 0.25);
  return (
    <AbsoluteFill>
      <Img src={staticFile('img/desk.png')} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {all.map((s, i) =>
          s.kind === 'line' ? (
            <path key={i} d={'M ' + s.pts.map((p) => p.join(' ')).join(' L ')} fill="none" stroke={s.color ?? C.marker} strokeWidth={s.w ?? 8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - P(tt, s.a, s.b)} />
          ) : null,
        )}
        {scribbling ? <path d={'M ' + SCRIBBLE.map((p) => p.join(' ')).join(' L ')} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - P(tt, sc0, sc1)} opacity={0.9} /> : null}
      </svg>
      {all.map((s, i) =>
        s.kind === 'text' ? (
          <div key={i} style={{position: 'absolute', left: s.x, top: s.y - s.size * 0.95, fontFamily: HAND, fontWeight: 700, fontSize: s.size, lineHeight: 1.1, color: s.color ?? C.marker, whiteSpace: 'nowrap', clipPath: `inset(-20% ${(1 - P(tt, s.a, s.b)) * 100}% -20% 0)`}}>{s.text}</div>
        ) : null,
      )}
      {!done && t >= EV.build - 0.05 && t < EV.skip ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1210, display: 'flex', justifyContent: 'center'}}>
          <Stamp t={t} at={EV.build - 0.05} rot={-8} size={84}>Don't build yet</Stamp>
        </div>
      ) : null}
      {pen ? <PenTip x={pen[0]} y={pen[1]} o={penO} /> : null}
    </AbsoluteFill>
  );
};
/** the cluttered half-built project, as four layers that explode apart on "explode" */
const Chaos: React.FC<S> = ({t}) => {
  const k = EV.skip, x = EV.explode;
  const ex = eo(P(t, x, x + 10 * F)), drift = Math.max(0, t - x - 10 * F);
  const lay = (i: number, at: number, dx: number, dy: number, rot: number, sc: number, node: React.ReactNode, z: number) => (
    <div style={{position: 'absolute', left: 0, top: 0, zIndex: z, ...(t >= at ? pop(t, at, 0, 0.7) : {opacity: 0})}}>
      <div style={{transform: `translate(${dx * ex + dx * 0.08 * drift}px, ${dy * ex + dy * 0.08 * drift}px) rotate(${rot * ex + rot * 0.1 * drift}deg) scale(${L(1, sc, ex)})`}}>{node}</div>
    </div>
  );
  const win = (
    <div style={{width: 900, height: 980, borderRadius: 28, background: '#fff', overflow: 'hidden', boxShadow: '0 60px 100px -40px rgba(0,0,0,.9)'}}>
      <div style={{height: 54, background: '#ecebe7', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px'}}>
        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
          <div key={c} style={{width: 15, height: 15, borderRadius: 99, background: c}} />
        ))}
        <div style={{marginLeft: 14, fontFamily: MONO, fontSize: 20, color: C.ink3}}>client-app · v0.1 (week 14)</div>
      </div>
      <div style={{padding: 30}}>
        {[70, 40, 40, 160, 40, 110, 40, 40].map((h, i) => (
          <div key={i} style={{height: h, width: `${[60, 90, 75, 100, 85, 100, 70, 50][i]}%`, borderRadius: 12, background: i === 3 || i === 5 ? '#eeece6' : '#f4f3ef', marginBottom: 18, border: '2px dashed #dcd9d0'}} />
        ))}
      </div>
    </div>
  );
  const modal = (
    <div style={{width: 600, borderRadius: 26, background: '#fff', padding: '26px 30px', boxShadow: '0 40px 80px -30px rgba(0,0,0,.8)', border: '2px solid #eee'}}>
      <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 22, color: C.ink3}}>CHANGE REQUEST #47</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, marginTop: 8}}>"Can we also add a chat?"</div>
      <div style={{display: 'flex', gap: 12, marginTop: 18}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, background: C.ink, color: '#fff', padding: '10px 20px', borderRadius: 999}}>Approve</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 22, background: '#f2f1ee', color: C.ink2, padding: '10px 20px', borderRadius: 999}}>Later</div>
      </div>
    </div>
  );
  const toasts = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {['⚠  Scope creep: +14 features', '⏰  Deadline moved. Again.', '🐞  Login broken on Android'].map((m) => (
        <div key={m} style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#fff', background: C.redDeep, padding: '16px 22px', borderRadius: 18, boxShadow: '0 20px 40px -20px rgba(0,0,0,.8)', whiteSpace: 'nowrap'}}>{m}</div>
      ))}
    </div>
  );
  const budget = (
    <div style={{width: 560, borderRadius: 26, background: C.term2, padding: '24px 28px', boxShadow: '0 40px 80px -30px rgba(0,0,0,.9)', border: `3px solid ${C.red}`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.termDim}}>BUDGET USED</div>
        <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 70, color: C.red, letterSpacing: '-0.03em'}}>340%</div>
      </div>
      <div style={{marginTop: 10, height: 30, borderRadius: 99, background: 'rgba(255,77,46,.25)', overflow: 'hidden'}}>
        <div style={{width: '100%', height: '100%', background: `repeating-linear-gradient(45deg, ${C.red} 0 18px, ${C.redDeep} 18px 36px)`}} />
      </div>
      <div style={{marginTop: 12, fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.termInk}}>Invoice #12 · OVERDUE</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Term />
      <div style={{position: 'absolute', left: 90, top: 300}}>
        {lay(0, k - 0.12, 0, -40, -3, 0.84, win, 1)}
        {lay(1, k + 0.35, -330, -330, -14, 0.9, <div style={{marginLeft: 150, marginTop: 200}}>{modal}</div>, 2)}
        {lay(2, k + 0.75, 380, 120, 12, 0.92, <div style={{marginLeft: 330, marginTop: 470}}>{toasts}</div>, 3)}
        {lay(3, k + 1.15, -360, 420, -10, 0.92, <div style={{marginLeft: 20, marginTop: 640}}>{budget}</div>, 4)}
      </div>
      {t >= x ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center'}}>
          <Stamp t={t} at={x + 0.05} rot={6} size={96} bg="rgba(14,15,13,.85)">Budget: exploded</Stamp>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
const Q3: React.FC<S> = ({t}) => {
  const k = EV.skip;
  const sw = eio(P(t, k - 0.18, k + 0.12));
  return (
    <AbsoluteFill>
      {sw < 1 ? (
        <AbsoluteFill style={{transform: `scale(${L(1, 0.7, sw)}) rotate(${-6 * sw}deg)`, opacity: 1 - sw, transformOrigin: '540px 900px'}}>
          <Page t={t} />
        </AbsoluteFill>
      ) : null}
      {sw > 0 ? (
        <AbsoluteFill style={{opacity: sw}}>
          <Chaos t={t} />
        </AbsoluteFill>
      ) : null}
      {/* "3/3 · can you draw it on one page?" sits on the paper itself as the handwriting */}
    </AbsoluteFill>
  );
};

// ======================= CTA: one page first; comment SCOPE =======================
const Cta: React.FC<S> = ({t}) => {
  const rf = EV.before, cm = EV.comment;
  const focus = eio(P(t, rf, rf + 0.45));
  const drop = t - cm;
  const y = drop <= 0 ? -420 : L(-420, 600, clamp(spr(t, cm, 14, 6.5), 0, 1.3));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{filter: `blur(${focus * 22}px) brightness(${L(1, 0.42, focus)})`, transform: `scale(${L(1.02, 1.1, focus)})`}}>
        <Page t={t} done />
        {t < rf + 0.5 ? (
          <div style={{position: 'absolute', right: 110, top: 1180}}>
            <Stamp t={t} at={EV.scope1 - 0.05} color={C.greenDeep} rot={-6} size={74}>Scoped ✓</Stamp>
          </div>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: focus, filter: `blur(${(1 - focus) * 22}px)`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.green}}>{'// lines of code written: 0'}</div>
        </div>
        {t >= cm - 0.15 ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', ...pop(t, cm - 0.15, 0, 0.7)}}>
            <Head size={150} color={C.white}>Comment</Head>
          </div>
        ) : null}
        <div style={{position: 'absolute', left: 120, top: y, width: 840}}>
          <div style={{background: C.white, borderRadius: 40, padding: '26px 30px', display: 'flex', alignItems: 'center', gap: 22, boxShadow: '0 50px 90px -40px rgba(0,0,0,.9)', transform: `rotate(${drop > 0 ? -2 + 2 * clamp(drop / 0.6) : -2}deg)`}}>
            <div style={{width: 92, height: 92, borderRadius: 99, background: 'conic-gradient(#f58529, #dd2a7b, #8134af, #515bd4, #f58529)', padding: 5, flexShrink: 0}}>
              <div style={{width: '100%', height: '100%', borderRadius: 99, background: '#ffd6c9', border: '4px solid #fff', display: 'grid', placeItems: 'center', fontSize: 40}}>🙋</div>
            </div>
            <div style={{flex: 1}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.ink3}}>you · now</div>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 118, color: C.ink, letterSpacing: '-0.04em', lineHeight: 1}}>SCOPE</div>
            </div>
            <div style={{fontSize: 52, color: C.red}}>♥</div>
          </div>
        </div>
        {t >= EV.send - 0.1 ? (
          <div style={{position: 'absolute', left: 80, right: 80, top: 900, textAlign: 'center', ...pop(t, EV.send - 0.1, 0, 0.8)}}>
            <div style={{fontFamily: SERIF, fontSize: 64, color: C.termInk, lineHeight: 1.1}}>…and I'll DM you our</div>
            <div style={{fontFamily: SERIF, fontSize: 64, color: C.green, lineHeight: 1.1}}>one-page scope checklist.</div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================= overlays =======================
/** impact frame: 2 white frames on "app" */
const Impact: React.FC<S> = ({t}) => (t >= EV.app && t < EV.app + 2 * F ? <AbsoluteFill style={{background: '#fff'}} /> : null);
const shake = (t: number): [number, number] => {
  const hit = (at: number, n: number, amp: number) => {
    const x = (t - at) / F;
    if (x < 0 || x > n) return [0, 0];
    const a = amp * (1 - x / n);
    return [Math.sin(x * 2.9) * a, Math.cos(x * 3.7) * a];
  };
  const a = hit(EV.app + 2 * F, 6, 22), b = hit(EV.explode, 10, 26);
  return [a[0] + b[0], a[1] + b[1]];
};
/** paper tear into question 3: a sheet drops over the frame, then rips in half along a jagged line */
const JAG = Array.from({length: 25}).map((_, i) => [540 + (i % 2 ? 26 : -22) + Math.sin(i * 3.1) * 14, (i / 24) * 1920] as Pt);
const PaperTear: React.FC<S> = ({t}) => {
  const s = SC.q3.start;
  const cover = eo(P(t, s - 0.22, s)), rip = ei(P(t, s + 0.02, s + 0.36));
  if (t < s - 0.22 || rip >= 1) return null;
  const paper: React.CSSProperties = {position: 'absolute', inset: 0, background: '#f7f4ec', backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(0,0,0,.025), transparent 40%), repeating-linear-gradient(0deg, rgba(0,0,0,.018) 0 2px, transparent 2px 5px)'};
  const left = `polygon(0 0, ${JAG.map((p) => `${p[0]}px ${p[1]}px`).join(', ')}, 0 1920px)`;
  const right = `polygon(1080px 0, ${JAG.map((p) => `${p[0]}px ${p[1]}px`).join(', ')}, 1080px 1920px)`;
  const dy = (1 - cover) * -1920;
  return (
    <AbsoluteFill style={{transform: `translateY(${dy}px)`}}>
      <div style={{...paper, clipPath: left, transform: `translateX(${-760 * rip}px) rotate(${-7 * rip}deg)`, filter: 'drop-shadow(10px 0 12px rgba(0,0,0,.35))'}} />
      <div style={{...paper, clipPath: right, transform: `translateX(${760 * rip}px) rotate(${7 * rip}deg)`, filter: 'drop-shadow(-10px 0 12px rgba(0,0,0,.35))'}} />
    </AbsoluteFill>
  );
};
/** logo lower third, last two seconds */
const LowerThird: React.FC<S> = ({t}) => {
  const p = eo5(P(t, EV.logo, EV.logo + 0.4));
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 60, top: 1200, transform: `translateX(${(1 - p) * -900}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, background: C.white, borderRadius: 26, padding: '22px 30px', boxShadow: '0 30px 60px -30px rgba(0,0,0,.8)'}}>
        <Logo size={58} />
        <div style={{width: 2, height: 50, background: 'rgba(17,17,17,.15)'}} />
        <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 32, color: C.ink}}>localhostlabs.tech</div>
      </div>
    </div>
  );
};

const VIEWS: Record<string, React.FC<S>> = {hook: Hook, con: Con, stay: Stay, q1: Q1, q2: Q2, q3: Q3, cta: Cta};
export const Main: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cur = SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
  const View = VIEWS[cur.id];
  const [sx, sy] = shake(t);
  const shaking = sx !== 0 || sy !== 0;
  return (
    <AbsoluteFill style={{background: C.term, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${shaking ? 1.04 : 1})`}}>
        <View t={t} />
      </AbsoluteFill>
      <PaperTear t={t} />
      <TopBar t={t} />
      <LowerThird t={t} />
      <Captions t={t} />
      <Impact t={t} />
    </AbsoluteFill>
  );
};

/** cover / poster: "YOU DON'T NEED AN APP" across the top third */
export const Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.term, overflow: 'hidden'}}>
    <Term />
    <Inbox t={1.2} dim={0.55} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
      <Head size={150} color={C.white} style={{textShadow: '0 20px 60px rgba(0,0,0,.7)'}}>You don't</Head>
      <Head size={150} color={C.white} style={{marginTop: 14, textShadow: '0 20px 60px rgba(0,0,0,.7)'}}>
        need an <span style={{color: C.red}}>app.</span>
      </Head>
    </div>
    <div style={{position: 'absolute', left: 120, top: 800, transform: 'rotate(-2deg)'}}>
      <div style={{width: 840, background: C.white, borderRadius: 44, padding: '30px 38px 38px', boxShadow: '0 60px 100px -40px rgba(0,0,0,.85)', position: 'relative'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16}}>
          <div style={{width: 64, height: 64, borderRadius: 99, background: C.red, color: '#fff', display: 'grid', placeItems: 'center', fontFamily: HEAD, fontWeight: 800, fontSize: 28}}>NC</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.ink}}>New client</div>
        </div>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 92, color: C.ink, letterSpacing: '-0.035em', lineHeight: 1}}>I need an app.</div>
          <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 18, background: C.red, borderRadius: 6, transform: 'rotate(-3deg)'}} />
        </div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1210, display: 'flex', justifyContent: 'center'}}>
      <Chip bg={C.green} color="#fff" size={34}>3 QUESTIONS BEFORE YOU BUILD</Chip>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1340, display: 'flex', justifyContent: 'center'}}>
      <Logo size={50} ink={C.termInk} />
    </div>
  </AbsoluteFill>
);

export const _u = [LN, eo5, ei, Captions];
