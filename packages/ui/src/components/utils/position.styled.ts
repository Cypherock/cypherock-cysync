import { css } from 'styled-components';

export interface PositionProps {
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'static';
  top?: number;
  $topL?: number;
  right?: number;
  $rightL?: number;
  left?: number;
  $leftL?: number;
  bottom?: number;
  $bottomL?: number;
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
    if (props.$topL) {
      if (!Number.isInteger(props.$topL)) {
        positionCss.push(`
        @media ${props.theme.screens.laptopL} {
        top: ${props.$topL * 100}%;}`);
      }
      positionCss.push(`
      @media ${props.theme.screens.laptopL} {
      top: ${props.$topL}px;}`);
    }
    if (props.bottom) {
      if (!Number.isInteger(props.bottom)) {
        positionCss.push(`bottom: ${props.bottom * 100}%;`);
      }
      positionCss.push(`bottom: ${props.bottom}px;`);
    }
    if (props.$bottomL) {
      if (!Number.isInteger(props.$bottomL)) {
        positionCss.push(`
        @media ${props.theme.screens.laptopL} {
        bottom: ${props.$bottomL * 100}%;}`);
      }
      positionCss.push(`
      @media ${props.theme.screens.laptopL} {
      bottom: ${props.$bottomL}px;}`);
    }
    if (props.right) {
      if (!Number.isInteger(props.right)) {
        positionCss.push(`right: ${props.right * 100}%;`);
      }
      positionCss.push(`right: ${props.right}px;`);
    }
    if (props.$rightL) {
      if (!Number.isInteger(props.$rightL)) {
        positionCss.push(`
        @media ${props.theme.screens.laptopL} {
        right: ${props.$rightL * 100}%;}`);
      }
      positionCss.push(`
      @media ${props.theme.screens.laptopL} {
      right: ${props.$rightL}px;}`);
    }
    if (props.left) {
      if (!Number.isInteger(props.left)) {
        positionCss.push(`left: ${props.left * 100}%;`);
      }
      positionCss.push(`left: ${props.left}px;`);
    }
    if (props.$leftL) {
      if (!Number.isInteger(props.$leftL)) {
        positionCss.push(`
        @media ${props.theme.screens.laptopL} {
        left: ${props.$leftL * 100}%;}`);
      }
      positionCss.push(`
      @media ${props.theme.screens.laptopL} {
      left: ${props.$leftL}px;}`);
    }
    return positionCss.join(' ');
  }}
`;
