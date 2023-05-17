import { css } from 'styled-components';

export interface WidthProps {
  width?: number | string;
}

export const width = css<WidthProps>`
  ${props => {
    if (props.width) {
      if (props.width === 'full') return `width: 100%;`;
      if (props.width === 'screen') return `width: 100vh;`;

      if (typeof props.width === 'string') {
        if (props.width.includes('/')) {
          const numberArray = props.width.split('/');
          const firstNumber = parseInt(numberArray[0], 10);
          const secondNumber = parseInt(numberArray[1], 10);
          return `width : ${(firstNumber / secondNumber) * 100}%;`;
        }
      }
      return `width: ${props.width}px;`;
    }
    return null;
  }}
`;
