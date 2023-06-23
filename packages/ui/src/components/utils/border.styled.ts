import { css } from 'styled-components';
import { generateCss } from './generateCss';

type BorderType<T extends string> =
  | `${T}B`
  | `${T}R`
  | `${T}L`
  | `${T}T`
  | `${T}`
  | `${T}X`
  | `${T}Y`;

type Borders = {
  [key in BorderType<'$border'>]?: number;
};
type BorderVariant = 'popup' | 'separator';
export interface BorderProps extends Borders {
  $borderVariant?: BorderVariant;
}

const borderPropertyMap: Record<string, string[]> = {
  L: ['left'],
  R: ['right'],
  X: ['left', 'right'],
  T: ['top'],
  B: ['bottom'],
  Y: ['top', 'bottom'],
};

const getProperties = (key: BorderType<'border'>) => {
  const properties = [];
  const lastElement = key[key.length - 1];

  if (Object.keys(borderPropertyMap).indexOf(lastElement) >= 0) {
    for (const j of borderPropertyMap[lastElement] ?? []) {
      properties.push(`border-${j}`);
    }
  } else {
    properties.push('border');
  }
  return properties;
};

export const $border = css<BorderProps>`
  ${props => {
    const finalCss: any[] = [];

    for (const key in props) {
      if (key.includes('$border') && !key.includes('$borderVariant')) {
        finalCss.push(
          generateCss(
            getProperties(key as BorderType<'border'>),
            (item: number) =>
              `${item}px solid ${
                props.theme.palette.border[props.$borderVariant ?? 'popup']
              }`,
            (props as any)[key],
          ),
        );
      }
    }

    return finalCss.join(' ');
  }}
`;
