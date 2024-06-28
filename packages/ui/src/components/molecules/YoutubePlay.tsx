import React, { FC } from 'react';
import { styled } from 'styled-components';
import SvgYoutubePlay from '../../assets/icons/generated/YoutubePlay';

export interface YoutubeProps {
  visible: boolean;
}

const Placeholder = styled.div`
  width: 75px;
  height: 60px;
`;

export const YoutubePlay: FC<YoutubeProps> = ({ visible }) =>
  visible ? <SvgYoutubePlay /> : <Placeholder />;
