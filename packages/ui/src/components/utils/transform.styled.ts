import { css } from 'styled-components';

export interface TransformProps {
  $translateX?: number;
  $translateY?: number;
  rotate?: number;
}

export const transform = css<TransformProps>`
  ${props => {
    let xVal = '0px';
    let yVal = '0px';
    let rotateVal = '0deg';
    let changeCount = 0;

    if (props.$translateY !== undefined) {
      yVal = Number.isInteger(props.$translateY)
        ? `${props.$translateY}px`
        : `${props.$translateY * 100}%`;

      changeCount += 1;
    }

    if (props.$translateX !== undefined) {
      xVal = Number.isInteger(props.$translateX)
        ? `${props.$translateX}px`
        : `${props.$translateX * 100}%`;
      changeCount += 1;
    }

    if (props.rotate !== undefined) {
      rotateVal = Number.isInteger(props.rotate)
        ? `${props.rotate}deg`
        : `${props.rotate}turn`;
      changeCount += 1;
    }

    return changeCount
      ? `transform: translate(${xVal},${yVal}) rotate(${rotateVal});`
      : '';
  }}
`;
