import { css } from 'styled-components';

import { generateCss } from './generateCss';

import { MediaQuery } from '../../types';

type BorderType<T extends string> =
  | `${T}B`
  | `${T}R`
  | `${T}L`
  | `${T}T`
  | `${T}`
  | `${T}X`
  | `${T}Y`;
type Borders = {
  [key in BorderType<'$borderWidth'>]?: number;
};
export type BorderColor =
  | 'card'
  | 'gold'
  | 'popup'
  | 'separator'
  | 'info'
  | 'input'
  | 'warning'
  | 'white'
  | 'list'
  | 'topbar'
  | 'danger';
type BorderRadius = number | 'full' | string;
type BorderStyle = 'dotted' | 'dashed' | 'solid' | 'double' | 'none';

export interface BorderProps extends Borders {
  $borderColor?: BorderColor;
  $borderRadius?: MediaQuery<BorderRadius>;
  $borderStyle?: BorderStyle;
}

const borderPropertyMap: Record<string, string[]> = {
  L: ['left'],
  R: ['right'],
  X: ['left', 'right'],
  T: ['top'],
  B: ['bottom'],
  Y: ['top', 'bottom'],
};

const getProperties = (key: BorderType<'border'>, prop: string) => {
  const properties = [];
  const lastElement = key[key.length - 1];
  if (Object.keys(borderPropertyMap).includes(lastElement)) {
    for (const j of borderPropertyMap[lastElement]) {
      properties.push(`border-${j}-${prop}`);
    }
  } else {
    properties.push(`border-${prop}`);
  }
  return properties;
};

const hasBorderProperty = (props: any) => {
  const keys = Object.keys(props);
  for (const key of keys) {
    if (key.includes('$border')) {
      return true;
    }
  }
  return false;
};

const getBorderCss = (props: any) => {
  const finalCss: any[] = [];
  const defaultBorderWidth = `border-width: 0px;`;
  finalCss.push(defaultBorderWidth);

  const borderCss = {
    width: 'border-width: 1px;',
    style: 'border-style: solid;',
    color: `border-color: ${props.theme.palette.border.popup};`,
    radius: 'border-radius: 0px;',
  };

  for (const key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if (key.includes('$borderStyle')) {
        borderCss.style = generateCss(
          getProperties(key as BorderType<'border'>, 'style'),
          (item: BorderStyle) => `${item}`,
          (props as any)[key],
        );
      }

      if (key.includes('$borderWidth')) {
        borderCss.width = generateCss(
          getProperties(key as BorderType<'border'>, 'width'),
          (item: number) => `${item}px`,
          (props as any)[key],
        );
      }

      if (key.includes('$borderColor')) {
        borderCss.color = generateCss(
          getProperties(key as BorderType<'border'>, 'color'),
          (item: BorderColor) => `${props.theme.palette.border[item]}`,
          (props as any)[key],
        );
      }

      if (key.includes('$borderRadius')) {
        borderCss.radius = generateCss(
          getProperties(key as BorderType<'border'>, 'radius'),
          (item: BorderRadius) => {
            if (item === 'full') {
              return '9999px';
            }
            if (typeof item === 'number') {
              return `${item}px`;
            }
            return item;
          },
          (props as any)[key],
        );
      }
    }
  }

  finalCss.push(...Object.values(borderCss));
  return finalCss.join(' ');
};

export const border = css<BorderProps>`
  ${props => {
    if (hasBorderProperty(props)) {
      return getBorderCss(props);
    }

    return undefined;
  }}
`;
