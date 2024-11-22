import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

import {
  spacing,
  SpacingProps,
  BorderProps,
  border,
  utils,
  UtilsProps,
  flex,
  FlexProps,
  BgColorProps,
  bgColor,
  height,
  HeightProps,
} from '../utils';

export interface ContainerProps
  extends UtilsProps,
    SpacingProps,
    BorderProps,
    HeightProps,
    FlexProps,
    BgColorProps {
  children?: ReactNode;
  size?: 'lg';
  $noFlex?: boolean;
  $variant?: 'div' | 'span' | 'p';
}

const containerStyles = css<ContainerProps>`
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
  ${flex}
  ${bgColor}
  ${height}
`;

const ContainerStyleDiv = styled.div<ContainerProps>`
  ${containerStyles}
`;
const ContainerStyleP = styled.div<ContainerProps>`
  ${containerStyles}
`;
const ContainerStyleSpan = styled.div<ContainerProps>`
  ${containerStyles}
`;

const variantMap = {
  div: ContainerStyleDiv,
  p: ContainerStyleP,
  span: ContainerStyleSpan,
};

export const Container: FC<ContainerProps> = ({ children, ...props }) => {
  const ContainerStyle = variantMap[props.$variant ?? 'div'];

  return <ContainerStyle {...props}>{children}</ContainerStyle>;
};

Container.defaultProps = {
  children: null,
  size: 'lg',
  $noFlex: false,
  $variant: 'div',
};

export const FlexGapContainer = styled(Container)`
  flex-direction: column;
  gap: 32px;
  z-index: 1;
`;

export const BatchContainer = styled.div`
  background-color: ${({ theme }) =>
    theme.palette.background.batchTransactionBody};
  padding: 16px;
  border-radius: 8px;
  width: 100%;
`;
