import { css } from 'styled-components';

export interface WidthProps {
  width?: number | string;
}

export const width = css<WidthProps>`
  ${props => {
    if (props.width && typeof props.width === 'string') {
      if (props.width === 'full') return `width: 100%;`;

      const value = props.width!.substring(0, props.width.length - 1);
      return `width : ${value}%;`;
    }
    if (props.width) return `width: ${props.width}px;`;
    return null;
  }}
`;
