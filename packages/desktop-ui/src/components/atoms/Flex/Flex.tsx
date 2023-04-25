import React, { ReactNode } from 'react';
import { FlexStyle } from './Flex.styled';
import { UtilsProps } from '../../util';

interface FlexProps extends UtilsProps {
  children: ReactNode;
}

export const Flex = ({ children, ...props }: FlexProps) => (
  <FlexStyle {...props}>{children}</FlexStyle>
);
