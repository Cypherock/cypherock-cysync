import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { UtilsProps, utils } from '../utils';

const FlexStyle = styled.div<UtilsProps>`
  display: flex;
  ${utils}
`;

export interface FlexComponentProps extends UtilsProps {
  children?: ReactNode;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexComponentProps>(
  ({ children, ...props }, ref) => (
    <FlexStyle ref={ref} {...props}>
      {children}
    </FlexStyle>
  ),
);

Flex.displayName = 'Flex';

Flex.defaultProps = {
  children: undefined,
};
