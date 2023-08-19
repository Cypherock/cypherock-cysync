import { css } from 'styled-components';

import { generateCss } from './generateCss';

import { MediaQuery } from '../../types';

export type FontFamily = 'normal' | 'monospace';

export type WordBreak =
  | 'break-all'
  | 'keep-all'
  | 'normal'
  | 'break-word'
  | 'initial';

export interface FontProps {
  $fontWeight?: MediaQuery<
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
  >;
  $fontSize?: MediaQuery<number>;
  $fontFamily?: MediaQuery<FontFamily>;
  $wordBreak?: MediaQuery<WordBreak>;
}

export const fontWeightObj: Record<string, string> = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const fontFamilyMap: Record<FontFamily, string> = {
  normal: 'Poppins',
  monospace: 'JetBrains Mono',
};

export const font = css<FontProps>`
  ${props =>
    props.$fontWeight &&
    generateCss(
      ['font-weight'],
      (item: keyof typeof fontWeightObj) => `${fontWeightObj[item]}`,
      props.$fontWeight,
    )}

  ${props =>
    props.$fontSize &&
    generateCss(['font-size'], (item: number) => `${item}px`, props.$fontSize)};

  ${props =>
    props.$fontFamily &&
    generateCss<FontFamily>(
      ['font-family'],
      fontFamily => fontFamilyMap[fontFamily],
      props.$fontFamily,
    )};

  ${props =>
    props.$wordBreak &&
    generateCss<WordBreak>(['word-break'], val => val, props.$wordBreak)};
`;
