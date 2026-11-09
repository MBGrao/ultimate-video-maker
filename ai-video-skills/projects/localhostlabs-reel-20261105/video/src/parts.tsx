import React from 'react';
import {C, DISPLAY, H, L, LN, MONO, P, SANS, SERIF, W, clamp, eb, ei, eo, eo5} from './brand';

export type Theme = 'light' | 'dark' | 'orange';

// ---------- backgrounds ----------
export const Grid: React.FC<{theme: Theme}> = ({theme}) => {
  if (theme === 'dark')
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 900px 700px at 50% 52%, #2a1a10 0%, ${C.dark} 70%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at center, rgba(238,241,248,.16) 1.6px, transparent 2.2px)',
            backgroundSize: '36px 36px',
          }}
        />
      </div>
    );
  const bg = theme === 'orange' ? C.acc : C.page;
  const ln = theme === 'orange' ? 'rgba(36,25,16,.10)' : C.line2;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: bg,
        backgroundImage: `linear-gradient(${ln} 1.5px, transparent 1.5px), linear-gradient(90deg, ${ln} 1.5px, transparent 1.5px)`,
        backgroundSize: '72px 72px',
        backgroundPosition: '-1px -1px',
      }}
    />
  );
};

// ---------- logo (CSS rebuild of .ll-brand: rotated orange mark + "localhost" + italic serif "labs") ----------
export const Mark: React.FC<{size: number; bg?: string; fg?: string; rot?: number}> = ({size, bg = C.acc, fg = C.accDeep, rot = -8}) => (
  <div
    style={{
      width: size,
      height: size,
      background: bg,
      color: fg,
      transform: `rotate(${rot}deg)`,
      display: 'grid',
      placeItems: 'center',
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: size * 0.53,
      letterSpacing: '-0.04em',
      lineHeight: 1,
      flexShrink: 0,
    }}
  >
    ll
  </div>
);

export const Logo: React.FC<{size?: number; theme?: Theme}> = ({size = 46, theme = 'light'}) => {
  const ink = theme === 'light' ? C.ink : theme === 'dark' ? C.darkInk : C.accDeep;
  const markBg = theme === 'orange' ? C.accDeep : C.acc;
  const markFg = theme === 'orange' ? C.acc : C.accDeep;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: size * 0.32}}>
      <Mark size={size} bg={markBg} fg={markFg} />
      <div style={{fontFamily: DISPLAY, fontWeight: 600, fontSize: size * 0.72, letterSpacing: '-0.035em', color: ink, lineHeight: 1}}>
        localhost{' '}
        <span style={{fontFamily: SERIF, fontWeight: 400, fontSize: size * 0.8, letterSpacing: '-0.01em'}}>labs</span>
      </div>
    </div>
  );
};

export const TopBar: React.FC<{theme: Theme}> = ({theme}) => {
  const ink = theme === 'light' ? C.ink : theme === 'dark' ? C.darkInk : C.accDeep;
  const border = theme === 'light' ? C.line : theme === 'dark' ? C.darkLine : 'rgba(36,25,16,.25)';
  return (
    <div style={{position: 'absolute', left: 72, right: 72, top: 150, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Logo size={48} theme={theme} />
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: 25,
          color: ink,
          border: `2px solid ${border}`,
          borderRadius: 999,
          padding: '10px 20px',
          letterSpacing: '0.02em',
        }}
      >
        @localhostlabs
      </div>
    </div>
  );
};

// ---------- ticker tape (site's .ll-marquee: orange band, dark uppercase, dot separators) ----------
const TAPE = ['Staff nahi, system', 'Fixed price', '24h reply', 'NDA by default', 'CRM · ERP · Automation', 'Built in Multan'];
export const Ticker: React.FC<{t: number; theme: Theme}> = ({t, theme}) => {
  const bg = theme === 'orange' ? C.accDeep : C.acc;
  const fg = theme === 'orange' ? C.acc : C.accDeep;
  const items = [...TAPE, ...TAPE, ...TAPE, ...TAPE];
  const x = -((t * 110) % 2400);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1622, height: 82, background: bg, overflow: 'hidden', transform: 'rotate(-2deg) scaleX(1.06)'}}>
      <div style={{position: 'absolute', top: 0, left: x, height: 82, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
        {items.map((s, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center'}}>
            <span style={{fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, letterSpacing: '0.02em', textTransform: 'uppercase', color: fg}}>{s}</span>
            <span style={{fontSize: 30, color: fg, margin: '0 30px'}}>✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- karaoke captions (Roman Urdu, current word lit) ----------
export const Captions: React.FC<{t: number; hidden?: boolean}> = ({t, hidden}) => {
  const k = Object.keys(LN).find((key) => t >= LN[key].start - 0.08 && t < LN[key].end + 0.35);
  if (!k || hidden) return null;
  const line = LN[k];
  const a = eo(P(t, line.start - 0.08, line.start + 0.12)) * (1 - ei(P(t, line.end + 0.2, line.end + 0.35)));
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1418, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div
        style={{
          background: 'rgba(27,25,20,.92)',
          border: '2px solid rgba(244,240,230,.12)',
          borderRadius: 28,
          padding: '18px 30px 20px',
          maxWidth: 900,
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.22,
          color: C.darkInk,
          transform: `translateY(${(1 - a) * 16}px)`,
          boxShadow: '0 18px 40px -20px rgba(0,0,0,.55)',
        }}
      >
        {line.words.map((w, i) => {
          const on = t >= w.t0 - 0.03;
          const cur = on && t < w.t1 + 0.05;
          return (
            <span key={i} style={{color: cur ? C.lime : on ? C.darkInk : 'rgba(244,240,230,.42)'}}>
              {w.w}
              {i < line.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- text reveals ----------
/** masked rise: the line slides up from behind its own baseline */
export const Rise: React.FC<{t: number; at: number; dur?: number; out?: number; outDur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  t,
  at,
  dur = 0.42,
  out,
  outDur = 0.22,
  children,
  style,
}) => {
  const p = eo5(P(t, at, at + dur));
  const q = out === undefined ? 0 : ei(P(t, out, out + outDur));
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 105 - q * 105}%)`, opacity: p > 0 ? 1 : 0}}>{children}</div>
    </div>
  );
};

export const Head: React.FC<{size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = C.ink, children, style}) => (
  <div
    style={{
      fontFamily: DISPLAY,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.9,
      letterSpacing: '-0.045em',
      textTransform: 'uppercase',
      color,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Em: React.FC<{color?: string; children: React.ReactNode; scale?: number}> = ({color = C.acc, children, scale = 1.18}) => (
  <span style={{fontFamily: SERIF, fontWeight: 400, textTransform: 'none', letterSpacing: '-0.01em', color, fontSize: `${scale}em`, lineHeight: 0.7}}>{children}</span>
);

export const Kicker: React.FC<{color?: string; dot?: string; children: React.ReactNode}> = ({color = C.ink2, dot = C.ok, children}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 27, letterSpacing: '0.14em', textTransform: 'uppercase', color}}>
    <span style={{width: 14, height: 14, borderRadius: 99, background: dot, display: 'inline-block'}} />
    {children}
  </div>
);

// ---------- decoration ----------
export const Sparkle: React.FC<{x: number; y: number; size: number; color?: string; t: number; at: number; spin?: number}> = ({x, y, size, color = C.acc, t, at, spin = 0}) => {
  const p = eb(P(t, at, at + 0.45));
  const pulse = 1 + 0.08 * Math.sin((t - at) * 5);
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${p * pulse}) rotate(${spin * (t - at) * 40}deg)`, opacity: p > 0 ? 1 : 0}}>
      <path d="M0 -50 C 6 -10 10 -6 50 0 C 10 6 6 10 0 50 C -6 10 -10 6 -50 0 C -10 -6 -6 -10 0 -50 Z" fill={color} />
    </svg>
  );
};

export const Plus: React.FC<{x: number; y: number; size?: number; color?: string; t: number; at: number}> = ({x, y, size = 30, color = C.ink3, t, at}) => {
  const p = eo(P(t, at, at + 0.35));
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: p, transform: `rotate(${(1 - p) * 90}deg) scale(${p})`}}>
      <div style={{position: 'absolute', left: size / 2 - 2, top: 0, width: 4, height: size, background: color}} />
      <div style={{position: 'absolute', top: size / 2 - 2, left: 0, height: 4, width: size, background: color}} />
    </div>
  );
};

/** number badge for the 3 points */
export const Badge: React.FC<{n: number; t: number; at: number; bg?: string; fg?: string}> = ({n, t, at, bg = C.acc, fg = C.accDeep}) => {
  const p = eb(P(t, at, at + 0.4), 2.4);
  return (
    <div
      style={{
        width: 118,
        height: 118,
        borderRadius: 999,
        background: bg,
        color: fg,
        display: 'grid',
        placeItems: 'center',
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: 76,
        transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`,
        letterSpacing: '-0.05em',
      }}
    >
      {n}
    </div>
  );
};

// ---------- tap ripple ----------
export const Tap: React.FC<{t: number; at: number; x: number; y: number; color?: string}> = ({t, at, x, y, color = 'rgba(27,25,20,.35)'}) => {
  const p = P(t, at - 0.18, at + 0.45);
  if (p <= 0 || p >= 1) return null;
  const press = P(t, at - 0.18, at);
  const ring = P(t, at, at + 0.45);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - 34,
          top: y - 34,
          width: 68,
          height: 68,
          borderRadius: 99,
          background: 'rgba(255,255,255,.75)',
          border: '3px solid rgba(27,25,20,.5)',
          transform: `scale(${L(1.3, 0.85, eo(press)) * (1 - 0.3 * ring)})`,
          opacity: 1 - ring,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - 60,
          top: y - 60,
          width: 120,
          height: 120,
          borderRadius: 99,
          border: `4px solid ${color}`,
          transform: `scale(${L(0.4, 1.4, eo(ring))})`,
          opacity: ring > 0 ? 1 - ring : 0,
        }}
      />
    </>
  );
};

// ---------- phone frame ----------
export const Phone: React.FC<{w: number; h: number; children: React.ReactNode; screen?: string; style?: React.CSSProperties}> = ({w, h, children, screen = '#fff', style}) => (
  <div
    style={{
      position: 'absolute',
      width: w,
      height: h,
      borderRadius: w * 0.16,
      background: '#111',
      padding: w * 0.03,
      boxShadow: '0 40px 80px -30px rgba(27,25,20,.55), inset 0 0 0 3px #3a3833',
      ...style,
    }}
  >
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.13, background: screen, overflow: 'hidden'}}>
      {children}
      <div style={{position: 'absolute', top: w * 0.03, left: '50%', width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, background: '#111', borderRadius: 99}} />
    </div>
  </div>
);

// ---------- the munshi mascot: the logo mark as a character (orange head, the "ll" became its eyes) ----------
export const Mascot: React.FC<{t: number; size: number; glasses?: boolean; awake?: boolean; wave?: number; ledger?: boolean}> = ({t, size, glasses = true, awake = true, wave = 0, ledger = true}) => {
  const blink = awake ? (Math.sin(t * 2.1) > 0.985 || (t % 3.7 > 3.58) ? 0.12 : 1) : 0.12;
  const bob = Math.sin(t * 3.2) * size * 0.012;
  const s = size;
  return (
    <div style={{position: 'relative', width: s, height: s * 1.35, transform: `translateY(${bob}px)`}}>
      {/* body */}
      <div style={{position: 'absolute', left: s * 0.2, top: s * 0.84, width: s * 0.6, height: s * 0.5, background: C.ink, borderRadius: `${s * 0.18}px ${s * 0.18}px ${s * 0.08}px ${s * 0.08}px`}}>
        <div style={{position: 'absolute', left: '50%', top: 0, width: s * 0.1, height: s * 0.26, marginLeft: -s * 0.05, background: C.acc, clipPath: 'polygon(20% 0,80% 0,100% 70%,50% 100%,0 70%)'}} />
      </div>
      {/* arm waving */}
      <div
        style={{
          position: 'absolute',
          left: s * 0.72,
          top: s * 0.9,
          width: s * 0.11,
          height: s * 0.34,
          background: C.ink,
          borderRadius: 99,
          transformOrigin: '50% 10%',
          transform: `rotate(${-150 + Math.sin(t * 9) * 18 * wave}deg)`,
          opacity: wave > 0 ? 1 : 0,
        }}
      />
      {/* ledger in hand */}
      {ledger ? (
        <div style={{position: 'absolute', left: s * 0.02, top: s * 0.98, width: s * 0.36, height: s * 0.28, background: '#b3261e', borderRadius: s * 0.025, transform: 'rotate(-12deg)', boxShadow: `inset ${s * 0.03}px 0 0 #7d1812`}}>
          <div style={{position: 'absolute', left: '30%', top: '30%', width: '55%', height: '22%', background: '#f6d77b', borderRadius: 3}} />
        </div>
      ) : null}
      {/* head = the logo mark */}
      <div style={{position: 'absolute', left: s * 0.08, top: 0, width: s * 0.84, height: s * 0.84, background: C.acc, transform: 'rotate(-8deg)', boxShadow: `0 ${s * 0.04}px 0 ${C.accInk}`}}>
        {/* eyes (the "ll") */}
        {[0.3, 0.6].map((x, i) => (
          <div key={i} style={{position: 'absolute', left: s * 0.84 * x - s * 0.04, top: s * 0.2 + s * 0.1 * (1 - blink), width: s * 0.08, height: s * 0.24 * blink, background: C.accDeep, borderRadius: 99}} />
        ))}
        {/* glasses */}
        {glasses ? (
          <>
            {[0.3, 0.6].map((x, i) => (
              <div key={i} style={{position: 'absolute', left: s * 0.84 * x - s * 0.13, top: s * 0.19, width: s * 0.26, height: s * 0.26, borderRadius: 99, border: `${s * 0.025}px solid ${C.accDeep}`}} />
            ))}
            <div style={{position: 'absolute', left: s * 0.84 * 0.3 + s * 0.13, top: s * 0.3, width: s * 0.84 * 0.3 - s * 0.26, height: s * 0.025, background: C.accDeep}} />
          </>
        ) : null}
        {/* smile */}
        <div style={{position: 'absolute', left: s * 0.3, top: s * 0.52, width: s * 0.24, height: s * 0.12, borderBottom: `${s * 0.03}px solid ${C.accDeep}`, borderRadius: '0 0 99px 99px'}} />
        {/* pencil behind the ear */}
        <div style={{position: 'absolute', left: s * 0.74, top: s * 0.02, width: s * 0.05, height: s * 0.32, background: C.sticky, transform: 'rotate(28deg)', borderTop: `${s * 0.04}px solid ${C.ink}`}} />
      </div>
    </div>
  );
};

// ---------- automations.log row (site copy, mono) ----------
export const LogRow: React.FC<{time: string; a: string; b: string; t: number; at: number; dark?: boolean; w?: number}> = ({time, a, b, t, at, dark, w = 936}) => {
  const p = eo(P(t, at, at + 0.35));
  const n = Math.floor(clamp((t - at - 0.1) / 0.5) * b.length);
  const done = t > at + 0.7;
  const tick = eb(P(t, at + 0.7, at + 1.0), 2.6);
  const ink = dark ? C.darkInk : C.ink;
  const ink2 = dark ? C.darkInk2 : C.ink3;
  return (
    <div
      style={{
        width: w,
        background: dark ? C.dark2 : C.card,
        border: `2px solid ${dark ? C.darkLine : C.line}`,
        borderRadius: 14,
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        fontFamily: MONO,
        fontSize: 31,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
        boxShadow: dark ? 'none' : '0 20px 40px -26px rgba(27,25,20,.5)',
      }}
    >
      <span style={{color: ink2}}>{time}</span>
      <div style={{flex: 1}}>
        <div style={{color: ink, fontWeight: 700}}>{a}</div>
        <div style={{color: ink2, marginTop: 6}}>
          → {b.slice(0, n)}
          <span style={{opacity: !done && Math.floor(t * 4) % 2 === 0 ? 1 : 0}}>▍</span>
        </div>
      </div>
      <span style={{color: C.ok, fontWeight: 700, fontSize: 40, transform: `scale(${tick})`, display: 'inline-block'}}>✓</span>
    </div>
  );
};

// ---------- scene-cut wipe: diagonal orange band then a dark band, fully covering at the cut ----------
export const Wipe: React.FC<{t: number; at: number; c1?: string; c2?: string; dur?: number}> = ({t, at, c1 = C.acc, c2 = C.ink, dur = 0.62}) => {
  const p = P(t, at - dur / 2, at + dur / 2);
  if (p <= 0 || p >= 1) return null;
  const band = (lag: number, color: string, width: number) => {
    const q = eio(clamp((p - lag) / (1 - 0.18)));
    const x = L(-W - width, W + 300, q);
    return <div style={{position: 'absolute', top: -600, left: x, width, height: H + 1200, background: color, transform: 'rotate(14deg)'}} />;
  };
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {band(0.0, c1, 2300)}
      {band(0.18, c2, 2300)}
    </div>
  );
};
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/** stamp that slams in */
export const Stamp: React.FC<{t: number; at: number; children: React.ReactNode; color?: string; rot?: number; size?: number; bg?: string}> = ({t, at, children, color = C.acc, rot = -8, size = 110, bg = 'transparent'}) => {
  const p = P(t, at, at + 0.22);
  if (p <= 0) return null;
  const s = L(1.9, 1, eo(p));
  return (
    <div
      style={{
        display: 'inline-block',
        border: `${size * 0.07}px solid ${color}`,
        color,
        background: bg,
        fontFamily: DISPLAY,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        padding: `${size * 0.1}px ${size * 0.22}px ${size * 0.14}px`,
        letterSpacing: '-0.03em',
        textTransform: 'uppercase',
        borderRadius: size * 0.12,
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: clamp(p * 3),
      }}
    >
      {children}
    </div>
  );
};

export const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);
