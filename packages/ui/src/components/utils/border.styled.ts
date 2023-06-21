import { css } from 'styled-components';

export interface BorderProps {
  border?: 'popup' | 'top' | 'bottom';
  $borderSize?: number;
}

const borderPropertyMap: Record<string, string> = {
  popup: 'border',
  top: 'border-top',
  bottom: 'border-bottom',
};

export const border = css<BorderProps>`
  ${props => {
    if (props.border) {
      return `${borderPropertyMap[props.border]}: ${
        props.$borderSize ?? 1
      }px solid ${props.theme.palette.border.popup};`;
    }

    return undefined;
  }}
`;
