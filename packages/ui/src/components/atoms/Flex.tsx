import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../utils';

export const FlexStyle = styled.div<UtilsProps>`
  display: flex;
  ${utils}
`;

interface FlexProps extends UtilsProps {
  children: ReactNode;
}

export const Flex = ({ children, ...props }: FlexProps) => (
  <FlexStyle {...props}>{children}</FlexStyle>
);
