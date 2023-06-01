import { css } from 'styled-components';
import { MediaQuery } from '../../types';
import { generateCss } from './generateCss';

type HeightType = 'full' | 'screen' | 'inherit';
type IImageType = number | string | HeightType;

export interface HeightProps {
  height?: MediaQuery<IImageType>;
}
export interface ImageHeightProps {
  height?: IImageType;
}

const heightMap: Record<HeightType, string> = {
  full: '100%;',
  screen: '100vh;',
  inherit: 'inherit;',
};

const getHeight = (height: HeightType | number | string) => {
  const heightCss = [];
  if (height !== undefined) {
    if (typeof height === 'string') {
      if (heightMap[height as HeightType]) {
        heightCss.push(heightMap[height as HeightType]);
      } else if (height.includes('/')) {
        const numberArray = height.split('/');
        const firstNumber = parseInt(numberArray[0], 10);
        const secondNumber = parseInt(numberArray[1], 10);
        heightCss.push(`${(firstNumber / secondNumber) * 100}%;`);
      } else {
        heightCss.push(`${height}px;`);
      }
    } else if (typeof height === 'number') {
      heightCss.push(`${height}px;`);
    }
  }
  return heightCss.join(' ');
};

export const height = css<HeightProps>`
  ${props => props.height && generateCss(['height'], getHeight, props.height)}
`;
