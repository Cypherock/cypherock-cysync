import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static';
  top?: number | string;
  right?: number | string;
  left?: number | string;
  bottom?: number | string;
  $zIndex?: number;
}

export const position = css<PositionProps>`
  ${props => {
    const positionCss = [];
    if (props.position) {
      positionCss.push(`position: ${props.position};`);
    }
    if (props.top !== undefined) {
      if (typeof props.top === 'string') positionCss.push(`top: ${props.top};`);
      else positionCss.push(`top: ${props.top}px;`);
    }
    if (props.bottom !== undefined) {
      if (typeof props.bottom === 'string')
        positionCss.push(`bottom: ${props.bottom};`);
      else positionCss.push(`bottom: ${props.bottom}px;`);
    }
    if (props.right !== undefined) {
      if (typeof props.right === 'string')
        positionCss.push(`right: ${props.right};`);
      positionCss.push(`right: ${props.right}px;`);
    }
    if (props.left !== undefined) {
      if (typeof props.left === 'string')
        positionCss.push(`left: ${props.left};`);
      else positionCss.push(`left: ${props.left}px;`);
    }
    if (props.$zIndex !== undefined) {
      positionCss.push(`z-index: ${props.$zIndex};`);
    }
    return positionCss.join(' ');
  }}
`;
