import { css } from 'styled-components';
import { theme } from '../../themes/theme.styled';
import { BreakPoint } from '../../themes/screens.styled';

const spacingObj = {
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
type SpacingOptions = keyof typeof spacingObj;

type MediaQuery<T> = Partial<Record<BreakPoint, T>> | T;
export interface MarginProps {
  mb?: MediaQuery<SpacingOptions>;
  mr?: MediaQuery<SpacingOptions>;
  ml?: MediaQuery<SpacingOptions>;
  mt?: MediaQuery<SpacingOptions>;
  m?: MediaQuery<SpacingOptions>;
  mx?: MediaQuery<SpacingOptions>;
  my?: MediaQuery<SpacingOptions>;
}
export interface PaddingProps {
  pb?: MediaQuery<SpacingOptions>;
  pr?: MediaQuery<SpacingOptions>;
  pl?: MediaQuery<SpacingOptions>;
  pt?: MediaQuery<SpacingOptions>;
  p?: MediaQuery<SpacingOptions>;
  px?: MediaQuery<SpacingOptions>;
  py?: MediaQuery<SpacingOptions>;
}

export const margin = css<MarginProps>`
  ${props => {
    const finalCss = [];

    finalCss.push(...getCss(['margin-bottom'], props.mb));
    finalCss.push(...getCss(['margin-right'], props.mr));
    finalCss.push(...getCss(['margin-top'], props.mt));
    finalCss.push(...getCss(['margin-left'], props.ml));
    finalCss.push(...getCss(['margin'], props.m));
    finalCss.push(...getCss(['margin-left', 'margin-right'], props.mx));
    finalCss.push(...getCss(['margin-top', 'margin-bottom'], props.my));

    return finalCss.length ? finalCss.join(' ') : null;
  }}
`;
export const padding = css<PaddingProps>`
  ${props => {
    const finalCss = [];

    finalCss.push(...getCss(['padding-bottom'], props.pb));
    finalCss.push(...getCss(['padding-right'], props.pr));
    finalCss.push(...getCss(['padding-top'], props.pt));
    finalCss.push(...getCss(['padding-left'], props.pl));
    finalCss.push(...getCss(['padding'], props.p));
    finalCss.push(...getCss(['padding-left', 'padding-right'], props.px));
    finalCss.push(...getCss(['padding-top', 'padding-bottom'], props.py));

    return finalCss.length ? finalCss.join(' ') : null;
  }}
`;

const getCss = (names: string[], obj?: MediaQuery<SpacingOptions>) => {
  const result: any = [];
  if (obj) {
    if (typeof obj === 'object') {
      for (const bp in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, bp)) {
          const value = obj[bp as BreakPoint] as SpacingOptions;
          names.forEach(name => {
            result.push(`
              @media ${theme.screens[bp as BreakPoint]} {
                ${name}: ${spacingObj[value]};
              }
            `);
          });
        }
      }
    } else {
      names.forEach(name => {
        result.push(`${name}: ${spacingObj[obj]};`);
      });
    }
  }
  return result;
};
