import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FPS, SC, SCENES, ei, eo, P} from './brand';
import {Captions, Grid, Theme, Ticker, TopBar, Wipe} from './parts';
import {FollowScene, HookScene, P1Scene, P2Scene, P3Scene, PunchScene, SaveScene, StoryScene, TransScene} from './scenes';

const THEME: Record<string, Theme> = {
  hook: 'light',
  story: 'dark',
  trans: 'light',
  p1: 'light',
  p2: 'dark',
  p3: 'light',
  punch: 'orange',
  save: 'light',
  follow: 'light',
};
const VIEW: Record<string, React.FC<{t: number}>> = {
  hook: HookScene,
  story: StoryScene,
  trans: TransScene,
  p1: P1Scene,
  p2: P2Scene,
  p3: P3Scene,
  punch: PunchScene,
  save: SaveScene,
  follow: FollowScene,
};
// cuts covered by a diagonal band wipe (the others use the scenes' own exit/enter moves)
const WIPES: Record<string, [string, string]> = {
  story: [C.acc, C.ink],
  trans: [C.lime, C.acc],
  p2: [C.acc, C.ink],
  p3: [C.lime, C.acc],
  punch: [C.ink, C.acc],
  save: [C.ink, C.page],
};

export const Main: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const cur = SCENES.find((s) => t >= s.start && t < s.end) ?? SCENES[SCENES.length - 1];
  const theme = THEME[cur.id];
  const View = VIEW[cur.id];
  const next = SCENES[SCENES.indexOf(cur) + 1];
  // soft exit for cuts that have no wipe
  const exitQ = next && !WIPES[next.id] ? ei(P(t, cur.end - 0.24, cur.end)) : 0;
  const enterQ = !WIPES[cur.id] && cur.start > 0 ? 1 - eo(P(t, cur.start, cur.start + 0.3)) : 0;
  return (
    <AbsoluteFill style={{background: C.page, overflow: 'hidden'}}>
      <Grid theme={theme} />
      <AbsoluteFill style={{opacity: 1 - exitQ, transform: `translateY(${-exitQ * 70 + enterQ * 50}px)`}}>
        <View t={t} />
      </AbsoluteFill>
      <TopBar theme={theme} />
      <Ticker t={t} theme={theme} />
      <Captions t={t} />
      {Object.entries(WIPES).map(([id, [c1, c2]]) => (
        <Wipe key={id} t={t} at={SC[id].start} c1={c1} c2={c2} dur={id === 'story' ? 0.46 : 0.62} />
      ))}
    </AbsoluteFill>
  );
};
