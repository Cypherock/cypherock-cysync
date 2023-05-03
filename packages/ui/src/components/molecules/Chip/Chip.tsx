import React, { ReactElement } from 'react';
import { ChipStyle, ClipProps } from './Chip.styled';

export const Chip = ({ children, ...props }: ClipProps): ReactElement => (
  <ChipStyle {...props}>{children}</ChipStyle>
);
