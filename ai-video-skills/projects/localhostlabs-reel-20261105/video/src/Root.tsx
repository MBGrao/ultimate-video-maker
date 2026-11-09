import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {DURATION, FPS, H, W} from './brand';

export const RemotionRoot: React.FC = () => (
  <Composition id="LocalhostLabsReel" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
);
