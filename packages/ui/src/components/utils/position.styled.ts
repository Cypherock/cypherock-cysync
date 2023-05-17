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
    if (props.position) {
      return `position: ${props.position};`;
    }
    if (props.top) {
      if (!Number.isInteger(props.top)) {
        return `top: ${props.top * 100}%`;
      }
      return `top: ${props.top}px;`;
    }
    if (props.bottom) {
      if (!Number.isInteger(props.bottom)) {
        return `bottom: ${props.bottom * 100}%`;
      }
      return `bottom: ${props.bottom}px;`;
    }
    if (props.right) {
      if (!Number.isInteger(props.right)) {
        return `right: ${props.right * 100}%`;
      }
      return `right: ${props.right}px;`;
    }
    if (props.left) {
      if (!Number.isInteger(props.left)) {
        return `left: ${props.left * 100}%`;
      }
      return `left: ${props.left}px;`;
    }
    return null;
  }}
`;
