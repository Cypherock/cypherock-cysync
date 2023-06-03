import { css } from 'styled-components';
import { MediaQuery } from '../../types';
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
  full: '100%',
  screen: '100vw',
  inherit: 'inherit',
};

const getWidth = (width: WidthType | number | string) => {
  let widthCss = '';
  if (width !== undefined) {
    if (typeof width === 'string') {
      if (widthMap[width as WidthType]) {
        widthCss = widthMap[width as WidthType];
      } else if (width.includes('/')) {
        const numberArray = width.split('/');
        const firstNumber = parseInt(numberArray[0], 10);
        const secondNumber = parseInt(numberArray[1], 10);
        widthCss = `${(firstNumber / secondNumber) * 100}%`;
      } else {
        widthCss = `${width}px`;
      }
    } else if (typeof width === 'number') {
      widthCss = `${width}px`;
    }
  }
  return widthCss;
};

export const width = css<WidthProps>`
  ${props => props.width && generateCss(['width'], getWidth, props.width)}
`;
