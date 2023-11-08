import { css } from 'styled-components';

import { generateCss } from './generateCss';

import { MediaQuery } from '../../types';

type DisplayType = 'none' | 'inline' | 'block' | 'inline-block' | 'flex';
type $OverflowType = 'scroll' | 'hidden' | 'auto';
type VerticalAlign =
  | 'baseline'
  | 'length'
  | 'sub'
  | 'super'
  | 'top'
  | 'text-top'
  | 'middle'
  | 'bottom'
  | 'text-bottom'
  | 'initial'
  | 'inherit';

export interface DisplayProps {
  display?: MediaQuery<DisplayType>;
  opacity?: MediaQuery<number | string>;
  $overflowX?: MediaQuery<$OverflowType>;
  $overflowY?: MediaQuery<$OverflowType>;
  $overflow?: MediaQuery<$OverflowType>;
  $verficalAlign?: MediaQuery<VerticalAlign>;
}

export const display = css<DisplayProps>`
  ${props =>
    props.display &&
    generateCss(['display'], (item: string) => `${item}`, props.display)}

  ${props =>
    props.opacity !== undefined &&
    generateCss(
      ['opacity'],
      (item: number | string) => `${item}`,
      props.opacity,
    )}

  ${props =>
    props.$overflowX &&
    generateCss(['overflow-x'], (item: string) => `${item}`, props.$overflowX)}

  ${props =>
    props.$overflowY &&
    generateCss(['overflow-y'], (item: string) => `${item}`, props.$overflowY)}

  ${props =>
    props.$overflow &&
    generateCss(['overflow-x'], (item: string) => `${item}`, props.$overflow) +
      generateCss(['overflow-y'], (item: string) => `${item}`, props.$overflow)}

  ${props =>
    props.$verficalAlign !== undefined &&
    generateCss(
      ['vertical-align'],
      (item: string) => `${item}`,
      props.$verficalAlign,
    )}
`;
