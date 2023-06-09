import { css } from 'styled-components';
import { generateCss } from './generateCss';
import { MediaQuery } from '../../types';

type FontType =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

export interface FontProps {
  font?: MediaQuery<FontType>;
  fontSize?: MediaQuery<number>;
}

const fontWeightObj: Record<string, string> = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const font = css<FontProps>`
  ${props =>
    props.font &&
    generateCss(
      ['font-weight'],
      (item: keyof typeof fontWeightObj) => `${fontWeightObj[item]}`,
      props.font,
    )}
  ${props =>
    props.fontSize &&
    generateCss(['font-size'], (item: number) => `${item}px`, props.fontSize)};
`;
