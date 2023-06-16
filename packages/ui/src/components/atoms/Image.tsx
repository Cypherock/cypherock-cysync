import React, { FC, MouseEventHandler } from 'react';
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
  onClick?: MouseEventHandler<HTMLImageElement> | undefined;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${animate}
  ${height}
  ${width}
  ${transform}
  ${position}
  ${flex}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle {...props} src={src} alt={alt} onClick={props.onClick} />
);

Image.defaultProps = {
  onClick: () => {},
};
