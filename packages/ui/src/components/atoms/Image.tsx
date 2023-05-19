import React, { FC } from 'react';
import styled from 'styled-components';
import {
  margin,
  MarginProps,
  padding,
  PaddingProps,
  $alignSelf,
  AlignSelfProps,
  WidthProps,
  width,
} from '../utils';
import { HeightProps, height } from '../utils/height.styled';

interface ImageProps
  extends MarginProps,
    PaddingProps,
    AlignSelfProps,
    WidthProps,
    HeightProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${margin}
  ${padding}
  ${$alignSelf}
  ${width}
  ${height}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle src={src} alt={alt} {...props} />
);
