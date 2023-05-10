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

export interface ImageProps extends MarginProps, PaddingProps, AlignSelfProps {
  src?: any;
}

export const ImageStyle = styled.img`
  ${margin}
  ${padding}
  ${alignSelf}
`;

export const Image: FC<ImageProps> = ({ ...props }) => (
  <ImageStyle {...props} />
);

Image.defaultProps = {
  src: null,
};
