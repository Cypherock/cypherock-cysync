import { css } from 'styled-components';

export interface TranslateProps {
  translateX?: number;
  translateY?: number;
}

export const translate = css<TranslateProps>`
  ${props => {
    let xVal = '0px';
    let yVal = '0px';
    if (props.translateY !== undefined) {
      if (!Number.isInteger(props.translateY))
        yVal = `${props.translateY * 100}%`;
      else yVal = `${props.translateY}px`;
    }
    if (props.translateX !== undefined) {
      if (!Number.isInteger(props.translateX))
        xVal = `${props.translateX * 100}%`;
      else xVal = `${props.translateX}px`;
    }
    return `transform: translate(${xVal},${yVal})`;
  }}
`;
