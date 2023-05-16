import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { utils, UtilsProps } from '../utils';

interface ContainerProps extends UtilsProps {
  children?: ReactNode;
  borderRadiusOne?: boolean;
  border?: boolean;
  scroll?: boolean;
  roundedListTop?: boolean;
  roundedListBottom?: boolean;
  shadow?: boolean;
  size?: 'lg';
}

const ContainerStyle = styled.div`
  ${utils}
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container: FC<ContainerProps> = ({ children, ...props }) => (
  <ContainerStyle {...props}>{children}</ContainerStyle>
);

Container.defaultProps = {
  children: null,
  borderRadiusOne: false,
  border: false,
  scroll: false,
  roundedListTop: false,
  roundedListBottom: false,
  shadow: false,
  size: 'lg',
};
