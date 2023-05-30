import { css } from 'styled-components';
import { MediaQuery } from '../../types/types';
import { generateCss } from './generateCss';

type WidthType = 'full' | 'screen' | 'inherit';
type IImageType = number | string | WidthType;

export interface WidthProps {
  width?: MediaQuery<IImageType>;
}
export interface ImageWidthProps {
  width?: IImageType;
}

const widthMap: Record<WidthType, string> = {
  full: '100%;',
  screen: '100vw;',
  inherit: 'inherit;',
};

const getWidth = (width: WidthType | number | string) => {
  const widthCss = [];
  if (width !== undefined) {
    if (typeof width === 'string') {
      if (widthMap[width as WidthType]) {
        widthCss.push(widthMap[width as WidthType]);
      } else if (width.includes('/')) {
        const numberArray = width.split('/');
        const firstNumber = parseInt(numberArray[0], 10);
        const secondNumber = parseInt(numberArray[1], 10);
        widthCss.push(`${(firstNumber / secondNumber) * 100}%;`);
      } else {
        widthCss.push(`${width}px;`);
      }
    } else if (typeof width === 'number') {
      widthCss.push(`${width}px;`);
    }
  }
  return widthCss.join(' ');
};

export const width = css<WidthProps>`
  ${props => props.width && generateCss(['width'], getWidth, props.width)}
`;
