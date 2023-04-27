import React, { ReactElement } from 'react';
import { SquareCheckBoxStyle, SquareCheckBoxProps } from './CheckBox.styled';

export const CheckBox = ({
  children,
  variation,
  ...props
}: SquareCheckBoxProps): ReactElement | null =>
  variation === 'squareCheckBox' ? (
    <SquareCheckBoxStyle {...props}>{children}</SquareCheckBoxStyle>
  ) : null;
