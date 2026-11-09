import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, SC, SCENES} from './brand';
import {Flash, Subs} from './parts';
import {App, Bench, Call, Cat, End, Hook, Mirror, Pizza, Table, Waiter} from './scenes';

const VIEW: Record<string, React.FC<{t: number}>> = {hook: Hook, pizza: Pizza, waiter: Waiter, cat: Cat, mirror: Mirror, call: Call, bench: Bench, app: App, table: Table, end: End};
export const Main: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cur = SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
  const View = VIEW[cur.id];
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <View t={t} />
      <Subs t={t} top={cur.id === 'end' ? 1480 : 1470} />
      <Flash t={t} at={SC.pizza.start} />
      <Flash t={t} at={SC.app.start} />
      <Flash t={t} at={SC.end.start} color="#fbbf24" />
    </AbsoluteFill>
  );
};
