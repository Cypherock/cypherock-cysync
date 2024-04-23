import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  spacing,
  animate,
  SpacingProps,
  AnimateProps,
  height,
  width,
  FlexProps,
  flex,
  TransformProps,
  transform,
  PositionProps,
  position,
  BorderProps,
  border,
  HeightProps,
  WidthProps,
} from '../utils';

export interface ImageProps
  extends SpacingProps,
    AnimateProps,
    Omit<HeightProps, 'height'>,
    Omit<WidthProps, 'width'>,
    TransformProps,
    PositionProps,
    FlexProps,
    BorderProps {
  fallbackSrc?: string;
  src: string;
  alt: string;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

const ImageStyle = styled.img<ImageProps>`
  ${spacing}
  ${animate}
  ${height}
  ${width}
  ${transform}
  ${position}
  ${flex}
  ${border}
`;

export const Image: FC<ImageProps> = ({
  src,
  fallbackSrc,
  alt,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = (error: any) => {
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }

    if (onError) {
      onError(error);
    }
  };

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <ImageStyle {...props} src={imageSrc} alt={alt} onError={handleError} />
  );
};

Image.defaultProps = {
  fallbackSrc: undefined,
  onError: undefined,
};
