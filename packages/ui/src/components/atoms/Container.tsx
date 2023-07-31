import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import {
  spacing,
  SpacingProps,
  BorderProps,
  border,
  utils,
  UtilsProps,
  BgColorProps,
  bgColor,
} from '../utils';

interface ContainerProps
  extends UtilsProps,
    SpacingProps,
    BorderProps,
    BgColorProps {
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
  ${spacing}
  ${border}
  ${bgColor}
`;

export const Container: FC<ContainerProps> = ({ children, ...props }) => (
  <ContainerStyle {...props}>{children}</ContainerStyle>
);

Container.defaultProps = {
  children: null,
  size: 'lg',
  $noFlex: false,
};

export const FlexGapContainer = styled(Container)`
  flex-direction: column;
  gap: 32px;
  z-index: 1;
`;

export const ScrollableContainer = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
