import { css } from 'styled-components';

import { theme } from '../../themes/theme.styled';

export interface ShadowProps {
  shadow?: 'popup' | 'hover:popup';
}

export const shadow = css<ShadowProps>`
  ${props => {
    if (props.shadow) {
      if (props.shadow === 'popup') return `box-shadow: ${theme.shadow.popup};`;
      if (props.shadow === 'hover:popup')
        return `&:hover { box-shadow: ${theme.shadow.popup}; }`;
    }
    return null;
  }}
`;
