import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';

export interface MarginProps {
  mb?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
  mr?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
  ml?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
  mt?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
}
export interface PaddingProps {
  pb?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
  pr?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
  pl?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
  pt?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'auto';
}

const spacingObj: Record<string, string> = {
  '0': '0px',
  '1': theme.spacing.one.spacing,
  '2': theme.spacing.two.spacing,
  '3': theme.spacing.three.spacing,
  '4': theme.spacing.four.spacing,
  '5': theme.spacing.five.spacing,
  '6': theme.spacing.six.spacing,
  '7': theme.spacing.seven.spacing,
  '8': theme.spacing.eight.spacing,
  auto: 'auto',
};

export const margin = css<MarginProps>`
  ${props => {
    if (props.mb) {
      return `margin-bottom: ${spacingObj[props.mb]};`;
    }
    if (props.mr) {
      return `margin-right: ${spacingObj[props.mr]};`;
    }
    if (props.mt) {
      return `margin-top: ${spacingObj[props.mt]};`;
    }
    if (props.ml) {
      return `margin-left: ${spacingObj[props.ml]};`;
    }

    return null;
  }}
`;
export const padding = css<PaddingProps>`
  ${props => {
    if (props.pb) {
      return `padding-bottom: ${spacingObj[props.pb]};`;
    }
    if (props.pr) {
      return `padding-right: ${spacingObj[props.pr]};`;
    }
    if (props.pt) {
      return `padding-top: ${spacingObj[props.pt]};`;
    }
    if (props.pl) {
      return `padding-left: ${spacingObj[props.pl]};`;
    }

    return null;
  }}
`;
