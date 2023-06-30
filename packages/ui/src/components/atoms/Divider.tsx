import React, { FC } from 'react';
import styled from 'styled-components';

import { utils, UtilsProps } from '../utils';

interface DividerProps extends UtilsProps {
  variant?: 'vertical' | 'horizontal';
}

const DividerStyle = styled.div<DividerProps>`
  width: ${({ variant }) => (variant === 'vertical' ? '1px' : '100%')};
  height: ${({ variant }) => (variant === 'vertical' ? '24px' : '1px')};
  background-color: ${({ theme }) => theme.palette.border.main};
  ${utils}
`;

export const Divider: FC<DividerProps> = ({ ...props }) => (
  <DividerStyle {...props} />
);

Divider.defaultProps = {
  variant: 'vertical',
};
