import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky';
  top?: 'top0' | 'topOne' | 'topTwo' | 'topThree';
  right?: 'right0' | 'rightOne' | 'rightTwo' | 'rightThree';
  left?: 'left0' | 'leftOne' | 'leftTwo' | 'leftThree' | 'backBottom';
  bottom?: 'bottom0' | 'bottomOne' | 'bottomTwo' | 'bottomThree';
}

export const position = css<PositionProps>`
  position: ${props => {
    if (props.position === 'absolute') return 'absolute';
    if (props.position === 'relative') return 'relative';
    if (props.position === 'fixed') return 'fixed';
    if (props.position === 'sticky') return 'sticky';
    return '';
  }};

  top: ${props => {
    if (props.top === 'top0') return '0px';
    if (props.top === 'topOne') return '8px';
    if (props.top === 'topTwo') return '16px';
    if (props.top === 'topThree') return '24px';
    return '';
  }};
  right: ${props => {
    if (props.right === 'right0') return '0px';
    if (props.right === 'rightOne') return '8px';
    if (props.right === 'rightTwo') return '16px';
    if (props.right === 'rightThree') return '24px';
    return '';
  }};

  left: ${props => {
    if (props.left === 'left0') return '0px';
    if (props.left === 'leftOne') return '8px';
    if (props.left === 'leftTwo') return '16px';
    if (props.left === 'leftThree') return '24px';
    if (props.left === 'backBottom') return '468px';
    return '';
  }};

  bottom: ${props => {
    if (props.bottom === 'bottom0') return '0px';
    if (props.bottom === 'bottomOne') return '8px';
    if (props.bottom === 'bottomTwo') return '16px';
    if (props.bottom === 'bottomThree') return '24px';
    return '';
  }};
`;
