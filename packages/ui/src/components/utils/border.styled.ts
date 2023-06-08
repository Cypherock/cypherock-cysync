import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';

export interface BorderProps {
  border?: 'popup' | 'input';
}

export const border = css<BorderProps>`
  ${props => {
    if (props.border) {
      return `border: 1px solid ${theme.palette.border[props.border]};`;
    }
    return null;
  }}
`;
