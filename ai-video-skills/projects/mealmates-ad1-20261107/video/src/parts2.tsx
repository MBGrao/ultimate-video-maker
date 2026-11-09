import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {ANTON, C, INTER, L, LN, P, clamp, ei, eo, eo5, mouthAt, pop} from './brand2';

/** generated still (1024x1536) filling the 9:16 frame, with a camera move toward a focal point.
 *  children are drawn in the same (image) space, so overlays stay locked to the picture */
export const Shot: React.FC<{src: string; t: number; a: number; b: number; s0?: number; s1?: number; fx?: number; fy?: number; dx?: number; dy?: number; filter?: string; shake?: number; ease?: (x: number) => number; children?: React.ReactNode}> = ({src, t, a, b, s0 = 1.04, s1 = 1.12, fx = 540, fy = 960, dx = 0, dy = 0, filter, shake = 0, ease = (x) => x, children}) => {
  const p = ease(P(t, a, b));
  const s = L(s0, s1, p);
  const sx = shake ? Math.sin(t * 61) * shake + Math.sin(t * 37) * shake * 0.6 : 0;
  const sy = shake ? Math.cos(t * 53) * shake : 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${fx}px ${fy}px`, transform: `translate(${dx * p + sx}px, ${dy * p + sy}px) scale(${s})`, filter}}>
        <Img src={staticFile(src)} style={{position: 'absolute', left: -100, top: 0, width: 1280, height: 1920, objectFit: 'cover'}} />
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** quick whip-in at the start of a shot (scale + blur), for the montage */
export const whip = (t: number, a: number): React.CSSProperties => {
  const p = eo5(P(t, a, a + 0.18));
  return {transform: `scale(${L(1.18, 1, p)})`, filter: `blur(${(1 - p) * 10}px)`};
};

export const Outline: React.FC<{size: number; color?: string; stroke?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({size, color = '#fff', stroke = '#111', children, style}) => (
  <div style={{fontFamily: INTER, fontWeight: 900, fontSize: size, lineHeight: 1.02, color, letterSpacing: '-0.02em', textTransform: 'uppercase', WebkitTextStroke: `${size * 0.09}px ${stroke}`, paintOrder: 'stroke fill', textShadow: '0 10px 30px rgba(0,0,0,.45)', ...style}}>{children}</div>
);

/** chat bubble: the boys' lines are on screen (all spoken audio is female, as briefed) */
export const Bubble: React.FC<{t: number; at: number; text: string; side?: 'left' | 'right'; who?: string; x: number; y: number; color?: string; out?: number}> = ({t, at, text, side = 'left', who, x, y, color = '#fff', out}) => {
  if (t < at) return null;
  const q = out === undefined ? 0 : ei(P(t, out, out + 0.15));
  return (
    <div style={{position: 'absolute', left: x, top: y, ...pop(t, at, side === 'left' ? -3 : 3, 0.4), transformOrigin: side === 'left' ? '0% 100%' : '100% 100%', opacity: 1 - q}}>
      {who ? <div style={{fontFamily: INTER, fontWeight: 800, fontSize: 26, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,.6)', marginBottom: 6, textAlign: side}}>{who}</div> : null}
      <div style={{position: 'relative', background: color, color: C.ink, fontFamily: INTER, fontWeight: 800, fontSize: 46, padding: '20px 30px', borderRadius: 34, boxShadow: '0 18px 40px -16px rgba(0,0,0,.6)', maxWidth: 760}}>
        {text}
        <div style={{position: 'absolute', [side]: 34, bottom: -18, width: 40, height: 40, background: color, clipPath: side === 'left' ? 'polygon(0 0,100% 0,0 100%)' : 'polygon(0 0,100% 0,100% 100%)'}} />
      </div>
    </div>
  );
};

/** ATTEMPT n: FAILED */
export const Failed: React.FC<{t: number; at: number; n: number}> = ({t, at, n}) => {
  const p = P(t, at, at + 0.16);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', justifyContent: 'center'}}>
      <div style={{transform: `rotate(-7deg) scale(${L(1.8, 1, eo(p))})`, opacity: clamp(p * 3), border: `10px solid ${C.red}`, background: 'rgba(255,255,255,.92)', borderRadius: 18, padding: '10px 34px 6px', textAlign: 'center'}}>
        <div style={{fontFamily: ANTON, fontSize: 44, color: C.ink, letterSpacing: '0.06em'}}>ATTEMPT {n}</div>
        <div style={{fontFamily: ANTON, fontSize: 120, color: C.red, lineHeight: 1, letterSpacing: '0.02em'}}>FAILED ✗</div>
      </div>
    </div>
  );
};

/** subtitles with the speaker's name; the current word lights up */
const WHO: Record<string, [string, string]> = {pizza: ['🍕 Pizza', C.amberLight], ammi: ['Ammi', '#f9a8d4'], narrator: ['', C.amberLight]};
export const Subs: React.FC<{t: number; top?: number}> = ({t, top = 1470}) => {
  const k = Object.keys(LN).find((key) => t >= LN[key].start - 0.05 && t < LN[key].end + 0.3);
  if (!k) return null;
  const line = LN[k];
  const a = eo(P(t, line.start - 0.05, line.start + 0.12)) * (1 - ei(P(t, line.end + 0.15, line.end + 0.3)));
  const [who, col] = WHO[line.role];
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top, display: 'flex', justifyContent: 'center', opacity: a}}>
      <div style={{background: 'rgba(17,24,39,.9)', borderRadius: 30, padding: '16px 30px 20px', maxWidth: 960, textAlign: 'center', fontFamily: INTER, fontWeight: 800, fontSize: 44, lineHeight: 1.22, color: '#fff', boxShadow: '0 18px 40px -20px rgba(0,0,0,.7)', transform: `translateY(${(1 - a) * 14}px)`}}>
        {who ? <span style={{color: col, marginRight: 12}}>{who}:</span> : null}
        {line.words.map((w, i) => {
          const on = t >= w.t0 - 0.02, cur = on && t < w.t1 + 0.04;
          return (
            <span key={i} style={{color: cur ? col : on ? '#fff' : 'rgba(255,255,255,.4)'}}>
              {w.w}
              {i < line.words.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** the pizza's mouth, opening with the voice's loudness */
export const PizzaMouth: React.FC<{t: number; x: number; y: number; w: number}> = ({t, x, y, w}) => {
  const o = mouthAt(t);
  const h = L(w * 0.06, w * 0.5, o);
  return (
    <svg width={w * 1.3} height={w * 0.9} viewBox={`${-w * 0.65} ${-w * 0.3} ${w * 1.3} ${w * 0.9}`} style={{position: 'absolute', left: x - w * 0.65, top: y - w * 0.3, overflow: 'visible'}}>
      <path d={`M ${-w / 2} 0 Q 0 ${h * 1.25} ${w / 2} 0 Q 0 ${h * 0.25 - w * 0.03} ${-w / 2} 0 Z`} fill="#5a0f0a" stroke="#3a0805" strokeWidth={w * 0.045} strokeLinejoin="round" />
      {o > 0.15 ? <ellipse cx={0} cy={h * 0.62} rx={w * 0.17} ry={h * 0.22} fill="#e2524a" /> : null}
      {o > 0.25 ? <rect x={-w * 0.17} y={h * 0.12} width={w * 0.34} height={w * 0.06} rx={6} fill="#fff" /> : null}
      <path d={`M ${-w / 2 - 6} 2 Q ${-w / 2 - 22} -12 ${-w / 2 - 6} -22`} stroke="#3a0805" strokeWidth={w * 0.035} fill="none" strokeLinecap="round" />
      <path d={`M ${w / 2 + 6} 2 Q ${w / 2 + 22} -12 ${w / 2 + 6} -22`} stroke="#3a0805" strokeWidth={w * 0.035} fill="none" strokeLinecap="round" />
    </svg>
  );
};

export const Logo: React.FC<{size: number}> = ({size}) => <Img src={staticFile('img/logo.png')} style={{width: size, height: (size * 342) / 729, objectFit: 'contain'}} />;

export const Flash: React.FC<{t: number; at: number; color?: string}> = ({t, at, color = '#fff'}) => {
  const p = P(t, at - 0.02, at + 0.25);
  if (p <= 0 || p >= 1) return null;
  return <AbsoluteFill style={{background: color, opacity: (1 - p) * 0.9}} />;
};

export const Rain: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.55}}>
    {Array.from({length: 70}).map((_, i) => {
      const x = (i * 157) % 1180 - 50, speed = 1400 + (i % 7) * 160, len = 60 + (i % 5) * 18;
      const y = ((t * speed + i * 293) % 2200) - 200;
      return <div key={i} style={{position: 'absolute', left: x - y * 0.18, top: y, width: 3, height: len, background: 'linear-gradient(transparent, rgba(220,230,255,.85))', transform: 'rotate(10deg)'}} />;
    })}
  </AbsoluteFill>
);

export const _u = [eo5, L];
