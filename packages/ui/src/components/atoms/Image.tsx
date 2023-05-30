import React, { FC } from 'react';
import styled from 'styled-components';
import {
  spacing,
  $alignSelf,
  animate,
  SpacingProps,
  AnimateProps,
  AlignSelfProps,
  height,
  width,
  ImageHeightProps,
  ImageWidthProps,
  TransformProps,
  transform,
  PositionProps,
  position,
} from '../utils';

export interface ImageProps
  extends SpacingProps,
    AnimateProps,
    AlignSelfProps,
    ImageHeightProps,
    ImageWidthProps,
    TransformProps,
    PositionProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${$alignSelf}
  ${animate}
  ${height}
  ${width}
  ${transform}
  ${position}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle {...props} src={src} alt={alt} />
);
