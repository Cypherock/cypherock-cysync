import { css } from 'styled-components';
import { borderRadius, BorderRadiusProps } from './borderRadius.styled';
import { display, DisplayProps } from './display.styled';
import { flex, FlexProps } from './flex.styled';
import { font, FontProps } from './font.styled';
import { position, PositionProps } from './position.styled';
import { width, WidthProps } from './width.styled';
import { $bgColor, BgColorProps } from './bgColor.styled';
import { spacing, SpacingProps } from './spacing.styled';
import { height, HeightProps } from './height.styled';
import { ShadowProps, shadow } from './shadow.styled';
import { BorderProps, border } from './border.styled';
import { TransformProps, transform } from './transform.styled';
import { AnimateProps, animate } from './animate.styled';

export interface UtilsProps
  extends BgColorProps,
    BorderRadiusProps,
    FlexProps,
    FontProps,
    PositionProps,
    SpacingProps,
    WidthProps,
    DisplayProps,
    ShadowProps,
    BorderProps,
    HeightProps,
    AnimateProps,
    TransformProps {}

export const utils = css<UtilsProps>`
  ${$bgColor}
  ${border}
  ${borderRadius}
  ${flex}
  ${font}
  ${position}
  ${spacing}
  ${width}
  ${height}
  ${display}
  ${shadow}
  ${transform}
  ${animate}
`;

export * from './borderRadius.styled';
export * from './spacing.styled';
export * from './bgColor.styled';
export * from './flex.styled';
export * from './font.styled';
export * from './transform.styled';
export * from './position.styled';
export * from './display.styled';
export * from './width.styled';
export * from './shadow.styled';
export * from './height.styled';
export * from './animate.styled';
