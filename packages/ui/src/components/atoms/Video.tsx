import React, { FC } from 'react';
import styled from 'styled-components';

import {
  AnimateProps,
  BorderProps,
  FlexProps,
  HeightProps,
  PositionProps,
  SpacingProps,
  TransformProps,
  WidthProps,
  utils,
} from '../utils';

export interface VideoProps
  extends SpacingProps,
    AnimateProps,
    Omit<HeightProps, 'height'>,
    Omit<WidthProps, 'width'>,
    TransformProps,
    PositionProps,
    FlexProps,
    BorderProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  $aspectRatio?: string;
}

const VideoStyle = styled.video<VideoProps>`
  aspect-ratio: ${({ $aspectRatio }) => $aspectRatio ?? 'auto'};
  ${utils}
`;

export const Video: FC<VideoProps> = ({ src, ...props }) => (
  <VideoStyle $maxWidth="full" src={src} {...props} />
);

Video.defaultProps = {
  autoPlay: false,
  loop: false,
  controls: false,
  $aspectRatio: 'auto',
};
