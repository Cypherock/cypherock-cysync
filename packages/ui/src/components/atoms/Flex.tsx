import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../utils';

interface FlexProps extends UtilsProps {
  children: ReactNode;
  directionL?: 'column' | 'row';
}

const FlexStyle = styled.div<FlexProps>`
  ${utils}

  ${props =>
    props.directionL &&
    `
  @media ${props.theme.screens.laptopL} {
    flex-direction: ${props.directionL};
  }
  `}
`;

export const Flex: FC<FlexProps> = ({ children, ...props }) => (
  <FlexStyle {...props}>{children}</FlexStyle>
);

Flex.defaultProps = {
  directionL: undefined,
};
