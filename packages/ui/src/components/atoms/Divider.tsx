import React, { FC } from 'react';
import styled from 'styled-components';
import { utils, UtilsProps } from '../utils';

export interface DividerProps extends UtilsProps {
  variant?: 'vertical' | 'horizontal';
}

export const DividerHorizontalStyle = styled.div<DividerProps>`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border.main};
  ${utils}
`;

export const DividerVerticalStyle = styled.div<DividerProps>`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => theme.palette.border.main};
  ${utils}
`;

export const Divider: FC<DividerProps> = ({ variant, ...props }) => {
  switch (variant) {
    case 'vertical':
      return <DividerVerticalStyle {...props} />;
    default:
      return <DividerHorizontalStyle {...props} />;
  }
};

Divider.defaultProps = {
  variant: 'vertical',
};
