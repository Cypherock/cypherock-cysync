import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';

export interface BorderProps {
  border?: 'popup' | 'top' | 'bottom';
}

export const border = css<BorderProps>`
  ${props => {
    if (props.border) {
      if (props.border === 'popup')
        return `border: 1px solid ${theme.palette.border.popup};`;
      if (props.border === 'top')
        return `border-top: 1px solid ${theme.palette.border.popup};`;
      if (props.border === 'bottom')
        return `border-bottom: 1px solid ${theme.palette.border.popup};`;
    }
    return null;
  }}
`;
