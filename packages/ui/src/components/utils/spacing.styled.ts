import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';

export interface MarginProps {
  mb?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  mr?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  ml?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  mt?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  m?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  mx?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  my?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
}
export interface PaddingProps {
  pb?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  pr?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  pl?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  pt?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  p?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  px?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
  py?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'auto';
}

const spacingObj: Record<string, string> = {
  0: '0px',
  1: theme.spacing.one.spacing,
  2: theme.spacing.two.spacing,
  3: theme.spacing.three.spacing,
  4: theme.spacing.four.spacing,
  5: theme.spacing.five.spacing,
  6: theme.spacing.six.spacing,
  7: theme.spacing.seven.spacing,
  8: theme.spacing.eight.spacing,
  auto: 'auto',
};

export const margin = css<MarginProps>`
  ${props => {
    const tempCss = [];
    if (props.mb) {
      tempCss.push(`margin-bottom: ${spacingObj[props.mb]};`);
    }
    if (props.mr) {
      tempCss.push(`margin-right: ${spacingObj[props.mr]};`);
    }
    if (props.mt) {
      tempCss.push(`margin-top: ${spacingObj[props.mt]};`);
    }
    if (props.ml) {
      tempCss.push(`margin-left: ${spacingObj[props.ml]};`);
    }
    if (props.m) {
      tempCss.push(`margin: ${spacingObj[props.m]};`);
    }
    if (props.mx) {
      tempCss.push(`
      margin-left: ${spacingObj[props.mx]}; 
      margin-right: ${spacingObj[props.mx]};`);
    }
    if (props.my) {
      tempCss.push(`
      margin-top: ${spacingObj[props.my]}; 
      margin-bottom: ${spacingObj[props.my]};`);
    }

    return tempCss.length ? tempCss.join(' ') : null;
  }}
`;
export const padding = css<PaddingProps>`
  ${props => {
    const tempCss = [];

    if (props.pb) {
      tempCss.push(`padding-bottom: ${spacingObj[props.pb]};`);
    }
    if (props.pr) {
      tempCss.push(`padding-right: ${spacingObj[props.pr]};`);
    }
    if (props.pt) {
      tempCss.push(`padding-top: ${spacingObj[props.pt]};`);
    }
    if (props.pl) {
      tempCss.push(`padding-left: ${spacingObj[props.pl]};`);
    }
    if (props.p) {
      tempCss.push(`padding: ${spacingObj[props.p]};`);
    }
    if (props.px) {
      tempCss.push(`
      padding-left: ${spacingObj[props.px]}; 
      padding-right: ${spacingObj[props.px]};`);
    }
    if (props.py) {
      tempCss.push(`padding-top: ${spacingObj[props.py]}; 
      padding-bottom: ${spacingObj[props.py]};`);
    }

    return tempCss.length ? tempCss.join(' ') : null;
  }}
`;
