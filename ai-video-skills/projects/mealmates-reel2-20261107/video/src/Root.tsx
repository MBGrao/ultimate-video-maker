import React from 'react';
import {Composition} from 'remotion';
import {Main} from './scenes';
import {DURATION, FPS, H, W} from './brand';

export const RemotionRoot: React.FC = () => <Composition id="MealMatesReel2" component={Main} durationInFrames={Math.round(DURATION * FPS)} fps={FPS} width={W} height={H} />;
