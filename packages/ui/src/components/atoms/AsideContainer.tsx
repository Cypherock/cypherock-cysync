import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { UtilsProps, utils } from '../utils';

interface AsideContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg';
}

const AsideContainerStyle = styled.div<AsideContainerProps>`
  min-width: 280px;
  min-height: 100vh;
  padding: 32px;

  ${props =>
    props.border &&
    css`
      border-width: 1px;
      border-style: solid;
      border-color: ${({ theme }) =>
        theme.palette.background.sepratorBackground};
    `}

  ${utils}
    
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
  size: 'lg',
};
