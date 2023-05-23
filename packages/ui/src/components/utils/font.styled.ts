import { css } from 'styled-components';

export interface FontProps {
  font?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold';
  fontSize?: number;
}

const fontWeightObj = {
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
  ${props => props.font && `font-weight: ${fontWeightObj[props.font]};`};
  ${props => props.fontSize && `font-size: ${props.fontSize}px;`};
`;
