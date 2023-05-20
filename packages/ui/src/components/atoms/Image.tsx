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
} from '../utils';
import { HeightProps, height } from '../utils/height.styled';

interface ImageProps
  extends SpacingProps,
    SpacingProps,
    AlignSelfProps,
    AnimateProps,
    WidthProps,
    HeightProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${$alignSelf}
  ${width}
  ${height}
  ${animate}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle src={src} alt={alt} {...props} />
);
