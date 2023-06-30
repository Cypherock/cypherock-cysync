import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { utils, UtilsProps } from '../utils';

interface ContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg';
  $noFlex?: boolean;
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
`;

export const Container: FC<ContainerProps> = ({ children, ...props }) => (
  <ContainerStyle {...props}>{children}</ContainerStyle>
);

Container.defaultProps = {
  children: undefined,
  size: 'lg',
  $noFlex: false,
};
