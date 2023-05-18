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

interface ImageProps
  extends MarginProps,
    PaddingProps,
    AlignSelfProps,
    WidthProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${margin}
  ${padding}
  ${$alignSelf}
  ${width}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle src={src} alt={alt} {...props} />
);
