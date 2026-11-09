import React from 'react';
import {C, HEAD, L, MONO, P, SANS, SERIF, clamp, eb, ei, eo, eo5, useV} from './brand';
import {Abs, Braces, Card, Em, Head, ICONS, Icon, Mono, Rise, Spark, Stamp, Tap, outStyle, popStyle} from './parts';

// copy per market: same scenes, re-written (not translated) per the plan
const COPY = {
  pk: {
    hookTitle: ['WEBSITE, APP', 'YA', 'software?'],
    who: 'Developer',
    ask: 'Website chahiye, app, ya software? 🤔',
    chips: ['Website', 'App', 'Software'],
    ctxTitle: ['TEENO KA KAAM', 'bilkul alag.'],
    transTitle: ['CHALO,', 'mithai ki dukaan', 'SE SAMJHO 👇'],
    icons: ['shop', 'bike', 'ledger'],
    names: ['WEBSITE', 'APP', 'SOFTWARE'],
    eq: ['= dukaan', '= delivery bike', '= godown ka munshi'],
    eqKey: ['yaani', 'yaani', 'yaani'],
    nums: ['PEHLA', 'DOOSRA', 'TEESRA'],
    bullets: [['Log aate hain', 'Mithai dekhte hain', 'Rate dekhte hain'], ['Seedha jeb mein', 'Baar baar order'], ['Stock', 'Staff', 'Bill']],
    bulletKeys: [[['p1', 'log'], ['p1', 'mithai'], ['p1', 'rate']], [['p2', 'seedha'], ['p2', 'baar']], [['p3', 'stock'], ['p3', 'staff'], ['p3', 'bill']]],
    punchTitle: ['YAAD', 'rakho.'],
    order: [['PEHLE', 'dukaan', 'dukaan'], ['PHIR', 'bike', 'bike'], ['PHIR', 'munshi', 'munshi']],
    trigTitle: ['AAP KE PAAS', 'kya hai?'],
    choices: [['DUKAAN', 'dukaan'], ['BIKE', 'bike'], ['MUNSHI', 'munshi']],
    typed: 'MUNSHI 😅',
    dm: 'DM karo · free call',
    sign: '> seedhi baat, no bakwaas.',
  },
  en: {
    hookTitle: ['WEBSITE, APP', 'OR', 'software?'],
    who: 'Your developer',
    ask: 'So… website, app, or software? 🤔',
    chips: ['Website', 'App', 'Software'],
    ctxTitle: ['SAME-SOUNDING.', 'different jobs.'],
    transTitle: ['THINK OF A', 'coffee shop.', ''],
    icons: ['store', 'loyalty', 'office'],
    names: ['WEBSITE', 'APP', 'SOFTWARE'],
    eq: ['= the storefront', '= the loyalty card', '= the back office'],
    eqKey: ['storefront', 'loyalty', 'back'],
    nums: ['ONE', 'TWO', 'THREE'],
    bullets: [['People find you', 'Check the menu', 'Walk in'], ['In their pocket', 'Back again & again'], ['Inventory', 'Staff', 'Payroll']],
    bulletKeys: [[['p1', 'people'], ['p1', 'check'], ['p1', 'walk']], [['p2', 'pocket'], ['p2', 'again']], [['p3', 'inventory'], ['p3', 'staff'], ['p3', 'payroll']]],
    punchTitle: ['IN THIS', 'order.'],
    order: [['FIRST', 'storefront', 'storefront'], ['LATER', 'loyalty card', 'loyalty'], ['WHEN IT HURTS', 'back office', 'back']],
    trigTitle: ['WHICH ONE DO', 'you need?'],
    choices: [['STOREFRONT', 'storefront'], ['CARD', 'card'], ['BACK OFFICE', 'back']],
    typed: 'back office 😅',
    dm: 'DM us · first call is free',
    sign: '> no jargon. just shipped.',
  },
};
const useCopy = () => COPY[useV().pk ? 'pk' : 'en'];

// ======================= HOOK =======================
export const D1Hook: React.FC = () => {
  const {t, wt, ln, pk} = useV();
  const K = useCopy();
  const h2 = ln('hook2').start;
  const chipAt = [wt('hook', 'website'), wt('hook', 'app'), wt('hook', 'software')];
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={0.02}>
          <Head size={132}>{K.hookTitle[0]}</Head>
        </Rise>
        <Rise at={0.1}>
          <Head size={132}>
            {K.hookTitle[1]} <Em scale={1.22}>{K.hookTitle[2]}</Em>
          </Head>
        </Rise>
      </Abs>
      <Braces x={1010} y={300} at={0.4} size={60} />
      {/* developer chat */}
      <Abs x={96} y={620} style={{...popStyle(t, 0.15, 0, 0.85), transformOrigin: '50% 0'}}>
        <Card style={{width: 888}} pad={34}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, marginBottom: 26}}>
            <div style={{width: 84, height: 84, borderRadius: 99, background: C.term, display: 'grid', placeItems: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.green}}>{'</>'}</div>
            <div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink}}>{K.who}</div>
              <div style={{fontFamily: MONO, fontWeight: 500, fontSize: 22, color: C.green}}>● online</div>
            </div>
          </div>
          <div style={{...popStyle(t, ln('hook').start + 0.05, 0, 0.7), transformOrigin: '0 50%', display: 'inline-block', background: '#f1f0ec', borderRadius: '8px 34px 34px 34px', padding: '22px 30px', fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.ink, maxWidth: 780}}>{K.ask}</div>
          <div style={{display: 'flex', gap: 16, marginTop: 26}}>
            {K.chips.map((c, i) => {
              const wrong = !pk && i === 2 && t >= wt('hook2', 'wrong');
              return (
                <div key={c} style={{...popStyle(t, chipAt[i], 0, 0.5), flex: 1, textAlign: 'center', borderRadius: 999, padding: '20px 0', fontFamily: HEAD, fontWeight: 800, fontSize: 38, letterSpacing: '-0.02em', border: `3px solid ${wrong ? C.red : C.ink}`, background: wrong ? C.redTint : '#fff', color: wrong ? C.red : C.ink}}>
                  {c}
                </div>
              );
            })}
          </div>
        </Card>
      </Abs>
      {/* beat 2: PK confused, EN pays for the wrong one */}
      {pk ? (
        <>
          <Abs x={770} y={1090} style={popStyle(t, wt('hook2', 'aap'), 6, 0.3)}>
            <div style={{fontSize: 210, lineHeight: 1}}>😵‍💫</div>
          </Abs>
          {['?', '?', '?'].map((q, i) => (
            <Abs key={i} x={[720, 960, 990][i]} y={[1070, 1060, 1250][i]} style={{...popStyle(t, wt('hook2', 'aap') + 0.12 + i * 0.1, [-14, 10, 18][i], 0.2)}}>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: [90, 120, 70][i], color: C.red, transform: `translateY(${Math.sin(t * 3 + i) * 8}px)`}}>{q}</div>
            </Abs>
          ))}
          <Abs x={70} y={1150}>
            <Stamp at={wt('hook2', 'confuse') - 0.03} size={100} rot={-7} bg={C.page}>
              Confuse?!
            </Stamp>
          </Abs>
        </>
      ) : (
        <>
          <Tap at={wt('hook2', 'wrong') - 0.05} x={826} y={1012} />
          <Abs x={90} y={1150}>
            <Stamp at={wt('hook2', 'wrong')} size={76} rot={-7} bg={C.page}>
              ✗ The wrong one
            </Stamp>
          </Abs>
          <Abs x={850} y={1200} style={popStyle(t, wt('hook2', 'pay'), 10, 0.3)}>
            <div style={{fontSize: 150, lineHeight: 1, transform: `translateY(${Math.sin(t * 3) * 8}px)`}}>💸</div>
          </Abs>
        </>
      )}
      <span style={{display: 'none'}}>{h2}</span>
    </>
  );
};

// ======================= CONTEXT: website = app = software? =======================
export const D1Ctx: React.FC = () => {
  const {t, wt, ln, sc, pk} = useV();
  const K = useCopy();
  const s = sc('ctx').start;
  const neq = pk ? wt('ctx1', 'alag') : wt('ctx1', 'different');
  const sauda = pk ? wt('ctx2', 'mehenga') : 999;
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={s + 0.02}>
          <Head size={118}>{K.ctxTitle[0]}</Head>
        </Rise>
        <Rise at={neq - 0.12}>
          <Head size={118}>
            <Em scale={1.25}>{K.ctxTitle[1]}</Em>
          </Head>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', left: 40, right: 40, top: 610, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
        {K.chips.map((c, i) => (
          <React.Fragment key={c}>
            <div style={{...popStyle(t, s + 0.1 + i * 0.12, 0, 0.6), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
              <div style={{borderRadius: 999, padding: '18px 30px', background: '#fff', border: `3px solid ${C.ink}`, fontFamily: HEAD, fontWeight: 800, fontSize: 40, color: C.ink, letterSpacing: '-0.02em'}}>{c}</div>
              <div style={{opacity: eo(P(t, neq + 0.1 + i * 0.1, neq + 0.4 + i * 0.1))}}>
                <Icon strokes={ICONS[K.icons[i]]} at={neq + 0.1 + i * 0.12} size={190} dur={0.8} />
              </div>
            </div>
            {i < 2 ? (
              <div style={{position: 'relative', width: 70, textAlign: 'center', fontFamily: HEAD, fontWeight: 900, fontSize: 86, color: t >= neq ? C.red : C.ink, marginTop: -230, transform: `scale(${1 + 0.25 * Math.sin(Math.PI * P(t, neq, neq + 0.3))})`}}>
                {t >= neq ? '≠' : '='}
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      {pk ? (
        <>
          <Abs x={110} y={1030} style={popStyle(t, wt('ctx2', 'paisa'), -8, 0.4)}>
            <div style={{fontSize: 130, lineHeight: 1, transform: `translateY(${Math.sin(t * 3) * 8}px)`}}>💸</div>
          </Abs>
          <Abs x={290} y={1070}>
            <Stamp at={sauda} size={74} rot={-5} bg={C.page}>
              Mehenga sauda
            </Stamp>
          </Abs>
        </>
      ) : null}
      <Braces x={1000} y={560} at={neq} size={56} color={C.green} />
      <span style={{display: 'none'}}>{ln('ctx1').start}</span>
    </>
  );
};

// ======================= TRANSITION: the analogy =======================
export const D1Trans: React.FC = () => {
  const {t, sc, pk} = useV();
  const K = useCopy();
  const s = sc('trans').start;
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={s + 0.02}>
          <Head size={pk ? 120 : 132}>{K.transTitle[0]}</Head>
        </Rise>
        <Rise at={s + 0.12}>
          <div style={{fontFamily: SERIF, fontSize: pk ? 132 : 170, color: C.red, lineHeight: 0.95, letterSpacing: '-0.01em'}}>{K.transTitle[1]}</div>
        </Rise>
        {K.transTitle[2] ? (
          <Rise at={s + 0.22}>
            <Head size={120}>{K.transTitle[2]}</Head>
          </Rise>
        ) : null}
      </Abs>
      <Abs x={190} y={pk ? 700 : 640} style={{transform: `translateY(${Math.sin(t * 1.6) * 6}px)`}}>
        <div style={{position: 'absolute', left: 50, top: 600, width: 600, height: 40, borderRadius: '50%', background: 'rgba(17,17,17,.10)', filter: 'blur(10px)', opacity: eo(P(t, s + 0.3, s + 0.9))}} />
        <Icon strokes={ICONS[K.icons[0]]} at={s + 0.15} size={700} dur={1.3} />
      </Abs>
      <Spark x={960} y={720} size={70} at={s + 0.9} />
      <Braces x={190} y={760} at={s + 1.1} size={58} color={C.green} rot={8} />
    </>
  );
};

// ======================= THE 3 POINTS =======================
const Deck: React.FC<{cur: number}> = ({cur}) => {
  const {t, sc} = useV();
  const K = useCopy();
  const s = sc(`p${cur + 1}`).start;
  return (
    <div style={{position: 'absolute', left: 64, right: 64, top: 268, display: 'flex', gap: 18}}>
      {K.names.map((n, i) => {
        const done = i < cur, on = i === cur;
        const a = on ? eo(P(t, s + 0.05, s + 0.35)) : 1;
        return (
          <div key={n} style={{flex: 1, height: 116, borderRadius: 26, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', background: on ? C.ink : done ? '#fff' : 'transparent', border: `2.5px ${i > cur ? 'dashed' : 'solid'} ${on ? C.ink : i > cur ? 'rgba(17,17,17,.25)' : C.line}`, opacity: i > cur ? 0.7 : 1, transform: `scale(${on ? L(0.94, 1, a) : 1})`}}>
            <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 26, color: on ? C.green : done ? C.green : C.ink3}}>{done ? '✓' : `0${i + 1}`}</div>
            <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em', color: on ? '#fff' : i > cur ? C.ink3 : C.ink}}>{n}</div>
          </div>
        );
      })}
    </div>
  );
};

export const D1Point: React.FC<{i: number}> = ({i}) => {
  const {t, sc, wt} = useV();
  const K = useCopy();
  const s = sc(`p${i + 1}`).start;
  const e = sc(`p${i + 1}`).end;
  const inP = eo5(P(t, s, s + 0.45));
  const outP = ei(P(t, e - 0.26, e));
  const keys = K.bulletKeys[i] as [string, string][];
  return (
    <>
      <Deck cur={i} />
      <div style={{position: 'absolute', left: 64, top: 420, width: 952, transform: `translateX(${(1 - inP) * 1000 - outP * 1100}px) rotate(${(1 - inP) * 4 - outP * 3}deg)`}}>
        <Card style={{height: 980, position: 'relative', overflow: 'hidden'}} pad={44}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Mono size={30} color={C.red}>{`0${i + 1} · ${K.nums[i]}`}</Mono>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.ink3}}>{`{ ${i + 1}/3 }`}</div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 6, height: 470, alignItems: 'center'}}>
            <div style={{transform: `translateY(${Math.sin(t * 1.8) * 5}px)`}}>
              <Icon strokes={ICONS[K.icons[i]]} at={s + 0.2} size={450} dur={1.0} />
            </div>
          </div>
          <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 128, letterSpacing: '-0.05em', color: C.ink, lineHeight: 0.9, opacity: eo(P(t, wt(`p${i + 1}`, K.names[i].toLowerCase()) - 0.1, wt(`p${i + 1}`, K.names[i].toLowerCase()) + 0.2))}}>{K.names[i]}</div>
          <div style={{fontFamily: SERIF, fontSize: 84, color: C.red, lineHeight: 1.05, marginTop: 6, opacity: eo(P(t, wt(`p${i + 1}`, K.eqKey[i]) - 0.1, wt(`p${i + 1}`, K.eqKey[i]) + 0.25)), transform: `translateX(${(1 - eo(P(t, wt(`p${i + 1}`, K.eqKey[i]) - 0.1, wt(`p${i + 1}`, K.eqKey[i]) + 0.3))) * 40}px)`}}>{K.eq[i]}</div>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 30}}>
            {K.bullets[i].map((b, j) => {
              const at = wt(keys[j][0], keys[j][1]);
              return (
                <div key={b} style={{...popStyle(t, at - 0.05, 0, 0.6), display: 'flex', alignItems: 'center', gap: 12, background: C.greenTint, borderRadius: 999, padding: '14px 24px', fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink}}>
                  <span style={{color: C.green, fontWeight: 800}}>✓</span>
                  {b}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Braces x={1010} y={1330} at={s + 0.6} size={54} color={C.green} />
    </>
  );
};

// ======================= PUNCHLINE: the order =======================
export const D1Punch: React.FC = () => {
  const {t, sc, wt} = useV();
  const K = useCopy();
  const s = sc('punch').start;
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={s + 0.02}>
          <Head size={140}>
            {K.punchTitle[0]} <Em scale={1.2}>{K.punchTitle[1]}</Em>
          </Head>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', left: 80, top: 470, width: 920}}>
        {K.order.map(([lab, em, key], i) => {
          const at = wt('pu', key);
          const on = t >= at - 0.05;
          return (
            <div key={i} style={{position: 'relative', height: 280}}>
              {i < 2 ? (
                <div style={{position: 'absolute', left: 92, top: 196, width: 6, height: 96, background: `repeating-linear-gradient(${C.ink3} 0 10px, transparent 10px 20px)`, opacity: on ? 1 : 0.3}} />
              ) : null}
              <div style={{display: 'flex', alignItems: 'center', gap: 36, ...popStyle(t, at - 0.08, 0, 0.8), opacity: on ? 1 : 0.18}}>
                <Card style={{width: 190, height: 190, display: 'grid', placeItems: 'center', borderRadius: 40}} pad={0}>
                  <Icon strokes={ICONS[K.icons[i]]} at={at - 0.05} size={150} dur={0.7} />
                </Card>
                <div>
                  <Mono size={30} color={C.red}>{`0${i + 1} · ${lab}`}</Mono>
                  <div style={{fontFamily: SERIF, fontSize: 104, color: C.ink, lineHeight: 1, marginTop: 6}}>{em}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Spark x={960} y={330} size={64} at={s + 0.4} />
    </>
  );
};

// ======================= COMMENT TRIGGER =======================
export const D1Trigger: React.FC = () => {
  const {t, sc, wt, ln} = useV();
  const K = useCopy();
  const s = sc('trigger').start;
  const typeAt = ln('tg').end - 0.2;
  const n = Math.floor(clamp((t - typeAt) * 12, 0, [...K.typed].length));
  const posted = t > typeAt + [...K.typed].length / 12 + 0.25;
  return (
    <>
      <Abs x={64} y={276}>
        <Rise at={s + 0.02}>
          <Head size={120}>{K.trigTitle[0]}</Head>
        </Rise>
        <Rise at={s + 0.12}>
          <Head size={120}>
            <Em scale={1.25}>{K.trigTitle[1]}</Em>
          </Head>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', left: 96, top: 570, width: 888, display: 'flex', flexDirection: 'column', gap: 22}}>
        {K.choices.map(([c, key], i) => {
          const at = wt('tg', key, key === 'back' ? 0 : 0);
          const pulse = Math.sin(Math.PI * P(t, at, at + 0.35));
          return (
            <div key={c} style={{...popStyle(t, s + 0.2 + i * 0.1, 0, 0.7), display: 'flex', alignItems: 'center', gap: 24, borderRadius: 34, padding: '22px 30px', background: t >= at ? C.ink : '#fff', border: `3px solid ${C.ink}`, transform: `scale(${1 + 0.05 * pulse})`}}>
              <div style={{width: 92, height: 92, borderRadius: 24, background: '#fff', display: 'grid', placeItems: 'center'}}>
                <Icon strokes={ICONS[K.icons[i]]} at={s + 0.3 + i * 0.1} size={80} dur={0.6} />
              </div>
              <div style={{fontFamily: HEAD, fontWeight: 900, fontSize: 58, letterSpacing: '-0.03em', color: t >= at ? '#fff' : C.ink}}>{c}</div>
              <div style={{marginLeft: 'auto', fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.green}}>{t >= at ? '✓' : ''}</div>
            </div>
          );
        })}
      </div>
      {/* instagram comment bar */}
      <div style={{position: 'absolute', left: 96, top: 1180, width: 888, display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 999, padding: '16px 18px 16px 18px', boxShadow: '0 20px 40px -24px rgba(17,17,17,.4)', border: `1.5px solid ${C.line}`, ...popStyle(t, typeAt - 0.4, 0, 0.8)}}>
        <div style={{width: 64, height: 64, borderRadius: 99, background: 'linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)', padding: 4}}>
          <div style={{width: '100%', height: '100%', borderRadius: 99, background: '#ddd'}} />
        </div>
        <div style={{flex: 1, fontFamily: SANS, fontWeight: 600, fontSize: 36, color: n ? C.ink : C.ink3}}>
          {n ? [...K.typed].slice(0, n).join('') : 'Add a comment…'}
          {!posted && n ? <span style={{display: 'inline-block', width: 3, height: 38, background: C.ig, marginLeft: 3, verticalAlign: '-6px'}} /> : null}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: posted ? C.ink3 : C.ig, paddingRight: 14}}>{posted ? '❤️' : 'Post'}</div>
      </div>
    </>
  );
};

// ======================= END CARD =======================
export const EndCard: React.FC<{dark?: boolean; dm: string; sign: string; scene?: string}> = ({dm, sign, scene = 'cta'}) => {
  const {t, sc, ln} = useV();
  const s = sc(scene).start;
  const signAt = ln('so').start + 0.15;
  return (
    <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        <div style={{...popStyle(t, s + 0.05, 0, 0.7)}}>
          <div style={{transform: 'scale(2.1)', margin: '40px 0 44px'}}>
            <LogoInline />
          </div>
        </div>
        <div style={{...popStyle(t, s + 0.25, 0, 0.8), fontFamily: HEAD, fontWeight: 900, fontSize: 84, letterSpacing: '-0.04em', color: C.ink}}>
          localhostlabs<span style={{fontFamily: SERIF, fontWeight: 400, color: C.red}}>.tech</span>
        </div>
        <div style={{...popStyle(t, s + 0.4, 0, 0.6), background: C.green, color: '#04281a', borderRadius: 999, padding: '20px 40px', fontFamily: HEAD, fontWeight: 900, fontSize: 48, letterSpacing: '-0.02em'}}>{dm}</div>
      </div>
      <div style={{position: 'absolute', left: 96, top: 880, width: 888, background: C.term, borderRadius: 30, padding: '24px 34px 34px', boxShadow: '0 40px 80px -40px rgba(0,0,0,.6)', ...popStyle(t, signAt - 0.35, 0, 0.85)}}>
        <div style={{display: 'flex', gap: 12, marginBottom: 24}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{width: 18, height: 18, borderRadius: 99, background: c}} />
          ))}
          <span style={{marginLeft: 16, fontFamily: MONO, fontSize: 22, color: C.termDim}}>~/localhost-labs</span>
        </div>
        <TypedLine text={sign} at={signAt} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center', gap: 22, ...popStyle(t, s + 0.6, 0, 0.8)}}>
        {['🔖 Save', '➕ Follow @localhostlabs'].map((x) => (
          <div key={x} style={{background: '#fff', border: `2px solid ${C.line}`, borderRadius: 999, padding: '16px 28px', fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.ink}}>{x}</div>
        ))}
      </div>
      <Braces x={1000} y={380} at={s + 0.5} size={60} />
      <Spark x={110} y={820} size={60} at={s + 0.7} color={C.green} />
    </>
  );
};
const LogoInline: React.FC = () => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
    <div style={{width: 52, height: 52, background: C.red, color: '#241910', transform: 'rotate(-8deg)', display: 'grid', placeItems: 'center', fontFamily: MONO, fontWeight: 800, fontSize: 28}}>ll</div>
    <div style={{fontFamily: HEAD, fontWeight: 800, fontSize: 38, letterSpacing: '-0.04em', color: C.ink}}>
      localhost <span style={{fontFamily: SERIF, fontWeight: 400, fontSize: 44}}>labs</span>
    </div>
  </div>
);
const TypedLine: React.FC<{text: string; at: number}> = ({text, at}) => {
  const {t} = useV();
  const n = Math.floor(clamp((t - at) * 20, 0, text.length));
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 46, color: C.green, minHeight: 60, whiteSpace: 'pre'}}>
      {text.slice(0, n)}
      <span style={{display: 'inline-block', width: 24, height: 46, background: C.green, verticalAlign: '-6px', marginLeft: 4, opacity: n < text.length || blink ? 1 : 0}} />
    </div>
  );
};

export const D1Cta: React.FC = () => {
  const K = useCopy();
  return <EndCard dm={K.dm} sign={K.sign} />;
};

export const D1 = {hook: D1Hook, ctx: D1Ctx, trans: D1Trans, p1: () => <D1Point i={0} />, p2: () => <D1Point i={1} />, p3: () => <D1Point i={2} />, punch: D1Punch, trigger: D1Trigger, cta: D1Cta};
// silence unused helpers in strict mode
export const _u = [eb, Tap, outStyle];
