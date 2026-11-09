import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FPS, P, VCtx, ei, eo, makeV} from './brand';
import {Bg, Captions, Look, TopBar, Wipe} from './parts';
import {D1} from './day1';
import {D2} from './day2';

const VIEWS: Record<string, Record<string, React.FC>> = {d1: D1, d2: D2};
const LOOK: Record<string, Record<string, Look>> = {
  d1: {},
  d2: {hook: 'paper', story: 'paper', rent: 'paper', trans: 'term', p1: 'paper', p2: 'paper', p3: 'paper', punch: 'red', trigger: 'paper', cta: 'paper'},
};
// Day 2 cuts covered by a two-tone wipe (retro editorial); every other cut is a soft slide
const WIPES: Record<string, Record<string, [string, string]>> = {
  d1: {},
  d2: {trans: [C.red, C.term], p1: [C.green, C.paper], punch: [C.ink, C.red], trigger: [C.ink, C.paper]},
};

export const Main: React.FC<{vid: string}> = ({vid}) => {
  const t = useCurrentFrame() / FPS;
  const v = makeV(vid, t);
  const day = vid.slice(0, 2);
  const scenes = v.tl.scenes;
  const cur = scenes.find((s) => t >= s.start && t < s.end) ?? scenes[scenes.length - 1];
  const next = scenes[scenes.indexOf(cur) + 1];
  const look: Look = LOOK[day][cur.id] ?? 'grid';
  const View = VIEWS[day][cur.id];
  const wipes = WIPES[day];
  const exitQ = next && !wipes[next.id] ? ei(P(t, cur.end - 0.24, cur.end)) : 0;
  const enterQ = cur.start > 0 && !wipes[cur.id] ? 1 - eo(P(t, cur.start, cur.start + 0.3)) : 0;
  return (
    <VCtx.Provider value={v}>
      <AbsoluteFill style={{background: C.page, overflow: 'hidden'}}>
        <Bg look={look} />
        <AbsoluteFill style={{opacity: 1 - exitQ, transform: `translateY(${-exitQ * 60 + enterQ * 46}px) scale(${1 - exitQ * 0.02})`}}>{View ? <View /> : null}</AbsoluteFill>
        <TopBar dark={look === 'term'} />
        <Captions />
        {Object.entries(wipes).map(([id, [c1, c2]]) => (
          <Wipe key={id} at={v.sc(id).start} c1={c1} c2={c2} />
        ))}
      </AbsoluteFill>
    </VCtx.Provider>
  );
};
