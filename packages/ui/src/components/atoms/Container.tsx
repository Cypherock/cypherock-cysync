import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import { utils, UtilsProps } from '../utils';

interface ContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg';
  $noFlex?: boolean;
  padding?: string;
}

const ContainerStyle = styled.div<ContainerProps>`
  ${props =>
    !props.$noFlex &&
    css`
      display: flex;
      justify-content: center;
      align-items: center;
    `}
  ${utils}

  padding: ${props => props.padding ?? '0'};
`;

export const Container: FC<ContainerProps> = ({ children, ...props }) => (
  <ContainerStyle {...props}>{children}</ContainerStyle>
);

Container.defaultProps = {
  children: null,
  size: 'lg',
  $noFlex: false,
  padding: undefined,
};
