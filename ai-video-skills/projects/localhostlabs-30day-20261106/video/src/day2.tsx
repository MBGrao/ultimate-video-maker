import React from 'react';
import {C, HEAD, L, MONO, P, SANS, SERIF, clamp, ei, eio, eo, eo5, useV} from './brand';
import {Abs, Braces, Em, Head, ICONS, Icon, Mono, Rise, Spark, Stamp, Typed, popStyle} from './parts';
import {EndCard} from './day1';

const COPY = {
  pk: {
    hook: ['DEVELOPER', 'chala gaya…', '…AUR WEBSITE BHI.'],
    callName: 'Developer',
    callFail: 'Switched off 📵',
    storyTitle: ['SAB KUCH', 'uske paas.'],
    ev: [['DOMAIN', 'uske email pe', 'mail', 'domain'], ['CODE', 'uske laptop mein', 'laptop', 'code'], ['PASSWORD', 'sirf usko pata', 'lock', 'password']],
    evStamp: 'USKA',
    rentTitle: ['APNI HI WEBSITE KE', 'kiraye-daar.'],
    rentSign: 'KIRAYE PE',
    whoami: 'owner: ??? (developer ka)',
    transTitle: ['3 CHAABIYAN', 'aap ke naam.'],
    keys: ['DOMAIN', 'CODE', 'HOSTING'],
    nums: ['PEHLI', 'DOOSRI', 'TEESRI'],
    yours: 'AAPKE NAAM ✓',
    tld: 'pk',
    punch: ['PAISA AAP KA,', 'to chaabi bhi', 'AAP KI.'],
    trig: ['TEENO CHAABIYAN', 'aap ke paas?'],
    btn: [['MERE PAAS ✓', 'mere'], ['PATA NAHI 🤔', 'pata']],
    typed: 'MERE PAAS 💪',
    dm: 'DM karo · free call',
    sign: '> seedhi baat, no bakwaas.',
  },
  en: {
    hook: ['IF YOUR DEV', 'disappeared', 'WOULD YOUR BUSINESS SURVIVE?'],
    callName: 'Your developer',
    callFail: 'No answer 📵',
    storyTitle: ['EVERYTHING IS', 'theirs.'],
    ev: [['DOMAIN', 'on their email', 'mail', 'domain'], ['CODE', 'on their laptop', 'laptop', 'code'], ['PASSWORD', 'only they know', 'lock', 'password']],
    evStamp: 'THEIRS',
    rentTitle: ["YOU'RE RENTING", 'your own website.'],
    rentSign: 'FOR RENT',
    whoami: 'owner: ??? (your developer)',
    transTitle: ['3 KEYS', 'you must own.'],
    keys: ['DOMAIN', 'CODE', 'HOSTING'],
    nums: ['ONE', 'TWO', 'THREE'],
    yours: 'YOURS ✓',
    tld: 'com',
    punch: ['YOU PAID', 'for it.', 'OWN THE KEYS.'],
    trig: ['DO YOU HAVE', 'all three?'],
    btn: [['OWN IT ✓', 'own'], ['NOT SURE 🤔', 'not']],
    typed: 'OWN IT 💪',
    dm: 'DM us · first call is free',
    sign: '> no jargon. just shipped.',
  },
};
const useCopy = () => COPY[useV().pk ? 'pk' : 'en'];

// ======================= HOOK: the developer walks out with your key =======================
const Walker: React.FC<{p: number; t: number}> = ({p, t}) => {
  // a simple flat figure seen from behind; p 0..1 walks into the doorway (shrinks + rises)
  const s = L(1, 0.42, eio(p));
  const step = Math.sin(t * 9) * (1 - p) * 10;
  return (
    <div style={{position: 'absolute', left: 230, top: L(330, 150, eio(p)), transform: `scale(${s})`, transformOrigin: '50% 100%', width: 200, height: 420}}>
      <svg width="200" height="420" viewBox="0 0 200 420" style={{overflow: 'visible'}}>
        {/* key over the shoulder */}
        <g transform={`translate(118 70) rotate(${-38 + Math.sin(t * 9) * 3})`}>
          <circle cx="0" cy="0" r="30" fill="#ffd36b" stroke={C.ink} strokeWidth="7" />
          <circle cx="0" cy="0" r="10" fill={C.paper} stroke={C.ink} strokeWidth="6" />
          <rect x="28" y="-7" width="150" height="14" rx="6" fill="#ffd36b" stroke={C.ink} strokeWidth="6" />
          <rect x="140" y="5" width="12" height="26" fill="#ffd36b" stroke={C.ink} strokeWidth="5" />
          <rect x="160" y="5" width="12" height="18" fill="#ffd36b" stroke={C.ink} strokeWidth="5" />
        </g>
        <circle cx="100" cy="60" r="40" fill={C.ink} />
        <path d="M48 120 Q100 96 152 120 L160 250 H40 Z" fill={C.ink} />
        <rect x="58" y="128" width="84" height="104" rx="18" fill={C.red} />
        <path d={`M70 250 L${62 + step} 400 M130 250 L${138 - step} 400`} stroke={C.ink} strokeWidth="30" strokeLinecap="round" />
        <rect x="150" y="190" width="70" height="46" rx="6" fill="#ddd" stroke={C.ink} strokeWidth="6" transform="rotate(12 150 190)" />
      </svg>
    </div>
  );
};

export const D2Hook: React.FC = () => {
  const {t, ln, wt, pk} = useV();
  const K = useCopy();
  const h = ln('hook');
  const closeAt = pk ? wt('hook', 'bhi') : wt('hook', 'survive');
  const walk = P(t, 0.25, closeAt - 0.1);
  const close = eio(P(t, closeAt - 0.12, closeAt + 0.25));
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={0.02}>
          <Head size={pk ? 132 : 120}>{K.hook[0]}</Head>
        </Rise>
        <Rise at={0.12}>
          <div style={{fontFamily: SERIF, fontSize: pk ? 168 : 172, color: C.red, lineHeight: 0.95}}>{K.hook[1]}</div>
        </Rise>
        <Rise at={pk ? wt('hook', 'aur') - 0.08 : wt('hook', 'would') - 0.08}>
          <Head size={pk ? 76 : 56} style={{marginTop: 10}}>{K.hook[2]}</Head>
        </Rise>
      </Abs>
      {/* the doorway */}
      <div style={{position: 'absolute', left: 230, top: 720, width: 620, height: 690}}>
        <div style={{position: 'absolute', left: 60, top: 0, width: 500, height: 640, background: '#fffaf0', border: `14px solid ${C.ink}`, borderBottom: 'none', overflow: 'hidden', boxShadow: 'inset 0 0 120px rgba(255,211,107,.55)'}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 300px 400px at 50% 40%, #fff 0%, #fff3d6 60%, #ffe2a8 100%)'}} />
          <Walker p={walk} t={t} />
          {/* the door panel swinging shut */}
          <div style={{position: 'absolute', left: 0, top: 0, width: 472, height: 640, background: C.red, transformOrigin: '0 50%', transform: `perspective(1400px) rotateY(${L(-82, 0, close)}deg)`, boxShadow: 'inset -20px 0 0 rgba(0,0,0,.12)'}}>
            <div style={{position: 'absolute', left: 40, top: 60, right: 40, height: 220, border: `8px solid rgba(17,17,17,.35)`}} />
            <div style={{position: 'absolute', left: 40, top: 330, right: 40, height: 240, border: `8px solid rgba(17,17,17,.35)`}} />
            <div style={{position: 'absolute', right: 38, top: 300, width: 30, height: 30, borderRadius: 99, background: '#ffd36b', border: `5px solid ${C.ink}`}} />
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, top: 636, width: 620, height: 14, background: C.ink}} />
        <div style={{position: 'absolute', left: 120, top: 650, width: 420, height: 46, backgroundImage: 'radial-gradient(circle, rgba(17,17,17,.5) 2.4px, transparent 3px)', backgroundSize: '12px 12px', opacity: 1 - close}} />
      </div>
      <Spark x={930} y={760} size={60} at={closeAt} />
      <span style={{display: 'none'}}>{h.start}</span>
    </>
  );
};

// ======================= STORY: everything is theirs =======================
export const D2Story: React.FC = () => {
  const {t, sc, ln, wt, pk} = useV();
  const K = useCopy();
  const s = sc('story').start;
  const s2 = ln('s2').start;
  const showCall = pk && t < s2 + 0.05;
  const failAt = pk ? wt('s1', 'band') : 999;
  return (
    <>
      {showCall ? (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - ei(P(t, s2 - 0.25, s2))}}>
          <Abs x={64} y={276}>
            <Rise at={s + 0.02}>
              <Head size={120}>BILAL BHAI KA</Head>
            </Rise>
            <Rise at={s + 0.1}>
              <div style={{fontFamily: SERIF, fontSize: 150, color: C.red, lineHeight: 0.95}}>developer…</div>
            </Rise>
          </Abs>
          <div style={{position: 'absolute', left: 240, top: 640, width: 600, height: 700, borderRadius: 80, background: C.term, padding: 20, boxShadow: '0 50px 90px -40px rgba(0,0,0,.6)', ...popStyle(t, s + 0.15, 0, 0.85)}}>
            <div style={{width: '100%', height: '100%', borderRadius: 62, background: 'linear-gradient(180deg,#2b2f2a,#141613)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 110}}>
              <div style={{width: 170, height: 170, borderRadius: 99, background: '#3a3f39', display: 'grid', placeItems: 'center', fontSize: 90, boxShadow: t < failAt ? `0 0 0 ${18 + 14 * Math.abs(Math.sin(t * 4))}px rgba(0,194,122,.18)` : 'none'}}>👨‍💻</div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: '#fff', marginTop: 34}}>{K.callName}</div>
              <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 32, color: t >= failAt ? C.red : C.termDim, marginTop: 14}}>{t >= failAt ? K.callFail : 'calling…'}</div>
              <div style={{marginTop: 'auto', marginBottom: 70, width: 120, height: 120, borderRadius: 99, background: C.red, display: 'grid', placeItems: 'center', fontSize: 56, transform: 'rotate(135deg)'}}>📞</div>
            </div>
          </div>
        </div>
      ) : null}
      {t >= s2 - 0.1 ? (
        <>
          <Abs x={64} y={276}>
            <Rise at={s2 - 0.08}>
              <Head size={124}>{K.storyTitle[0]}</Head>
            </Rise>
            <Rise at={s2}>
              <div style={{fontFamily: SERIF, fontSize: 160, color: C.red, lineHeight: 0.95}}>{K.storyTitle[1]}</div>
            </Rise>
          </Abs>
          {K.ev.map(([lab, sub, icon, key], i) => {
            const at = wt('s2', key);
            return (
              <div key={lab} style={{position: 'absolute', left: 80, top: 600 + i * 250, width: 920, height: 220, background: '#fbf7ee', border: `3px solid ${C.ink}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 26, padding: '0 34px', boxShadow: `10px 10px 0 ${C.ink}`, ...popStyle(t, at - 0.12, [-1.5, 1.2, -1][i], 0.7)}}>
                <div style={{position: 'absolute', left: 380, top: -16, width: 130, height: 34, background: 'rgba(255,77,46,.55)', transform: 'rotate(-4deg)'}} />
                <Icon strokes={ICONS[icon]} at={at - 0.05} size={150} dur={0.7} />
                <div>
                  <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 64, letterSpacing: '-0.04em', color: C.ink, lineHeight: 1}}>{lab}</div>
                  <div style={{fontFamily: SERIF, fontSize: 54, color: C.ink2, marginTop: 6}}>{sub}</div>
                </div>
                <div style={{marginLeft: 'auto'}}>
                  <Stamp at={at + 0.35} size={50} rot={-12}>
                    {K.evStamp}
                  </Stamp>
                </div>
              </div>
            );
          })}
        </>
      ) : null}
    </>
  );
};

// ======================= RENT: tenant of your own website =======================
export const D2Rent: React.FC = () => {
  const {t, sc, pk} = useV();
  const K = useCopy();
  const s = sc('rent').start;
  const swing = Math.sin((t - s) * 3.2) * 9 * Math.exp(-(t - s) * 0.6);
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={s + 0.02}>
          <Head size={84}>{K.rentTitle[0]}</Head>
        </Rise>
        <Rise at={s + 0.12}>
          <div style={{fontFamily: SERIF, fontSize: pk ? 160 : 128, color: C.red, lineHeight: 0.95, whiteSpace: 'nowrap'}}>{K.rentTitle[1]}</div>
        </Rise>
      </Abs>
      <Abs x={170} y={600}>
        <Icon strokes={ICONS.house} at={s + 0.1} size={740} dur={1.0} />
      </Abs>
      {/* bracket + hanging sign */}
      <div style={{position: 'absolute', left: 640, top: 1010, width: 300, height: 10, background: C.ink, ...popStyle(t, s + 0.6, 0, 0.6)}} />
      <div style={{position: 'absolute', left: 660, top: 1020, width: 260, transformOrigin: '50% 0', transform: `rotate(${swing}deg)`, ...{opacity: clamp((t - s - 0.7) / 0.15)}}}>
        <svg width="260" height="60" style={{display: 'block'}}>
          <path d="M40 0 L60 60 M220 0 L200 60" stroke={C.ink} strokeWidth="5" />
        </svg>
        <div style={{background: '#fff', border: `6px solid ${C.ink}`, padding: '18px 0', textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 52, color: C.red, letterSpacing: '-0.02em', boxShadow: `8px 8px 0 ${C.ink}`}}>{K.rentSign}</div>
      </div>
      <Spark x={960} y={640} size={56} at={s + 0.9} />
    </>
  );
};

// ======================= TURN: terminal whoami =======================
export const D2Trans: React.FC = () => {
  const {t, sc, ln} = useV();
  const K = useCopy();
  const s = sc('trans').start;
  const keysAt = ln('tr').start + 0.9;
  return (
    <>
      <div style={{position: 'absolute', left: 80, top: 300, width: 920, background: C.term2, borderRadius: 30, padding: '24px 36px 40px', border: '2px solid rgba(233,242,234,.1)', ...popStyle(t, s + 0.02, 0, 0.9)}}>
        <div style={{display: 'flex', gap: 12, marginBottom: 30}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{width: 18, height: 18, borderRadius: 99, background: c}} />
          ))}
          <span style={{marginLeft: 16, fontFamily: MONO, fontSize: 22, color: C.termDim}}>~/your-business</span>
        </div>
        <div style={{lineHeight: 1.7}}>
          <Typed text="> whoami" at={s + 0.15} color={C.green} size={46} cursor={false} />
          <div>
            <Typed text={K.whoami} at={s + 0.75} color={C.red} size={40} cursor={false} />
          </div>
          <div>
            <Typed text="> ls ~/keys" at={keysAt} color={C.green} size={46} cursor={false} />
          </div>
          <div>
            <Typed text="domain   code   hosting" at={keysAt + 0.6} color={C.termInk} size={40} />
          </div>
        </div>
      </div>
      <Abs x={80} y={860}>
        <Rise at={keysAt + 0.2}>
          <Head size={130} color={C.termInk}>{K.transTitle[0]}</Head>
        </Rise>
        <Rise at={keysAt + 0.3}>
          <div style={{fontFamily: SERIF, fontSize: 150, color: C.green, lineHeight: 0.95}}>{K.transTitle[1]}</div>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', left: 120, top: 1180, display: 'flex', gap: 30}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{...popStyle(t, keysAt + 0.5 + i * 0.12, -20 + i * 20, 0.4)}}>
            <Icon strokes={ICONS.key} at={keysAt + 0.5 + i * 0.12} size={240} dur={0.6} color={C.termInk} />
          </div>
        ))}
      </div>
    </>
  );
};

// ======================= THE 3 KEYS =======================
const KeyRow: React.FC<{cur: number}> = ({cur}) => {
  const K = useCopy();
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 268, display: 'flex', gap: 18}}>
      {K.keys.map((k, i) => (
        <div key={k} style={{flex: 1, height: 110, borderRadius: 14, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', background: i === cur ? C.ink : i < cur ? C.greenTint : 'transparent', border: `3px solid ${i <= cur ? C.ink : 'rgba(17,17,17,.25)'}`, boxShadow: i === cur ? `6px 6px 0 ${C.red}` : 'none'}}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 26, color: i < cur ? C.greenDeep : i === cur ? C.red : C.ink3}}>{i < cur ? '✓' : `0${i + 1}`}</div>
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 32, letterSpacing: '-0.02em', color: i === cur ? '#fff' : i < cur ? C.greenDeep : C.ink3}}>{k}</div>
        </div>
      ))}
    </div>
  );
};

const KeyLock: React.FC<{turnAt: number; s: number}> = ({turnAt, s}) => {
  const {t} = useV();
  const slide = eo5(P(t, s + 0.15, turnAt - 0.02));
  const wig = Math.sin(Math.PI * 2 * P(t, turnAt, turnAt + 0.42)) * 10 * (1 - P(t, turnAt, turnAt + 0.42));
  const open = eo(P(t, turnAt + 0.25, turnAt + 0.55));
  const glow = Math.sin(Math.PI * P(t, turnAt + 0.25, turnAt + 0.9));
  return (
    <div style={{position: 'absolute', left: 60, top: 470, width: 960, height: 400}}>
      {/* key: tip ends inside the lock body (x ~ 700) */}
      <div style={{position: 'absolute', left: L(-560, 150, slide), top: 214, transformOrigin: '560px 36px', transform: `rotate(${wig}deg)`}}>
        <svg width="580" height="80" viewBox="0 0 580 80" style={{overflow: 'visible'}}>
          <circle cx="56" cy="36" r="52" fill="#ffd36b" stroke={C.ink} strokeWidth="9" />
          <circle cx="56" cy="36" r="17" fill={C.paper} stroke={C.ink} strokeWidth="8" />
          <rect x="104" y="22" width="460" height="28" rx="10" fill="#ffd36b" stroke={C.ink} strokeWidth="8" />
          <rect x="470" y="44" width="22" height="32" fill="#ffd36b" stroke={C.ink} strokeWidth="7" />
          <rect x="504" y="44" width="22" height="22" fill="#ffd36b" stroke={C.ink} strokeWidth="7" />
        </svg>
      </div>
      {/* lock on top, so the key tip disappears into it */}
      <svg width="330" height="400" viewBox="0 0 200 242" style={{position: 'absolute', left: 600, top: -10, overflow: 'visible'}}>
        <circle cx="100" cy="160" r={70 + glow * 30} fill={C.green} opacity={glow * 0.25} />
        <path d={`M58 ${104 - open * 30} V70 A42 42 0 0 1 142 70 V${open > 0.05 ? 74 - open * 4 : 104}`} fill="none" stroke={C.ink} strokeWidth="16" strokeLinecap="round" />
        <rect x="26" y="104" width="148" height="128" rx="18" fill={open > 0.5 ? C.green : C.red} stroke={C.ink} strokeWidth="8" />
        <circle cx="100" cy="156" r="14" fill={C.ink} />
        <rect x="94" y="160" width="12" height="36" fill={C.ink} />
      </svg>
    </div>
  );
};

export const D2Point: React.FC<{i: number}> = ({i}) => {
  const {t, sc, wt, pk} = useV();
  const K = useCopy();
  const k = `p${i + 1}`;
  const s = sc(k).start;
  const turnAt = wt(k, K.keys[i].toLowerCase());
  const cardAt = Math.max(wt(k, 2), turnAt + 0.5);
  const tld = K.tld;
  const panels = [
    {title: pk ? 'Registrar account' : 'Registrar account', rows: [['Domain', `yourbusiness.${tld}`], ['Account email', `you@yourbusiness.${tld}`]], icon: 'mail'},
    {title: 'GitHub', rows: [['Repository', 'yourbusiness / website'], ['Owner', pk ? 'Aap' : 'You']], icon: 'laptop'},
    {title: pk ? 'Server / cloud login' : 'Server / cloud login', rows: [['Login', `you@yourbusiness.${tld}`], ['Role', 'Owner']], icon: 'server'},
  ][i];
  return (
    <>
      <KeyRow cur={i} />
      <Abs x={64} y={430}>
        <Mono size={30} color={C.red}>{`0${i + 1} · ${K.nums[i]}`}</Mono>
      </Abs>
      <KeyLock turnAt={turnAt} s={s} />
      <div style={{position: 'absolute', left: 80, top: 900, width: 920, background: '#fbf7ee', border: `3px solid ${C.ink}`, borderRadius: 12, padding: '26px 34px 30px', boxShadow: `10px 10px 0 ${C.ink}`, ...popStyle(t, cardAt - 0.1, 0, 0.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16}}>
          <Icon strokes={ICONS[panels.icon]} at={cardAt} size={86} dur={0.5} />
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 58, letterSpacing: '-0.04em'}}>{K.keys[i]}</div>
          <div style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 26, color: C.ink3}}>{panels.title}</div>
        </div>
        {panels.rows.map(([a, b], j) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: `2px dashed rgba(17,17,17,.2)`, opacity: eo(P(t, cardAt + 0.2 + j * 0.25, cardAt + 0.5 + j * 0.25))}}>
            <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 28, color: C.ink2}}>{a}</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink}}>
              {b} {j === panels.rows.length - 1 ? <span style={{color: C.green}}>✓</span> : null}
            </div>
          </div>
        ))}
      </div>
      <Abs x={520} y={1214}>
        <Stamp at={cardAt + 0.9} size={64} color={C.green} bg="#fbf7ee" rot={-6}>
          {K.yours}
        </Stamp>
      </Abs>
    </>
  );
};

// ======================= PUNCHLINE (red) =======================
export const D2Punch: React.FC = () => {
  const {t, sc, wt, pk} = useV();
  const K = useCopy();
  const s = sc('punch').start;
  const last = pk ? wt('pu', 'chaabi') : wt('pu', 'own');
  return (
    <>
      <Abs x={64} y={330}>
        <Rise at={s + 0.02}>
          <Head size={pk ? 128 : 150} color={C.paper}>{K.punch[0]}</Head>
        </Rise>
        <Rise at={s + 0.14}>
          <div style={{fontFamily: SERIF, fontSize: 190, color: C.ink, lineHeight: 0.95}}>{K.punch[1]}</div>
        </Rise>
        <Rise at={last - 0.08}>
          <Head size={pk ? 160 : 116} color={C.paper}>{K.punch[2]}</Head>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', left: 250, top: 980, transform: `rotate(${-12 + Math.sin(t * 2) * 4}deg)`, ...popStyle(t, last, -12, 0.3)}}>
        <svg width="580" height="200" viewBox="0 0 400 140" style={{overflow: 'visible'}}>
          <circle cx="60" cy="70" r="52" fill="#ffd36b" stroke={C.ink} strokeWidth="9" />
          <circle cx="60" cy="70" r="18" fill={C.red} stroke={C.ink} strokeWidth="8" />
          <rect x="110" y="56" width="270" height="28" rx="10" fill="#ffd36b" stroke={C.ink} strokeWidth="8" />
          <rect x="320" y="80" width="20" height="36" fill="#ffd36b" stroke={C.ink} strokeWidth="7" />
          <rect x="350" y="80" width="20" height="26" fill="#ffd36b" stroke={C.ink} strokeWidth="7" />
        </svg>
      </div>
      <Braces x={980} y={1000} at={last + 0.2} size={70} color={C.paper} />
    </>
  );
};

// ======================= COMMENT TRIGGER =======================
export const D2Trigger: React.FC = () => {
  const {t, sc, wt, ln, pk} = useV();
  const K = useCopy();
  const s = sc('trigger').start;
  const typeAt = ln('tg').end - 0.2;
  const n = Math.floor(clamp((t - typeAt) * 12, 0, [...K.typed].length));
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={s + 0.02}>
          <Head size={pk ? 100 : 116}>{K.trig[0]}</Head>
        </Rise>
        <Rise at={s + 0.12}>
          <div style={{fontFamily: SERIF, fontSize: 160, color: C.red, lineHeight: 0.95}}>{K.trig[1]}</div>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', left: 96, top: 640, width: 888, display: 'flex', flexDirection: 'column', gap: 30}}>
        {K.btn.map(([label, key], i) => {
          const at = wt('tg', key);
          const pulse = Math.sin(Math.PI * P(t, at, at + 0.35));
          return (
            <div key={label} style={{...popStyle(t, s + 0.25 + i * 0.12, 0, 0.7), textAlign: 'center', borderRadius: 18, padding: '40px 0', fontFamily: HEAD, fontWeight: 900, fontSize: 76, letterSpacing: '-0.03em', background: i === 0 ? (t >= at ? C.green : '#fbf7ee') : t >= at ? C.ink : '#fbf7ee', color: t >= at ? '#fff' : C.ink, border: `4px solid ${C.ink}`, boxShadow: `10px 10px 0 ${C.ink}`, transform: `scale(${1 + 0.05 * pulse})`}}>
              {label}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 96, top: 1150, width: 888, display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 999, padding: '16px 18px', border: `3px solid ${C.ink}`, ...popStyle(t, typeAt - 0.4, 0, 0.8)}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: 'linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)'}} />
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 36, color: n ? C.ink : C.ink3}}>{n ? [...K.typed].slice(0, n).join('') : 'Add a comment…'}</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: '#0095f6', paddingRight: 14}}>Post</div>
      </div>
    </>
  );
};

export const D2Cta: React.FC = () => {
  const K = useCopy();
  return <EndCard dm={K.dm} sign={K.sign} />;
};

export const D2 = {hook: D2Hook, story: D2Story, rent: D2Rent, trans: D2Trans, p1: () => <D2Point i={0} />, p2: () => <D2Point i={1} />, p3: () => <D2Point i={2} />, punch: D2Punch, trigger: D2Trigger, cta: D2Cta};
export const _u2 = [MONO, eo, Em];
