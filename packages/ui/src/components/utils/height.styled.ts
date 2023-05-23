import { css } from 'styled-components';

export interface HeightProps {
  height?: number | string;
}

export const height = css<HeightProps>`
  ${props => {
    if (props.height) {
      if (props.height === 'full') return `height: 100%;`;
      if (props.height === 'screen') return `height: 100vh;`;

      if (typeof props.height === 'string') {
        if (props.height.includes('/')) {
          const numberArray = props.height.split('/');
          const firstNumber = parseInt(numberArray[0], 10);
          const secondNumber = parseInt(numberArray[1], 10);
          return `height : ${(firstNumber / secondNumber) * 100}%;`;
        }
      }
      return `height: ${props.height}px;`;
    }
    return null;
  }}
`;
