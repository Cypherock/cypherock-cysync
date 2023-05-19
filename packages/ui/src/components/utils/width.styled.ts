import { css } from 'styled-components';

export interface WidthProps {
  width?: number | string;
  widthL?: number | string;
}

export const width = css<WidthProps>`
  ${props => {
    const widthCss = [];
    if (props.width) {
      if (props.width === 'full') widthCss.push(`width: 100%;`);
      else if (props.width === 'screen') widthCss.push(`width: 100vh;`);
      else if (typeof props.width === 'string') {
        if (props.width.includes('/')) {
          const numberArray = props.width.split('/');
          const firstNumber = parseInt(numberArray[0], 10);
          const secondNumber = parseInt(numberArray[1], 10);
          widthCss.push(`width : ${(firstNumber / secondNumber) * 100}%;`);
        }
      } else widthCss.push(`width: ${props.width}px;`);
    }

    if (props.widthL) {
      if (props.widthL === 'full')
        widthCss.push(`@media ${props.theme.screens.laptopL} {
          width: 100%;
        }`);
      else if (props.widthL === 'screen')
        widthCss.push(`@media ${props.theme.screens.laptopL} {
          width: 100vh;
        }`);
      else if (typeof props.widthL === 'string') {
        if (props.widthL.includes('/')) {
          const numberArray = props.widthL.split('/');
          const firstNumber = parseInt(numberArray[0], 10);
          const secondNumber = parseInt(numberArray[1], 10);
          widthCss.push(
            `@media ${props.theme.screens.laptopL} {
              width : ${(firstNumber / secondNumber) * 100}%;
          }`,
          );
        }
      } else
        widthCss.push(
          `@media ${props.theme.screens.laptopL} {
            width: ${props.widthL}px;
          }`,
        );
    }

    return widthCss.join(' ');
  }}
`;
