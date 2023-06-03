import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { utils, UtilsProps } from '../utils';

interface ContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg';
}

const ContainerStyle = styled.div<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${utils}
`;

export const Container: FC<ContainerProps> = ({ children, ...props }) => (
  <ContainerStyle {...props}>{children}</ContainerStyle>
);

Container.defaultProps = {
  children: null,
  size: 'lg',
};
