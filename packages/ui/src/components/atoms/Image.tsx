import React, { FC } from 'react';
import styled from 'styled-components';
import {
  margin,
  MarginProps,
  padding,
  PaddingProps,
  alignSelf,
  AlignSelfProps,
} from '../utils';

interface ImageProps extends MarginProps, PaddingProps, AlignSelfProps {
  src: string;
  alt: string;
}

const ImageStyle = styled.img`
  ${margin}
  ${padding}
  ${alignSelf}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle src={src} alt={alt} {...props} />
);
