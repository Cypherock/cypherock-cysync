import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';

export interface BorderProps {
  border?: 'popup';
}

export const border = css<BorderProps>`
  ${props => {
    if (props.border) {
      if (props.border === 'popup')
        return `border: 1px solid ${theme.palette.border.popup};`;
    }
    return null;
  }}
`;
