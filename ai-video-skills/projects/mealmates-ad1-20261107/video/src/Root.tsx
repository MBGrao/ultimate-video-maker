import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {Main2} from './scenes2';
import {DURATION, FPS, H, W} from './brand';
import {DURATION as DURATION2} from './brand2';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MealMatesAd1" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="MealMatesAd1v2" component={Main2} durationInFrames={Math.round(DURATION2 * FPS)} fps={FPS} width={W} height={H} />
  </>
);
