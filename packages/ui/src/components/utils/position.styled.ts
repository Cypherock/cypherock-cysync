import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static';
  top?: string | number;
  right?: string | number;
  left?: string | number;
  bottom?: string | number;
}

export const position = css<PositionProps>`
  ${props => {
    if (props.position) {
      return `position: ${props.position};`;
    }
    if (props.top) {
      if (props.top === 1 / 4) {
        return `top: 25%;`;
      }
      if (props.top === 1 / 2) {
        return `top: 50%;`;
      }
      if (props.top === 3 / 4) {
        return `top: 75%;`;
      }
      return `top: ${props.top};`;
    }
    if (props.bottom) {
      if (props.bottom === 1 / 4) {
        return `bottom: 25%;`;
      }
      if (props.bottom === 1 / 2) {
        return `bottom: 50%;`;
      }
      if (props.bottom === 3 / 4) {
        return `bottom: 75%;`;
      }
      return `bottom: ${props.bottom};`;
    }
    if (props.right) {
      if (props.right === 1 / 4) {
        return `right: 25%;`;
      }
      if (props.right === 1 / 2) {
        return `right: 50%;`;
      }
      if (props.right === 3 / 4) {
        return `right: 75%;`;
      }
      return `right: ${props.right};`;
    }
    if (props.left) {
      if (props.left === 1 / 4) {
        return `left: 25%;`;
      }
      if (props.left === 1 / 2) {
        return `left: 50%;`;
      }
      if (props.left === 3 / 4) {
        return `left: 75%;`;
      }
      return `left: ${props.left};`;
    }
    return null;
  }}
`;
