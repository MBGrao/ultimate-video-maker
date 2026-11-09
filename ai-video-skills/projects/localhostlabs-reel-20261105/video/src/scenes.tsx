import React from 'react';
import {C, DISPLAY, L, LN, MONO, P, SANS, SC, SERIF, clamp, eb, ei, eo, eo5, spr, wt} from './brand';
import {Abs, Badge, Em, Head, Kicker, LogRow, Mark, Mascot, Phone, Plus, Rise, Sparkle, Stamp, Tap} from './parts';

type S = {t: number};

/** slide/fade a block out over [a, a+d] */
const out = (t: number, a: number, d = 0.25) => {
  const q = ei(P(t, a, a + d));
  return {opacity: 1 - q, transform: `translateY(${-q * 60}px)`};
};
/** pop in at `at` with a springy scale */
const pop = (t: number, at: number, rot = 0, from = 0.6) => {
  const p = clamp(spr(t, at, 11, 7), 0, 1.2);
  const a = clamp((t - at) / 0.12);
  return {opacity: a, transform: `scale(${L(from, 1, p)}) rotate(${rot}deg)`};
};
const float = (t: number, seed: number, amp = 6) => `translateY(${Math.sin(t * 1.7 + seed) * amp}px)`;

// =====================================================================================
// HOOK  "Ek aur banda rakhne ka soch rahe ho? Ruko." -> "Aapko staff nahi, system chahiye."
// =====================================================================================
const Person: React.FC<{dashed?: boolean; color?: string}> = ({dashed, color = C.ink}) => (
  <div style={{width: 170, height: 250, position: 'relative'}}>
    <div style={{position: 'absolute', left: 45, top: 0, width: 80, height: 80, borderRadius: 99, background: dashed ? 'transparent' : color, border: dashed ? `6px dashed ${color}` : 'none', boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 10, top: 96, width: 150, height: 150, borderRadius: '75px 75px 18px 18px', background: dashed ? 'transparent' : color, border: dashed ? `6px dashed ${color}` : 'none', boxSizing: 'border-box'}} />
  </div>
);

export const HookScene: React.FC<S> = ({t}) => {
  const h2 = LN.hook2.start;
  const partA = t < h2 + 0.05;
  const strike = eo(P(t, wt('hook2', 'nahi') - 0.05, wt('hook2', 'nahi') + 0.3));
  return (
    <>
      {partA ? (
        <div style={{position: 'absolute', inset: 0, ...out(t, h2 - 0.22)}}>
          <Abs x={80} y={300}>
            <Rise t={t} at={0}>
              <Kicker dot={C.acc}>Business owners, suno</Kicker>
            </Rise>
          </Abs>
          <Abs x={72} y={372}>
            <Rise t={t} at={0.02}>
              <Head size={228}>Ek aur</Head>
            </Rise>
            <Rise t={t} at={0.1}>
              <Head size={228} color={C.acc}>
                banda?
              </Head>
            </Rise>
          </Abs>
          <div style={{position: 'absolute', left: 60, top: 880, width: 960, display: 'flex', justifyContent: 'center', gap: 34}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={pop(t, wt('hook1', 'banda') + i * 0.12)}>
                <Person />
              </div>
            ))}
            <div style={{...pop(t, wt('hook1', 'soch')), position: 'relative'}}>
              <Person dashed color={C.acc} />
              <div style={{position: 'absolute', right: -14, top: -20, background: C.acc, color: C.accDeep, fontFamily: DISPLAY, fontWeight: 800, fontSize: 48, padding: '4px 16px', borderRadius: 99}}>+1</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center'}}>
            <Stamp t={t} at={wt('hook1', 'ruko') - 0.04} size={150} bg={C.page} rot={-9}>
              Ruko.
            </Stamp>
          </div>
          <Sparkle x={950} y={430} size={90} t={t} at={0.35} />
          <Plus x={120} y={800} t={t} at={0.5} />
        </div>
      ) : null}
      {t >= h2 - 0.05 ? (
        <div style={{position: 'absolute', inset: 0}}>
          <Abs x={80} y={300}>
            <Rise t={t} at={h2 - 0.05}>
              <Kicker dot={C.acc}>Asli jawab</Kicker>
            </Rise>
          </Abs>
          <Abs x={72} y={372}>
            <Rise t={t} at={wt('hook2', 'staff') - 0.1}>
              <Head size={160}>
                <span style={{position: 'relative', display: 'inline-block'}}>
                  Staff
                  <svg width="100%" height="60" viewBox="0 0 100 20" preserveAspectRatio="none" style={{position: 'absolute', left: '-4%', top: '38%', width: '108%'}}>
                    <path d="M2 12 C 30 8, 60 14, 98 7" stroke={C.acc} strokeWidth="5" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
                  </svg>
                </span>{' '}
                nahi,
              </Head>
            </Rise>
            <Rise t={t} at={wt('hook2', 'system') - 0.08} style={{marginTop: 6}}>
              <div style={{fontFamily: SERIF, fontSize: 330, lineHeight: 0.86, color: C.acc, letterSpacing: '-0.02em', paddingLeft: 6}}>system</div>
            </Rise>
            <Rise t={t} at={wt('hook2', 'chahiye') - 0.06}>
              <Head size={176}>chahiye.</Head>
            </Rise>
          </Abs>
          <div style={{position: 'absolute', left: 80, top: 1150, display: 'flex', gap: 18, flexWrap: 'wrap', width: 920}}>
            {['CRM', 'ERP', 'Automation', 'Integrations'].map((s, i) => (
              <div
                key={s}
                style={{
                  ...pop(t, wt('hook2', 'chahiye') + 0.02 + i * 0.07),
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 32,
                  padding: '14px 26px',
                  borderRadius: 99,
                  border: `3px solid ${C.ink}`,
                  background: i === 0 ? C.ink : C.card,
                  color: i === 0 ? C.page : C.ink,
                  textTransform: 'uppercase',
                }}
              >
                {s}
              </div>
            ))}
          </div>
          <Sparkle x={930} y={760} size={110} t={t} at={wt('hook2', 'system') + 0.15} spin={1} />
          <Sparkle x={845} y={640} size={50} t={t} at={wt('hook2', 'system') + 0.3} />
          <Plus x={1000} y={1080} t={t} at={wt('hook2', 'chahiye')} color={C.acc} />
        </div>
      ) : null}
    </>
  );
};

// =====================================================================================
// STORY (dark)  orders in one sheet, stock in another, approval on WhatsApp, invoice in an inbox
// =====================================================================================
const Sheet: React.FC<{name: string; tint?: string}> = ({name, tint = '#b8e2c2'}) => (
  <div style={{width: 420, background: C.card, borderRadius: 12, padding: '20px 22px 22px', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)'}}>
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12}}>
      <span style={{background: '#1f7a44', color: '#fff', fontFamily: MONO, fontSize: 20, padding: '4px 8px', borderRadius: 5}}>XLS</span>
      {name}
    </div>
    {[0, 1, 2].map((r) => (
      <div key={r} style={{display: 'flex', gap: 6, marginTop: 6}}>
        {[0, 1, 2, 3].map((c) => (
          <div key={c} style={{flex: c === 0 ? 1.6 : 1, height: 20, background: r === 0 ? tint : '#e8efe8', borderRadius: 3}} />
        ))}
      </div>
    ))}
  </div>
);

const Card: React.FC<{children: React.ReactNode; w?: number; bg?: string}> = ({children, w = 400, bg = C.card}) => (
  <div style={{width: w, background: bg, borderRadius: 12, padding: '20px 24px', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)', fontFamily: SANS, color: C.ink}}>{children}</div>
);

export const StoryScene: React.FC<S> = ({t}) => {
  const s1 = LN.s1, s2 = LN.s2, s3 = LN.s3;
  const heads: [number, number, React.ReactNode, React.ReactNode][] = [
    [s1.start - 0.05, s2.start - 0.3, 'Orders yahan,', <>stock <Em color={C.lime}>wahan.</Em></>],
    [s2.start - 0.05, s3.start - 0.3, 'Approval', <><Em color={C.lime}>WhatsApp</Em> pe.</>],
    [s3.start - 0.05, 99, 'Har hafte', <><Em color={C.lime}>ghante</Em> zaaya.</>],
  ];
  const chaos = P(t, s3.start, s3.start + 0.4);
  const shake = (seed: number) => (chaos > 0 ? `translate(${Math.sin(t * 31 + seed) * 3 * chaos}px, ${Math.cos(t * 27 + seed) * 3 * chaos}px)` : '');
  const items: {x: number; y: number; rot: number; at: number; el: React.ReactNode}[] = [
    {x: 60, y: 660, rot: -6, at: wt('s1', 'orders'), el: <Sheet name="orders_final_v7.xlsx" />},
    {x: 590, y: 720, rot: 5, at: wt('s1', 'stock'), el: <Sheet name="stock (2).xlsx" tint="#f6d77b" />},
    {
      x: 440,
      y: 930,
      rot: -3,
      at: wt('s2', 'whatsapp'),
      el: (
        <div style={{background: C.wa, borderRadius: '22px 22px 22px 6px', padding: '22px 26px 16px', width: 470, boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)', fontFamily: SANS}}>
          <div style={{fontWeight: 700, fontSize: 36, color: '#111'}}>Bhai, aaj ka stock bhej do 🙏</div>
          <div style={{fontFamily: MONO, fontSize: 22, color: '#5d7a63', textAlign: 'right', marginTop: 8}}>11:52 ✓✓</div>
        </div>
      ),
    },
    {
      x: 70,
      y: 960,
      rot: 4,
      at: wt('s2', 'invoice'),
      el: (
        <Card w={390}>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.ink3, borderBottom: `3px solid #3b6fd6`, paddingBottom: 8, marginBottom: 10}}>accounts@</div>
          <div style={{fontWeight: 700, fontSize: 30}}>Fwd: Fwd: RE: invoice??</div>
        </Card>
      ),
    },
    {
      x: 610,
      y: 1150,
      rot: -5,
      at: wt('s2', 'inbox'),
      el: (
        <Card w={370}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, fontWeight: 700, fontSize: 30}}>
            <span style={{background: '#d93025', color: '#fff', fontFamily: MONO, fontSize: 20, padding: '6px 9px', borderRadius: 5}}>PDF</span>
            invoice-0931.pdf
          </div>
        </Card>
      ),
    },
    {
      x: 90,
      y: 1185,
      rot: 7,
      at: wt('s3', 'har'),
      el: (
        <div style={{background: C.sticky, width: 400, padding: '26px 26px', fontFamily: SERIF, fontSize: 48, color: '#2b2205', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)'}}>Call supplier!!! (again)</div>
      ),
    },
    {
      x: 560,
      y: 1255,
      rot: -4,
      at: wt('s3', 'data') - 0.25,
      el: (
        <Card w={430}>
          <div style={{fontWeight: 700, fontSize: 32}}>Monthly report</div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.ink3, marginTop: 6}}>copy from 4 sheets</div>
        </Card>
      ),
    },
  ];
  // copy-paste runs: cursor carries a ghost cell from the orders sheet to the report, twice
  const runs = [wt('s3', 'idhar') - 0.15, wt('s3', 'udhar') + 0.15];
  return (
    <>
      <Abs x={80} y={300}>
        <Rise t={t} at={SC.story.start + 0.05}>
          <Kicker color={C.acc} dot={C.acc}>
            01 · Ahmed bhai ka haal
          </Kicker>
        </Rise>
      </Abs>
      {heads.map(([a, b, l1, l2], i) =>
        t >= a && t < b + 0.3 ? (
          <Abs key={i} x={72} y={366}>
            <Rise t={t} at={a} out={b}>
              <Head size={114} color={C.darkInk}>
                {l1}
              </Head>
            </Rise>
            <Rise t={t} at={a + 0.07} out={b + 0.03}>
              <Head size={114} color={C.darkInk}>
                {l2}
              </Head>
            </Rise>
          </Abs>
        ) : null,
      )}
      {items.map((it, i) => (
        <Abs key={i} x={it.x} y={it.y} style={{...pop(t, it.at, it.rot, 0.4), zIndex: i}}>
          <div style={{transform: `${float(t, i * 1.3)} ${shake(i)}`}}>{it.el}</div>
        </Abs>
      ))}
      {runs.map((r, i) => {
        const p = eo(P(t, r, r + 0.55));
        if (t < r || t > r + 0.95) return null;
        const x = L(250, 760, p), y = L(780, 1300, p);
        const fade = 1 - P(t, r + 0.7, r + 0.95);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, zIndex: 20, opacity: fade}}>
            <div style={{width: 120, height: 34, background: '#b8e2c2', border: '3px dashed #1f7a44', borderRadius: 4, transform: 'translate(10px, 30px) rotate(-4deg)'}} />
            <svg width="54" height="64" viewBox="0 0 24 28" style={{position: 'absolute', left: 0, top: 0}}>
              <path d="M2 2 L2 22 L7.5 17 L11 25 L14.5 23.5 L11 15.5 L18 15.5 Z" fill="#fff" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <div style={{position: 'absolute', left: 60, top: -50, background: C.lime, color: C.limeDeep, fontFamily: MONO, fontWeight: 700, fontSize: 34, padding: '6px 14px', borderRadius: 10, whiteSpace: 'nowrap'}}>
              {p < 0.6 ? '⌘C' : '⌘V'}
            </div>
          </div>
        );
      })}
    </>
  );
};

// =====================================================================================
// TRANSITION  "Chalo, dukaan ke khaate aur munshi se samajhte hain."
// =====================================================================================
export const Ledger: React.FC<{w: number}> = ({w}) => (
  <div style={{position: 'relative', width: w, height: w * 0.74}}>
    <div style={{position: 'absolute', inset: 0, background: '#b3261e', borderRadius: w * 0.04, boxShadow: `inset ${w * 0.07}px 0 0 #7d1812, 0 30px 60px -24px rgba(27,25,20,.6)`}} />
    <div style={{position: 'absolute', left: w * 0.03, top: -w * 0.02, width: w * 0.94, height: w * 0.05, background: '#f3ead2', borderRadius: 4, zIndex: -1}} />
    <div style={{position: 'absolute', left: w * 0.24, top: w * 0.2, width: w * 0.6, height: w * 0.22, border: `${w * 0.012}px solid #f6d77b`, borderRadius: w * 0.02, display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontWeight: 800, color: '#f6d77b', fontSize: w * 0.11, letterSpacing: '0.04em'}}>
      KHAATA
    </div>
    <div style={{position: 'absolute', left: w * 0.5, top: 0, width: w * 0.02, height: w * 0.9, background: '#f6d77b', transform: 'rotate(4deg)'}} />
  </div>
);

export const TransScene: React.FC<S> = ({t}) => {
  const tr = LN.tr;
  return (
    <>
      <Abs x={80} y={300}>
        <Rise t={t} at={tr.start - 0.08}>
          <Kicker dot={C.acc}>Simple misaal</Kicker>
        </Rise>
      </Abs>
      <Abs x={72} y={370}>
        <Rise t={t} at={tr.start - 0.05}>
          <Head size={176}>Chalo,</Head>
        </Rise>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 4}}>
          <Rise t={t} at={wt('tr', 'khaate') - 0.1}>
            <div style={{fontFamily: SERIF, fontSize: 210, color: C.acc, lineHeight: 0.9}}>khaata</div>
          </Rise>
          <Rise t={t} at={wt('tr', 'aur') - 0.05}>
            <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 150, color: C.ink, lineHeight: 0.9}}>+</div>
          </Rise>
        </div>
        <Rise t={t} at={wt('tr', 'munshi') - 0.1}>
          <div style={{fontFamily: SERIF, fontSize: 210, color: C.acc, lineHeight: 0.9}}>munshi</div>
        </Rise>
      </Abs>
      <Abs x={110} y={1010} style={pop(t, wt('tr', 'khaate'), -6, 0.3)}>
        <div style={{transform: float(t, 1)}}>
          <Ledger w={380} />
        </div>
      </Abs>
      <Abs x={640} y={920} style={pop(t, wt('tr', 'munshi'), 0, 0.3)}>
        <Mascot t={t} size={330} wave={P(t, wt('tr', 'munshi'), wt('tr', 'munshi') + 0.3)} ledger={false} />
      </Abs>
      <Abs x={920} y={1060} style={pop(t, wt('tr', 'samajhte'), 0, 0.5)}>
        <div style={{fontSize: 80, transform: `translateY(${Math.sin(t * 6) * 8}px)`}}>👇</div>
      </Abs>
      <Sparkle x={960} y={420} size={90} t={t} at={tr.start + 0.2} spin={1} />
      <Plus x={980} y={1300} t={t} at={wt('tr', 'munshi')} color={C.acc} />
    </>
  );
};

// =====================================================================================
// POINT 1  "Pehla: ek hi khaata. Orders, stock, invoice, sab ek jagah."  (site's Operations · live panel)
// =====================================================================================
const Metric: React.FC<{label: string; value: number; t: number; at: number; warn?: boolean}> = ({label, value, t, at, warn}) => {
  const lit = P(t, at - 0.05, at + 0.2);
  const n = Math.round(value * eo(P(t, at, at + 0.6)));
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 16,
        padding: '22px 22px 18px',
        background: lit > 0.5 ? (warn ? '#fde3d9' : '#eef6dc') : C.paper,
        border: `3px solid ${lit > 0.5 ? (warn ? C.acc : C.ok) : C.line}`,
        transform: `scale(${1 + 0.06 * Math.sin(Math.PI * clamp(lit))})`,
      }}
    >
      <div style={{fontFamily: MONO, fontSize: 22, color: C.ink2, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap'}}>{label}</div>
      <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 92, color: warn && lit > 0.5 ? C.acc : C.ink, letterSpacing: '-0.04em', lineHeight: 1.05, fontVariantNumeric: 'tabular-nums'}}>{n}</div>
    </div>
  );
};

export const P1Scene: React.FC<S> = ({t}) => {
  const p1 = LN.p1;
  const st = SC.p1.start;
  const panel = eo5(P(t, st + 0.05, st + 0.5));
  const rows = ['Invoice synced to accounts', 'Low stock → WhatsApp alert', 'New lead → CRM, owner assigned'];
  const ra = [wt('p1', 'sab'), wt('p1', 'ek', 1), wt('p1', 'jagah')];
  // little chaos icons get pulled into the panel
  const icons = [
    {s: 'XLS', bg: '#1f7a44', x0: -120, y0: 700},
    {s: '💬', bg: C.wa, x0: 1150, y0: 820},
    {s: '✉', bg: '#3b6fd6', x0: -100, y0: 1220},
    {s: 'PDF', bg: '#d93025', x0: 1150, y0: 1300},
  ];
  return (
    <>
      <div style={{position: 'absolute', left: 80, top: 290, display: 'flex', alignItems: 'center', gap: 26}}>
        <Badge n={1} t={t} at={st + 0.02} />
        <Rise t={t} at={st + 0.08}>
          <Kicker dot={C.acc}>Pehla</Kicker>
        </Rise>
      </div>
      <Abs x={72} y={450}>
        <Rise t={t} at={wt('p1', 'ek') - 0.1}>
          <Head size={150}>
            Ek hi <Em scale={1.1}>khaata.</Em>
          </Head>
        </Rise>
      </Abs>
      {icons.map((ic, i) => {
        const q = eio2(P(t, st + 0.05 + i * 0.06, st + 0.55 + i * 0.06));
        if (q >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: L(ic.x0, 500, q),
              top: L(ic.y0, 1000, q),
              width: 96,
              height: 96,
              borderRadius: 20,
              background: ic.bg,
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 30,
              transform: `scale(${1 - 0.7 * q}) rotate(${(1 - q) * 30}deg)`,
              zIndex: 5,
            }}
          >
            {ic.s}
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 700,
          width: 936,
          background: C.card,
          borderRadius: 24,
          border: `2px solid ${C.line}`,
          boxShadow: '0 40px 80px -40px rgba(27,25,20,.55)',
          padding: '26px 30px 30px',
          opacity: panel,
          transform: `translateY(${(1 - panel) * 80}px) scale(${L(0.94, 1, panel)})`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: MONO, fontSize: 26, color: C.ink2, marginBottom: 22}}>
          <span style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700, color: C.ink}}>
            <span style={{width: 14, height: 14, borderRadius: 99, background: C.ok, opacity: 0.5 + 0.5 * Math.abs(Math.sin(t * 3))}} />
            Operations · live
          </span>
          <span>Today</span>
        </div>
        <div style={{display: 'flex', gap: 16}}>
          <Metric label="Orders" value={128} t={t} at={wt('p1', 'orders')} />
          <Metric label="Stock alerts" value={2} t={t} at={wt('p1', 'stock')} warn />
          <Metric label="Open invoices" value={3} t={t} at={wt('p1', 'invoice')} />
        </div>
        <div style={{marginTop: 22}}>
          {rows.map((r, i) => {
            const a = eo(P(t, ra[i] - 0.05, ra[i] + 0.25));
            return (
              <div key={r} style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: SANS, fontWeight: 600, fontSize: 33, color: C.ink, padding: '13px 0', borderTop: `2px dashed ${C.line}`, opacity: L(0.18, 1, a)}}>
                <span style={{color: C.ok, fontWeight: 800, transform: `scale(${eb(a)})`, display: 'inline-block'}}>✓</span>
                {r}
              </div>
            );
          })}
        </div>
      </div>
      <Sparkle x={990} y={520} size={80} t={t} at={wt('p1', 'khaata')} spin={1} />
      <Plus x={60} y={660} t={t} at={wt('p1', 'orders')} color={C.acc} />
      {/* tiny unused var guard */}
      <span style={{display: 'none'}}>{p1.start}</span>
    </>
  );
};
const eio2 = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// =====================================================================================
// POINT 2 (dark)  "Doosra: ek munshi jo kabhi nahi sota." / "Stock bees se kam hua, to WhatsApp alert khud chala gaya."
// =====================================================================================
export const P2Scene: React.FC<S> = ({t}) => {
  const a = LN.p2a, b = LN.p2b;
  const st = SC.p2.start;
  const inB = t >= b.start - 0.2;
  const mascotOut = ei(P(t, b.start - 0.25, b.start + 0.05));
  // stock counter: 26 -> 19 across "bees se kam"
  const n = Math.round(L(26, 19, eo(P(t, wt('p2b', 'bees') - 0.1, wt('p2b', 'hua')))));
  const low = n < 20;
  const notif = eo5(P(t, wt('p2b', 'whatsapp') - 0.1, wt('p2b', 'whatsapp') + 0.35));
  return (
    <>
      <div style={{position: 'absolute', left: 80, top: 290, display: 'flex', alignItems: 'center', gap: 26}}>
        <Badge n={2} t={t} at={st + 0.02} bg={C.lime} fg={C.limeDeep} />
        <Rise t={t} at={st + 0.08}>
          <Kicker color={C.lime} dot={C.lime}>
            Doosra
          </Kicker>
        </Rise>
      </div>
      <Abs x={72} y={450}>
        <Rise t={t} at={wt('p2a', 'munshi') - 0.12}>
          <Head size={150} color={C.darkInk}>
            Munshi jo
          </Head>
        </Rise>
        <Rise t={t} at={wt('p2a', 'nahi') - 0.12}>
          <Head size={150} color={C.darkInk}>
            sota <Em color={C.lime}>nahi.</Em>
          </Head>
        </Rise>
      </Abs>
      {!inB || mascotOut < 1 ? (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - mascotOut, transform: `scale(${1 - 0.2 * mascotOut})`, transformOrigin: '50% 75%'}}>
          {/* moon + stars: it is night, the munshi is still awake */}
          <Abs x={150} y={820} style={pop(t, wt('p2a', 'kabhi'), 0, 0.3)}>
            <div style={{width: 170, height: 170, borderRadius: 99, boxShadow: `-34px 26px 0 0 ${C.lime}`, transform: 'rotate(-20deg)'}} />
          </Abs>
          {[
            [130, 1120, 40],
            [300, 1010, 26],
            [880, 860, 34],
            [950, 1180, 24],
          ].map(([x, y, s], i) => (
            <Sparkle key={i} x={x} y={y} size={s} color={C.lime} t={t} at={wt('p2a', 'kabhi') + i * 0.08} />
          ))}
          <Abs x={380} y={790} style={pop(t, wt('p2a', 'munshi'), 0, 0.3)}>
            <Mascot t={t} size={330} wave={P(t, wt('p2a', 'sota'), wt('p2a', 'sota') + 0.2)} />
          </Abs>
          <Abs x={760} y={830} style={pop(t, wt('p2a', 'sota'), 8, 0.4)}>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 64, color: C.darkInk2, position: 'relative'}}>
              Zzz
              <div style={{position: 'absolute', left: -10, right: -10, top: '48%', height: 8, background: C.acc, transform: `rotate(-12deg) scaleX(${eo(P(t, wt('p2a', 'sota') + 0.15, wt('p2a', 'sota') + 0.4))})`, transformOrigin: 'left'}} />
            </div>
          </Abs>
        </div>
      ) : null}
      {inB ? (
        <>
          {/* stock card */}
          <Abs x={72} y={770} style={pop(t, b.start - 0.1, 0, 0.7)}>
            <div style={{width: 440, background: C.dark2, border: `3px solid ${low ? C.acc : C.darkLine}`, borderRadius: 22, padding: '26px 30px'}}>
              <div style={{fontFamily: MONO, fontSize: 25, color: C.darkInk2, letterSpacing: '0.1em', textTransform: 'uppercase'}}>Stock · live</div>
              <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 200, lineHeight: 1, color: low ? C.acc : C.darkInk, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums', marginTop: 6}}>{n}</div>
              <div style={{position: 'relative', height: 22, background: 'rgba(244,240,230,.1)', borderRadius: 99, marginTop: 18}}>
                <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(n / 40) * 100}%`, background: low ? C.acc : C.lime, borderRadius: 99}} />
                <div style={{position: 'absolute', left: '50%', top: -12, bottom: -12, width: 4, background: C.darkInk}} />
              </div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.darkInk2, marginTop: 14, textAlign: 'center'}}>min. 20</div>
            </div>
          </Abs>
          {/* phone lock screen with the WhatsApp alert */}
          <Phone w={400} h={470} screen="#1d2b24" style={{left: 608, top: 770, transform: `translateY(${(1 - eo5(P(t, b.start - 0.1, b.start + 0.4))) * 900}px)`}}>
            <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#2c4a3b,#0f1a15)'}} />
            <div style={{position: 'absolute', top: 54, left: 0, right: 0, textAlign: 'center', color: '#fff', fontFamily: DISPLAY, fontWeight: 600, fontSize: 84, letterSpacing: '-0.03em'}}>09:21</div>
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: 14,
                top: 170,
                background: 'rgba(250,250,250,.94)',
                borderRadius: 26,
                padding: '18px 18px 20px',
                transform: `translateY(${(1 - notif) * -160}px) scale(${L(0.9, 1, notif)})`,
                opacity: notif,
                fontFamily: SANS,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: '#555'}}>
                <span style={{width: 34, height: 34, borderRadius: 9, background: '#25d366', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 20}}>✆</span>
                WHATSAPP · now
              </div>
              <div style={{fontWeight: 700, fontSize: 26, color: '#111', marginTop: 10}}>⚠️ Low stock alert</div>
              <div style={{fontSize: 24, color: '#333', marginTop: 4, lineHeight: 1.25}}>Sirf 19 units bache hain. Reorder karein?</div>
            </div>
          </Phone>
          <Abs x={72} y={1268}>
            <LogRow time="09:21" a="Stock below 20 units" b="WhatsApp alert sent" t={t} at={wt('p2b', 'khud') - 0.15} dark />
          </Abs>
        </>
      ) : null}
      <span style={{display: 'none'}}>{a.start}</span>
    </>
  );
};

// =====================================================================================
// POINT 3  "Teesra: roz ki sales report, khud owner ki email pe."
// =====================================================================================
export const P3Scene: React.FC<S> = ({t}) => {
  const st = SC.p3.start;
  const win = eo5(P(t, st + 0.1, st + 0.55));
  const mailIn = eo5(P(t, wt('p3', 'sales') - 0.1, wt('p3', 'sales') + 0.3));
  const open = eo(P(t, wt('p3', 'email') - 0.2, wt('p3', 'email') + 0.3));
  const bars = [0.42, 0.55, 0.48, 0.7, 0.62, 0.86, 0.95];
  return (
    <>
      <div style={{position: 'absolute', left: 80, top: 290, display: 'flex', alignItems: 'center', gap: 26}}>
        <Badge n={3} t={t} at={st + 0.02} />
        <Rise t={t} at={st + 0.08}>
          <Kicker dot={C.acc}>Teesra</Kicker>
        </Rise>
      </div>
      <Abs x={72} y={450}>
        <Rise t={t} at={wt('p3', 'report') - 0.15}>
          <Head size={170}>Report</Head>
        </Rise>
        <Rise t={t} at={wt('p3', 'khud') - 0.12}>
          <Head size={170}>
            <Em>khud</Em> aaye.
          </Head>
        </Rise>
      </Abs>
      {/* mail window */}
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 790,
          width: 936,
          height: 450,
          background: C.card,
          borderRadius: 22,
          border: `2px solid ${C.line}`,
          overflow: 'hidden',
          boxShadow: '0 40px 80px -40px rgba(27,25,20,.55)',
          opacity: win,
          transform: `translateY(${(1 - win) * 80}px)`,
        }}
      >
        <div style={{height: 64, background: C.paper, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px', borderBottom: `2px solid ${C.line}`}}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <span key={c} style={{width: 20, height: 20, borderRadius: 99, background: c}} />
          ))}
          <span style={{marginLeft: 20, fontFamily: MONO, fontSize: 24, color: C.ink2}}>Inbox</span>
          <span style={{marginLeft: 'auto', fontFamily: MONO, fontSize: 22, color: C.ink3}}>owner</span>
        </div>
        {/* new mail row */}
        <div
          style={{
            margin: '18px 20px 0',
            padding: '18px 22px',
            borderRadius: 14,
            background: open > 0.5 ? '#fde3d9' : '#fff',
            border: `2px solid ${open > 0.5 ? C.acc : C.line}`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            transform: `translateY(${(1 - mailIn) * -120}px)`,
            opacity: mailIn,
            fontFamily: SANS,
          }}
        >
          <Mark size={52} />
          <div style={{flex: 1}}>
            <div style={{fontWeight: 700, fontSize: 32, color: C.ink}}>Daily sales report</div>
            <div style={{fontSize: 24, color: C.ink2}}>Aaj ki sales, stock aur pending invoices</div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.ink2}}>09:30</div>
        </div>
        {[0, 1].map((i) => (
          <div key={i} style={{margin: '12px 20px 0', height: 70, borderRadius: 14, background: C.paper, opacity: (1 - open) * 0.8}} />
        ))}
        {/* opened mail: chart */}
        <div style={{position: 'absolute', left: 20, right: 20, top: 190, bottom: 20, opacity: open, display: 'flex', alignItems: 'flex-end', gap: 22, padding: '10px 30px 20px', borderRadius: 14, background: '#fff', border: `2px solid ${C.line}`}}>
          {bars.map((h, i) => {
            const g = eo(P(t, wt('p3', 'email') + i * 0.05, wt('p3', 'email') + 0.4 + i * 0.05));
            return <div key={i} style={{flex: 1, height: `${h * 100 * g}%`, background: i === bars.length - 1 ? C.acc : C.ink, borderRadius: '8px 8px 2px 2px'}} />;
          })}
        </div>
      </div>
      <Abs x={72} y={1268}>
        <LogRow time="09:30" a="Daily sales report" b="emailed to owners" t={t} at={wt('p3', 'owner') - 0.1} />
      </Abs>
      <Sparkle x={960} y={560} size={84} t={t} at={wt('p3', 'khud')} spin={1} />
    </>
  );
};

// =====================================================================================
// PUNCHLINE (orange)  "Agli baar koi bole, Excel kaafi hai, to bolna:" / "Excel khaata hai. Munshi nahi."
// =====================================================================================
export const PunchScene: React.FC<S> = ({t}) => {
  const a = LN.pu1, b = LN.pu2;
  const partA = t < b.start + 0.05;
  return (
    <>
      {partA ? (
        <div style={{position: 'absolute', inset: 0, ...out(t, b.start - 0.25)}}>
          <Abs x={72} y={330}>
            <Rise t={t} at={a.start - 0.05}>
              <Head size={176} color={C.accDeep}>
                Agli baar
              </Head>
            </Rise>
            <Rise t={t} at={wt('pu1', 'koi') - 0.1}>
              <Head size={176} color={C.accDeep}>
                koi bole…
              </Head>
            </Rise>
          </Abs>
          <Abs x={90} y={790} style={pop(t, wt('pu1', 'excel') - 0.1, -3, 0.5)}>
            <div style={{position: 'relative', background: C.page, borderRadius: 40, padding: '34px 50px 40px', boxShadow: '0 30px 60px -30px rgba(36,25,16,.7)'}}>
              <div style={{fontFamily: SERIF, fontSize: 118, color: C.ink, lineHeight: 1}}>“Excel kaafi hai.”</div>
              <div style={{position: 'absolute', left: 80, bottom: -40, width: 60, height: 60, background: C.page, clipPath: 'polygon(0 0,100% 0,0 100%)'}} />
            </div>
          </Abs>
          <Abs x={110} y={1100} style={pop(t, wt('pu1', 'excel') + 0.1, 0, 0.5)}>
            <div style={{fontSize: 110}}>🤷</div>
          </Abs>
          <Abs x={290} y={1150}>
            <Rise t={t} at={wt('pu1', 'bolna') - 0.1}>
              <Head size={96} color={C.accDeep}>
                To bolna 👇
              </Head>
            </Rise>
          </Abs>
        </div>
      ) : null}
      {t >= b.start - 0.05 ? (
        <>
          <Abs x={72} y={330}>
            <Rise t={t} at={b.start - 0.05}>
              <Head size={240} color={C.accDeep}>
                Excel
              </Head>
            </Rise>
            <Rise t={t} at={wt('pu2', 'khaata') - 0.08}>
              <Head size={176} color={C.accDeep}>
                <Em color={C.page}>khaata</Em> hai.
              </Head>
            </Rise>
          </Abs>
          <Abs x={640} y={1160} style={pop(t, wt('pu2', 'khaata'), 8, 0.3)}>
            <Ledger w={290} />
          </Abs>
          <div style={{position: 'absolute', left: 0, right: 0, top: 930, display: 'flex', justifyContent: 'center'}}>
            <Stamp t={t} at={wt('pu2', 'munshi') - 0.05} size={124} color={C.accDeep} bg={C.page} rot={-7}>
              Munshi nahi.
            </Stamp>
          </div>
        </>
      ) : null}
    </>
  );
};

// =====================================================================================
// SAVE  "Save kar lo, aur us dost ko bhejo jo abhi bhi sheets mein phansa hai."
// =====================================================================================
const Icon: React.FC<{d: string; fill?: boolean; size?: number; color?: string}> = ({d, fill, size = 50, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'} stroke={color} strokeWidth={1.9} strokeLinejoin="round" strokeLinecap="round">
    <path d={d} />
  </svg>
);
const IC = {
  heart: 'M12 20s-7-4.4-9.3-8.6C1.2 8.6 2.6 5 6 5c2 0 3.2 1.2 4 2.4C10.8 6.2 12 5 14 5c3.4 0 4.8 3.6 3.3 6.4C15 15.6 12 20 12 20z',
  comment: 'M20 12a8 8 0 1 1-3.1-6.3A8 8 0 0 1 20 12zM20 20l-3-3',
  send: 'M21 3 3 10.5l7 2.5 2.5 7L21 3zM10 13l5-5',
  save: 'M6 3h12v18l-6-5-6 5z',
};

/** the reel itself, shrunk inside a phone */
const MiniReel: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', inset: 0, background: C.page, backgroundImage: `linear-gradient(${C.line2} 1px, transparent 1px), linear-gradient(90deg, ${C.line2} 1px, transparent 1px)`, backgroundSize: '30px 30px'}}>
    <div style={{position: 'absolute', left: 30, top: 70}}>
      <div style={{transform: 'scale(.62)', transformOrigin: '0 0'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <Mark size={34} />
          <span style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: '-0.03em'}}>localhost</span>
        </div>
      </div>
      <div style={{marginTop: 30}}>
        <Head size={64}>Staff nahi,</Head>
        <div style={{fontFamily: SERIF, fontSize: 118, color: C.acc, lineHeight: 0.9}}>system</div>
        <Head size={64}>chahiye.</Head>
      </div>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, height: 34, background: C.acc, transform: 'rotate(-2deg)'}} />
    <div style={{position: 'absolute', left: 26, bottom: 130, fontFamily: SANS, fontWeight: 700, fontSize: 22, color: C.ink}}>@localhostlabs</div>
    <span style={{display: 'none'}}>{t}</span>
  </div>
);

export const SaveScene: React.FC<S> = ({t}) => {
  const st = SC.save.start;
  const tSave = wt('c1', 'save') + 0.1;
  const tSend = wt('c1', 'bhejo');
  const saved = t >= tSave;
  const sheet = eo5(P(t, tSend + 0.05, tSend + 0.4));
  const pick = t >= wt('c1', 'sheets');
  const ph = eo5(P(t, st + 0.05, st + 0.5));
  const PX = 290, PY = 560, PW = 500, PH = 830;
  const railX = PX + PW - 100;
  const yOf = (i: number) => PY + 340 + i * 105;
  return (
    <>
      <Abs x={72} y={300}>
        <Rise t={t} at={st + 0.02}>
          <Head size={158}>
            <Em scale={1.25}>save</Em> kar lo
          </Head>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - ph) * 900}px)`}}>
        <Phone w={PW} h={PH} style={{left: PX, top: PY}}>
          <MiniReel t={t} />
          {/* right rail */}
          {(['heart', 'comment', 'send', 'save'] as const).map((k, i) => (
            <div key={k} style={{position: 'absolute', right: 26, top: 325 + i * 105, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.35))'}}>
              <Icon d={IC[k]} color={k === 'save' && saved ? C.ink : C.ink} fill={k === 'save' && saved} size={k === 'save' && saved ? 50 * (1 + 0.25 * Math.sin(Math.PI * P(t, tSave, tSave + 0.3))) : 50} />
            </div>
          ))}
          {/* saved toast */}
          <div style={{position: 'absolute', left: 30, right: 30, bottom: 160, background: C.ink, color: C.page, borderRadius: 16, padding: '16px 20px', fontFamily: SANS, fontWeight: 700, fontSize: 26, opacity: env2(t, tSave + 0.05, tSend - 0.1), transform: `translateY(${(1 - env2(t, tSave + 0.05, tSend - 0.1)) * 30}px)`}}>
            Saved ✓ · baad mein dekho
          </div>
          {/* share sheet */}
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 360, background: '#fff', borderRadius: '30px 30px 0 0', transform: `translateY(${(1 - sheet) * 380}px)`, boxShadow: '0 -20px 40px -20px rgba(0,0,0,.3)', padding: '20px 26px', fontFamily: SANS}}>
            <div style={{width: 70, height: 7, borderRadius: 9, background: '#ddd', margin: '0 auto 22px'}} />
            <div style={{fontWeight: 700, fontSize: 28, color: C.ink, marginBottom: 20}}>Bhejo…</div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {['Dost', 'Bhai', 'Partner', 'Team'].map((n, i) => (
                <div key={n} style={{textAlign: 'center', width: 96}}>
                  <div style={{width: 84, height: 84, margin: '0 auto', borderRadius: 99, background: ['#f6d77b', '#b8e2c2', '#c9d6f7', '#f4c1b3'][i], display: 'grid', placeItems: 'center', fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.ink, border: i === 0 && pick ? `5px solid ${C.ig}` : '5px solid transparent'}}>
                    {i === 0 && pick ? '✓' : n[0]}
                  </div>
                  <div style={{fontSize: 22, color: C.ink2, marginTop: 8}}>{n}</div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 26, background: pick ? C.ig : '#cfe6fb', color: '#fff', textAlign: 'center', borderRadius: 14, padding: '14px 0', fontWeight: 700, fontSize: 28}}>Send</div>
          </div>
        </Phone>
        <Tap t={t} at={tSave} x={railX + 52} y={yOf(3) + 22} />
        <Tap t={t} at={tSend} x={railX + 52} y={yOf(2) + 22} />
        <Tap t={t} at={wt('c1', 'sheets')} x={PX + 15 + 26 + 48} y={PY + PH - 360 + 120 + 42 + 15} />
      </div>
      <Sparkle x={930} y={330} size={90} t={t} at={st + 0.3} spin={1} />
      <Abs x={36} y={1130} style={pop(t, wt('c1', 'dost'), -8, 0.4)}>
        <div style={{background: C.sticky, padding: '18px 22px', width: 190, fontFamily: SERIF, fontSize: 40, color: '#2b2205', lineHeight: 1.05, boxShadow: '0 18px 30px -16px rgba(0,0,0,.4)'}}>sheets mein phansa dost 😩</div>
      </Abs>
    </>
  );
};
const env2 = (t: number, a: number, b: number) => Math.min(eo(P(t, a, a + 0.25)), 1 - ei(P(t, b, b + 0.2)));

// =====================================================================================
// FOLLOW / CTA  "Follow karo. Aur free tees minute call ke liye, DM karo."
// =====================================================================================
export const FollowScene: React.FC<S> = ({t}) => {
  const st = SC.follow.start;
  const c2 = LN.c2;
  const tF = wt('c2', 'follow') + 0.15;
  const tDM = wt('c2', 'dm');
  const following = t >= tF;
  const ph = eo5(P(t, st + 0.02, st + 0.45));
  const PX = 250, PY = 470, PW = 580, PH = 880;
  const endIn = eo5(P(t, c2.end + 0.25, c2.end + 0.7));
  const tiles = [
    {bg: C.page, fg: C.ink, a: 'STAFF NAHI,', b: 'system'},
    {bg: C.dark, fg: C.darkInk, a: 'MUNSHI JO', b: 'sota nahi'},
    {bg: C.acc, fg: C.accDeep, a: 'EXCEL', b: 'khaata hai'},
  ];
  return (
    <>
      <Abs x={72} y={300}>
        <Rise t={t} at={st + 0.02}>
          <Head size={150}>
            Follow <Em>karo</Em>
          </Head>
        </Rise>
      </Abs>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - ph) * 900}px) scale(${L(1, 0.84, endIn)})`, transformOrigin: '50% 30%'}}>
        <Phone w={PW} h={PH} style={{left: PX, top: PY}}>
          <div style={{position: 'absolute', inset: 0, background: '#fff', fontFamily: SANS, padding: '70px 30px 0'}}>
            <div style={{fontWeight: 700, fontSize: 30, color: '#111', textAlign: 'center', marginBottom: 26}}>localhostlabs</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{width: 140, height: 140, borderRadius: 99, background: C.page, display: 'grid', placeItems: 'center', border: `5px solid ${C.acc}`}}>
                <Mark size={70} />
              </div>
              <div>
                <div style={{fontWeight: 700, fontSize: 32, color: '#111'}}>Localhost Labs</div>
                <div style={{fontSize: 24, color: '#777', marginTop: 4}}>Software company</div>
              </div>
            </div>
            <div style={{fontSize: 25, color: '#222', lineHeight: 1.35, marginTop: 20}}>
              Custom software & business automation
              <br />
              Multan, Pakistan 🇵🇰
              <br />
              <span style={{color: '#00376b', fontWeight: 600}}>localhostlabs.tech</span>
            </div>
            <div style={{display: 'flex', gap: 12, marginTop: 22}}>
              <div style={{flex: 1, textAlign: 'center', borderRadius: 12, padding: '14px 0', fontWeight: 700, fontSize: 27, background: following ? '#efefef' : C.ig, color: following ? '#111' : '#fff'}}>{following ? 'Following ✓' : 'Follow'}</div>
              <div style={{flex: 1, textAlign: 'center', borderRadius: 12, padding: '14px 0', fontWeight: 700, fontSize: 27, background: t >= tDM ? C.ink : '#efefef', color: t >= tDM ? '#fff' : '#111'}}>Message</div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginTop: 26, marginLeft: -30, marginRight: -30}}>
              {[...tiles, ...tiles].map((x, i) => (
                <div key={i} style={{height: 210, background: i >= 3 ? [C.dark, C.acc, C.page][i - 3] : x.bg, padding: 14, overflow: 'hidden'}}>
                  <div style={{fontFamily: DISPLAY, fontWeight: 800, fontSize: 24, color: i >= 3 ? [C.darkInk, C.accDeep, C.ink][i - 3] : x.fg, letterSpacing: '-0.03em', lineHeight: 1}}>{i >= 3 ? ['KHAATA', 'FIXED', 'DM'][i - 3] : x.a}</div>
                  <div style={{fontFamily: SERIF, fontSize: 40, color: i === 0 || i === 5 ? C.acc : i === 1 || i === 3 ? C.lime : C.page, lineHeight: 1}}>{i >= 3 ? ['+ munshi', 'price', 'karo'][i - 3] : x.b}</div>
                </div>
              ))}
            </div>
          </div>
        </Phone>
        <Tap t={t} at={tF} x={PX + 17 + 30 + 120} y={PY + 17 + 70 + 56 + 140 + 20 + 102 + 22 + 30} />
        <Tap t={t} at={tDM} x={PX + 17 + 30 + 380} y={PY + 17 + 70 + 56 + 140 + 20 + 102 + 22 + 30} />
      </div>
      {/* end card: free call + url (after the last spoken line, captions gone) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1290, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, opacity: endIn, transform: `translateY(${(1 - endIn) * 60}px)`}}>
        <div style={{background: C.acc, color: C.accDeep, fontFamily: DISPLAY, fontWeight: 800, fontSize: 56, padding: '18px 40px', borderRadius: 99, letterSpacing: '-0.02em', textTransform: 'uppercase'}}>Free 30-min call · DM karo</div>
        <div style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, color: C.ink, letterSpacing: '-0.03em'}}>
          localhostlabs<span style={{fontFamily: SERIF, fontWeight: 400, color: C.acc}}>.tech</span>
        </div>
      </div>
      <Sparkle x={940} y={330} size={90} t={t} at={st + 0.3} spin={1} />
      <Plus x={140} y={1240} t={t} at={st + 0.5} color={C.acc} />
    </>
  );
};
