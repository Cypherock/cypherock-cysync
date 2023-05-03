import React, { ReactElement } from 'react';
import { ButtonStyle, ButtonProps } from './Button.styled';

export const Button = ({ children, ...props }: ButtonProps): ReactElement => (
  <ButtonStyle {...props}>{children}</ButtonStyle>
);
