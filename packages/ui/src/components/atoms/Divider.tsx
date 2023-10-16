import React, { FC } from 'react';
import styled from 'styled-components';

import { utils, UtilsProps } from '../utils';

interface DividerProps extends UtilsProps {
  variant?: 'vertical' | 'horizontal';
  stroke?: number;
  background?: string;
}

const DividerStyle = styled.div<DividerProps>`
  width: ${({ variant, stroke }) =>
    variant === 'vertical' ? `${stroke}px` : '100%'};
  height: ${({ variant, stroke }) =>
    variant === 'vertical' ? '24px' : `${stroke}px`};
  background: ${({ theme, background }) =>
    background ?? theme.palette.border.popup};
  ${utils}
`;

export const Divider: FC<DividerProps> = ({ ...props }) => (
  <DividerStyle {...props} />
);

Divider.defaultProps = {
  variant: 'vertical',
  stroke: 1,
  background: undefined,
};
