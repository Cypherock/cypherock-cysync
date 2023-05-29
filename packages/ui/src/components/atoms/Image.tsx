import React, { FC } from 'react';
import styled from 'styled-components';
import {
  spacing,
  SpacingProps,
  $alignSelf,
  AlignSelfProps,
  WidthProps,
  width,
  AnimateProps,
  animate,
  TransformProps,
  transform,
  PositionProps,
  position,
} from '../utils';
import { HeightProps, height } from '../utils/height.styled';

export interface ImageProps
  extends SpacingProps,
    SpacingProps,
    AlignSelfProps,
    AnimateProps,
    WidthProps,
    HeightProps,
    TransformProps,
    PositionProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${$alignSelf}
  ${width}
  ${height}
  ${animate}
  ${transform}
  ${position}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle src={src} alt={alt} {...props} />
);
