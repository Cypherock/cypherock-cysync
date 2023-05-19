import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { UtilsProps, utils } from '../utils';

interface AsideContainerProps extends UtilsProps {
  children?: ReactNode;
}

const AsideContainerStyle = styled.div<AsideContainerProps>`
  ${utils}
  min-width: 280px;
  min-height: 100vh;
  padding: 32px;

  @media ${({ theme }) => theme.screens.laptopL} {
    min-width: 500px;
    padding: 32px 40px;
  }
`;

export const AsideContainer: FC<AsideContainerProps> = ({
  children,
  ...props
}) => <AsideContainerStyle {...props}>{children}</AsideContainerStyle>;

AsideContainer.defaultProps = {
  children: null,
};
