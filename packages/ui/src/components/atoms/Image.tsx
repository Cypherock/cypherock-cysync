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
} from '../utils';

interface ImageProps
  extends SpacingProps,
    AnimateProps,
    AlignSelfProps,
    ImageHeightProps,
    ImageWidthProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${$alignSelf}
  ${animate}
  ${height}
  ${width}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle {...props} src={src} alt={alt} />
);
