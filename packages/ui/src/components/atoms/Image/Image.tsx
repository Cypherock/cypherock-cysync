import React from 'react';
import { ImageStyle, ImageProps } from './Image.styled';

export const Image = ({ ...props }: ImageProps) => <ImageStyle {...props} />;
