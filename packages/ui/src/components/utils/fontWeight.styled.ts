import { css } from 'styled-components';

export interface FontWeightProps {
  font?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'normal'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold';
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

export const fontWeight = css<FontWeightProps>`
  ${props => `font-weight: ${props.font && fontWeightObj[props.font]}`};
`;
