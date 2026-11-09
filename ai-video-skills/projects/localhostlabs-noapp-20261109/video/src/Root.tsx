import React from 'react';
import {Composition, Still} from 'remotion';
import {Cover, Main} from './scenes';
import {DURATION, FPS, H, W} from './brand';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NoApp" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
    <Still id="Cover" component={Cover} width={W} height={H} />
  </>
);
