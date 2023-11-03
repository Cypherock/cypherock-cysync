import React, { FC } from 'react';
import styled from 'styled-components';

import {
  spacing,
  animate,
  SpacingProps,
  AnimateProps,
  height,
  width,
  FlexProps,
  flex,
  TransformProps,
  transform,
  PositionProps,
  position,
  BorderProps,
  border,
  HeightProps,
  WidthProps,
} from '../utils';

export interface ImageProps
  extends SpacingProps,
    AnimateProps,
    Omit<HeightProps, 'height'>,
    Omit<WidthProps, 'width'>,
    TransformProps,
    PositionProps,
    FlexProps,
    BorderProps {
  src: string;
  alt: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${animate}
  ${height}
  ${width}
  ${transform}
  ${position}
  ${flex}
  ${border}
`;

export const Image: FC<ImageProps> = ({ src, alt, onError, ...props }) => (
  <ImageStyle {...props} src={src} alt={alt} onError={onError} />
);

Image.defaultProps = {
  onError: undefined,
};
