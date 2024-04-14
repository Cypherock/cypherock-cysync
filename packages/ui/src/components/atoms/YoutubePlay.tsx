import React, { FC } from 'react';
import { styled } from 'styled-components';

import { youtubeplay } from '../../assets';

export interface YoutubeProps {
  visible: boolean;
}

const YoutubeImage = styled.img.attrs({
  src: youtubeplay,
  alt: 'youtube',
})``;
export const YoutubePlay: FC<YoutubeProps> = ({ visible }) =>
  visible ? (
    <YoutubeImage />
  ) : (
    <div style={{ width: '75px', height: '60px' }} />
  );
