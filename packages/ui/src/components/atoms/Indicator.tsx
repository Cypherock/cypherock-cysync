import { styled } from 'styled-components';

import { theme } from '../../themes/theme.styled';

export type IndicatorState = 'disabled' | 'focused' | 'success' | 'failed';

export interface IndicatorProps {
  state?: IndicatorState;
  size?: number;
}

export const Indicator = styled.div<IndicatorProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${({ size = 16 }) => size / 2}px;
  background: ${props => {
    if (props.state === 'success') return theme.palette.success.main;
    if (props.state === 'focused') return theme.palette.golden;
    if (props.state === 'failed') return theme.palette.warn.main;
    return 'transparent';
  }};
  ${props =>
    props.state === 'disabled' &&
    `border: 2px solid ${theme.palette.text.muted};`}
`;

Indicator.defaultProps = {
  state: 'disabled',
  size: 16,
};
