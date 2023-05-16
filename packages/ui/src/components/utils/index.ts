import { css } from 'styled-components';
import { alignSelf, AlignSelfProps } from './alignSelf.styled';
import { borderRadius, BorderRadiusProps } from './borderRadius.styled';
import { display, DisplayProps } from './display.styled';
import { flex, FlexProps } from './flex.styled';
import { fontWeight, FontWeightProps } from './fontWeight.styled';
import { position, PositionProps } from './position.styled';
import { width, WidthProps } from './width.styled';
import { bgColor, BgColorProps } from './bgColor.styled';
import { margin, MarginProps, padding, PaddingProps } from './spacing.styled';
import { height, HeightProps } from './height.styled';

export interface UtilsProps
  extends BgColorProps,
    BorderRadiusProps,
    FlexProps,
    FontWeightProps,
    PositionProps,
    MarginProps,
    PaddingProps,
    WidthProps,
    AlignSelfProps,
    DisplayProps,
    HeightProps {}

export const utils = css<UtilsProps>`
  ${bgColor}
  ${borderRadius}
  ${flex}
  ${fontWeight}
  ${position}
  ${margin}
  ${padding}
  ${width}
  ${height}
  ${display}
  ${alignSelf}
`;

export * from './borderRadius.styled';
export * from './spacing.styled';
export * from './bgColor.styled';
export * from './flex.styled';
export * from './fontWeight.styled';
export * from './position.styled';
export * from './alignSelf.styled';
export * from './display.styled';
export * from './width.styled';
