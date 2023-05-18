import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { UtilsProps, utils } from '../utils';

interface AsideContainerProps extends UtilsProps {
  children?: ReactNode;
  size?: 'lg';
}

const AsideContainerStyle = styled.div<AsideContainerProps>`
  width: 300px;
  min-height: 100vh;

  ${props =>
    props.border &&
    css`
      border-width: 1px;
      border-style: solid;
      border-color: ${({ theme }) =>
        theme.palette.background.sepratorBackground};
    `}
  ${props =>
    props.size === 'lg'
      ? css`
          width: 500px;
        `
      : ''}
  padding:48px 42px;

  ${utils}
`;

export const AsideContainer: FC<AsideContainerProps> = ({
  children,
  ...props
}) => <AsideContainerStyle {...props}>{children}</AsideContainerStyle>;

AsideContainer.defaultProps = {
  children: null,
  size: 'lg',
};
