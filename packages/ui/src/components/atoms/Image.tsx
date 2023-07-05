import React, { FC } from 'react';
import styled from 'styled-components';

import {
  spacing,
  animate,
  SpacingProps,
  AnimateProps,
  height,
  width,
  ImageHeightProps,
  ImageWidthProps,
  FlexProps,
  flex,
  TransformProps,
  transform,
  PositionProps,
  position,
} from '../utils';

export interface ImageProps
  extends SpacingProps,
    AnimateProps,
    ImageHeightProps,
    ImageWidthProps,
    TransformProps,
    PositionProps,
    FlexProps {
  src: string;
  alt: string;
  border?: string;
  padding?: string;
  margin?: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${animate}
  ${height}
  ${width}
  ${transform}
  ${position}
  ${flex}
  border: ${props => props.border ?? 'none'};
  padding: ${props => props.padding ?? 'none'};
  margin: ${props => props.margin ?? 'none'};
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle {...props} src={src} alt={alt} />
);

Image.defaultProps = {
  border: undefined,
  padding: undefined,
  margin: undefined,
};
