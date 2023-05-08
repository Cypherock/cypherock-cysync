import { css } from 'styled-components';

export interface WidthProps {
  width?: string | number;
}

export const width = css<WidthProps>`
  ${props => {
    if (props.width === 1 / 4) {
      return `width: 25%;`;
    }
    if (props.width === 1 / 2) {
      return `width: 50%;`;
    }
    if (props.width === 3 / 4) {
      return `width: 75%;`;
    }
    return `width: ${props.width};`;
  }}
`;
