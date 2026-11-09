import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {FPS, H, TIMELINES, W} from './brand';

const IDS: Record<string, string> = {d1_pk: 'Day01-PK-WebsiteAppSoftware', d1_en: 'Day01-EN-WebsiteAppSoftware', d2_pk: 'Day02-PK-WhoOwnsYourCode', d2_en: 'Day02-EN-WhoOwnsYourCode'};
export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(IDS).map(([vid, id]) => (
      <Composition key={vid} id={id} component={Main} durationInFrames={Math.round(TIMELINES[vid].duration * FPS)} fps={FPS} width={W} height={H} defaultProps={{vid}} />
    ))}
  </>
);
