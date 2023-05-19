import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static';
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}

export const position = css<PositionProps>`
  ${props => {
    const positionCss = [];
    if (props.position) {
      positionCss.push(`position: ${props.position};`);
    }
    if (props.top) {
      if (!Number.isInteger(props.top)) {
        positionCss.push(`top: ${props.top * 100}%;`);
      }
      positionCss.push(`top: ${props.top}px;`);
    }
    if (props.bottom) {
      if (!Number.isInteger(props.bottom)) {
        positionCss.push(`bottom: ${props.bottom * 100}%;`);
      }
      positionCss.push(`bottom: ${props.bottom}px;`);
    }
    if (props.right) {
      if (!Number.isInteger(props.right)) {
        positionCss.push(`right: ${props.right * 100}%;`);
      }
      positionCss.push(`right: ${props.right}px;`);
    }
    if (props.left) {
      if (!Number.isInteger(props.left)) {
        positionCss.push(`left: ${props.left * 100}%;`);
      }
      positionCss.push(`left: ${props.left}px;`);
    }
    return positionCss.join(' ');
  }}
`;
