import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../utils';

interface FlexProps extends UtilsProps {
  children: ReactNode;
}

const FlexStyle = styled.div<FlexProps>`
  ${utils}
  display: flex;
`;

export const Flex: FC<FlexProps> = ({ children, ...props }) => (
  <FlexStyle {...props}>{children}</FlexStyle>
);
