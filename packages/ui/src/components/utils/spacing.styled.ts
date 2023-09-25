import { css } from 'styled-components';

import { BreakPoint } from '../../themes/screens.styled';
import { theme } from '../../themes/theme.styled';

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
type SpacingOptions = keyof typeof spacingObj | string;

type MediaQuery<T> = Partial<Record<BreakPoint, T>> | T;

type SpacingType<T extends string> =
  | `${T}b`
  | `${T}r`
  | `${T}l`
  | `${T}t`
  | `${T}`
  | `${T}x`
  | `${T}y`;

export type SpacingProps = {
  [key in SpacingType<'m'> | SpacingType<'p'>]?: MediaQuery<SpacingOptions>;
};

const cssMap: Record<string, string[]> = {
  m: ['margin'],
  p: ['padding'],
  l: ['left'],
  r: ['right'],
  x: ['left', 'right'],
  t: ['top'],
  b: ['bottom'],
  y: ['top', 'bottom'],
};

export const spacing = css<SpacingProps>`
  ${props => {
    const finalCss = [];

    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        const cssTemp = getCss(getProperties(key as any), (props as any)[key]);

        finalCss.push(...cssTemp);
      }
    }

    return finalCss.length ? finalCss.join(' ') : null;
  }}
`;

const getProperties = (key: SpacingType<'m'> | SpacingType<'p'>) => {
  const [first, second] = key.split('');
  const properties = [];
  if (key.length <= 2)
    for (const i of cssMap[first] ?? []) {
      if (second) {
        for (const j of cssMap[second] ?? []) {
          properties.push(`${i}-${j}`);
        }
      } else {
        properties.push(i);
      }
    }
  return properties;
};

const getSpacingValue = (param: SpacingOptions) => {
  if (typeof param === 'string') {
    if (['auto'].includes(param) || !param[param.length - 1].match(/[0-9]/))
      return param;

    return `${param}px`;
  }

  return spacingObj[param];
};

const getCss = (names: string[], obj?: MediaQuery<SpacingOptions>) => {
  const result: any = [];
  if (typeof obj !== 'undefined') {
    if (typeof obj === 'object') {
      for (const bp in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, bp)) {
          const value = obj[bp as BreakPoint]!;
          names.forEach(name => {
            result.push(`
              @media ${theme.screens[bp as BreakPoint]} {
                ${name}: ${getSpacingValue(value)};
              }
            `);
          });
        }
      }
    } else {
      names.forEach(name => {
        result.push(`${name}: ${getSpacingValue(obj)};`);
      });
    }
  }
  return result;
};
