import { css } from 'styled-components';

import { generateCss } from './generateCss';

import { MediaQuery } from '../../types';
import { getHeightWidth } from '../../utils/getHeightWidth';

type WidthType = 'full' | 'screen' | 'inherit';
type IImageType = number | string | WidthType;

export interface WidthProps {
  width?: MediaQuery<IImageType>;
  $width?: MediaQuery<IImageType>;
  $minWidth?: MediaQuery<IImageType>;
  $maxWidth?: MediaQuery<IImageType>;
}

const widthMap: Record<WidthType, string> = {
  full: '100%',
  screen: '100vw',
  inherit: 'inherit',
};

const getWidth = (item: WidthType | number | string) =>
  getHeightWidth(item, widthMap);

export const width = css<WidthProps>`
  ${props => props.width && generateCss(['width'], getWidth, props.width)}
  ${props => props.$width && generateCss(['width'], getWidth, props.$width)}
  ${props =>
    props.$maxWidth && generateCss(['max-width'], getWidth, props.$maxWidth)}
  ${props =>
    props.$minWidth && generateCss(['min-width'], getWidth, props.$minWidth)}
`;
