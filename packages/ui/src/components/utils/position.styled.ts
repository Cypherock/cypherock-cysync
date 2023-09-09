import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static';
  top?: number | string;
  right?: number | string;
  left?: number | string;
  bottom?: number | string;
  $zIndex?: number;
}

const parsePositionProp = (prop: number | string) => {
  if (typeof prop === 'number') {
    if (Number.isInteger(prop)) {
      return `${prop}px`;
    }

    return `${prop * 100}%`;
  }

  return prop;
};

export const position = css<PositionProps>`
  ${props => {
    const positionCss = [];
    if (props.position) {
      positionCss.push(`position: ${props.position};`);
    }
    if (props.top !== undefined) {
      positionCss.push(`top: ${parsePositionProp(props.top)};`);
    }
    if (props.bottom !== undefined) {
      positionCss.push(`bottom: ${parsePositionProp(props.bottom)};`);
    }
    if (props.right !== undefined) {
      positionCss.push(`right: ${parsePositionProp(props.right)};`);
    }
    if (props.left !== undefined) {
      positionCss.push(`left: ${parsePositionProp(props.left)};`);
    }
    if (props.$zIndex !== undefined) {
      positionCss.push(`z-index: ${props.$zIndex};`);
    }
    return positionCss.join(' ');
  }}
`;
