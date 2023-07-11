import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { UtilsProps, utils } from '../utils';

const FlexStyle = styled.div<UtilsProps>`
  display: flex;
  justify-content: flex-start;
  ${({ fullWidth }) =>
    fullWidth &&
    'width: 100%;'} /* Apply width: 100% if fullWidth prop is true */
  ${utils}
`;

export interface FlexProps extends UtilsProps {
  children?: ReactNode;
  flex?: string;
  fullWidth?: boolean; // Add fullWidth prop definition here
}

export const Flex: FC<FlexProps> = ({ children, ...props }) => (
  <FlexStyle {...props}>{children}</FlexStyle>
);

Flex.defaultProps = {
  children: undefined,
  flex: undefined,
  fullWidth: false, // Set the default value of fullWidth to false
};
