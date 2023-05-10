import { css } from 'styled-components';

export interface WidthProps {
  width?: number;
}

export const width = css<WidthProps>`
  ${props => {
    if (props.width && !Number.isInteger(props.width)) {
      return `width: ${props.width * 100}%`;
    }
    return `width: ${props.width}px;`;
  }}
`;
