import { css } from 'styled-components';

export interface HeightProps {
  height?: number | string;
  heightL?: number | string;
}

export const height = css<HeightProps>`
  ${props => {
    const heightCss = [];
    if (props.height) {
      if (props.height === 'full') heightCss.push(`height: 100%;`);
      else if (props.height === 'screen') heightCss.push(`height: 100vh;`);
      else if (typeof props.height === 'string') {
        if (props.height.includes('/')) {
          const numberArray = props.height.split('/');
          const firstNumber = parseInt(numberArray[0], 10);
          const secondNumber = parseInt(numberArray[1], 10);
          heightCss.push(`height : ${(firstNumber / secondNumber) * 100}%;`);
        }
      } else heightCss.push(`height: ${props.height}px;`);
    }

    if (props.heightL) {
      if (props.heightL === 'full')
        heightCss.push(`@media ${props.theme.screens.laptopL} {
          height: 100%;
        }`);
      else if (props.heightL === 'screen')
        heightCss.push(`@media ${props.theme.screens.laptopL} {
          height: 100vh;
        }`);
      else if (typeof props.heightL === 'string') {
        if (props.heightL.includes('/')) {
          const numberArray = props.heightL.split('/');
          const firstNumber = parseInt(numberArray[0], 10);
          const secondNumber = parseInt(numberArray[1], 10);
          heightCss.push(
            `@media ${props.theme.screens.laptopL} {
              height : ${(firstNumber / secondNumber) * 100}%;
          }`,
          );
        }
      } else
        heightCss.push(
          `@media ${props.theme.screens.laptopL} {
            height: ${props.heightL}px;
          }`,
        );
    }

    return heightCss.join(' ');
  }}
`;
