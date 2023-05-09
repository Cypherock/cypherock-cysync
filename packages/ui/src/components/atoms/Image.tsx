import React from 'react';

import styled from 'styled-components';
import {
  margin,
  MarginProps,
  padding,
  PaddingProps,
  alignSelf,
  AlignSelfProps,
} from '../utils';

export interface ImageProps extends MarginProps, PaddingProps, AlignSelfProps {
  src?: any;
}

export const ImageStyle = styled.img`
  ${margin}
  ${padding}
  ${alignSelf}
`;

export const Image = ({ ...props }: ImageProps) => <ImageStyle {...props} />;

Image.defaultProps = {
  src: null,
};
