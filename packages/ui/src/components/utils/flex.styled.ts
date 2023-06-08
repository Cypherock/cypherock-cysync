import { ReactNode } from 'react';
import { css } from 'styled-components';
import { MediaQuery } from '../../types';
import { generateCss } from './generateCss';

type JustifyType =
  | 'flex-start'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'flex-end'
  | 'evenly';

type AlignType = 'flex-start' | 'center' | 'baseline' | 'flex-end' | 'stretch';

type DirectionType = 'row' | 'column';

type AlignSelfType =
  | 'auto'
  | 'stretch'
  | 'center'
  | 'start'
  | 'end'
  | 'baseline'
  | 'initial'
  | 'inherit';

const alignSelfObj: Record<string, string> = {
  start: 'flex-start',
  end: 'flex-end',
};

export interface FlexProps {
  children?: ReactNode;
  wrapReverse?: MediaQuery<boolean>;
  noWrap?: MediaQuery<boolean>;
  justify?: MediaQuery<JustifyType>;
  align?: MediaQuery<AlignType>;
  direction?: MediaQuery<DirectionType>;
  gap?: MediaQuery<number>;
  grow?: MediaQuery<number>;
  $alignSelf?: MediaQuery<AlignSelfType>;
}

const justifyContent = css<FlexProps>`
  ${props =>
    props.justify &&
    generateCss(
      ['justify-content'],
      (item: JustifyType) => `${item}`,
      props.justify,
    )}
`;

const align = css<FlexProps>`
  ${props =>
    props.align &&
    generateCss(['align-items'], (item: AlignType) => `${item}`, props.align)}
`;

const direction = css<FlexProps>`
  ${props =>
    props.direction &&
    generateCss(
      ['flex-direction'],
      (item: DirectionType) => item,
      props.direction,
    )}
`;

const gap = css<FlexProps>`
  ${props => generateCss(['gap'], (item: number) => `${item}px`, props.gap)}
`;
const grow = css<FlexProps>`
  ${props =>
    props.grow &&
    generateCss(['flex-grow'], (item: number) => `${item}`, props.grow)}
`;

const $alignSelf = css<FlexProps>`
  ${props =>
    props.$alignSelf &&
    generateCss(
      ['align-self'],
      (item: string) => `${alignSelfObj[item] ?? item}`,
      props.$alignSelf,
    )}
`;

export const flex = css<FlexProps>`
  ${justifyContent}
  ${align}
  ${direction}
  ${gap}
  ${grow}
  ${$alignSelf}
`;
