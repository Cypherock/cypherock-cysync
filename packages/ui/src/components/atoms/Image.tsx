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
  type?: 'progressBar';
  src: string;
  alt: string;
}

const ImageStyle = styled.img<ImageProps>`
  ${margin}
  ${padding}
  ${$alignSelf}
  ${width}
  ${height}

  ${props =>
    props.type === 'progressBar' &&
    `
    width: 216px;

    @media ${props.theme.screens.laptopL} {
     width: 237.52px;
    }
  `}
`;

export const Image: FC<ImageProps> = ({ src, alt, ...props }) => (
  <ImageStyle src={src} alt={alt} {...props} />
);

Image.defaultProps = {
  type: undefined,
};
