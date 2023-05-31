import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static';
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
  $zIndex?: number;
}

export const position = css<PositionProps>`
  ${props => {
    const positionCss = [];
    if (props.position) {
      positionCss.push(`position: ${props.position};`);
    }
    if (props.top !== undefined) {
      if (!Number.isInteger(props.top))
        positionCss.push(`top: ${props.top * 100}%;`);
      else positionCss.push(`top: ${props.top}px;`);
    }
    if (props.bottom !== undefined) {
      if (!Number.isInteger(props.bottom)) {
        positionCss.push(`bottom: ${props.bottom * 100}%;`);
      } else positionCss.push(`bottom: ${props.bottom}px;`);
    }
    if (props.right !== undefined) {
      if (!Number.isInteger(props.right)) {
        positionCss.push(`right: ${props.right * 100}%;`);
      }
      positionCss.push(`right: ${props.right}px;`);
    }
    if (props.left !== undefined) {
      if (!Number.isInteger(props.left)) {
        positionCss.push(`left: ${props.left * 100}%;`);
      } else positionCss.push(`left: ${props.left}px;`);
    }
    if (props.$zIndex !== undefined) {
      positionCss.push(`z-index: ${props.$zIndex};`);
    }
    return positionCss.join(' ');
  }}
`;
