import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

import { UtilsProps, utils } from '../utils';

const FlexStyle = styled.div<UtilsProps>`
  display: flex;
  ${utils}
`;

export interface FlexComponentProps extends UtilsProps {
  children?: ReactNode;
}

export const Flex: FC<FlexComponentProps> = ({ children, ...props }) => (
  <FlexStyle {...props}>{children}</FlexStyle>
);

Flex.defaultProps = {
  children: undefined,
};
