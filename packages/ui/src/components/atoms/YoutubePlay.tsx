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

const Placeholder = styled.div`
  width: 75px;
  height: 60px;
`;

export const YoutubePlay: FC<YoutubeProps> = ({ visible }) =>
  visible ? <YoutubeImage /> : <Placeholder />;
