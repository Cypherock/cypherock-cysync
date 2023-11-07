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
}

const VideoStyle = styled.video<VideoProps>`
  ${utils}
`;

export const Video: FC<VideoProps> = ({ src, ...props }) => (
  <VideoStyle {...props} src={src} />
);

Video.defaultProps = {
  autoPlay: false,
  loop: false,
  controls: false,
};
