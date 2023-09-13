import { css } from 'styled-components';

import { AnimateProps, animate } from './animate.styled';
import { bgColor, BgColorProps } from './bgColor.styled';
import { border, BorderProps } from './border.styled';
import { CursorProps, cursor } from './cursor.styled';
import { display, DisplayProps } from './display.styled';
import { flex, FlexProps } from './flex.styled';
import { font, FontProps } from './font.styled';
import { height, HeightProps } from './height.styled';
import { position, PositionProps } from './position.styled';
import { ShadowProps, shadow } from './shadow.styled';
import { spacing, SpacingProps } from './spacing.styled';
import { TransformProps, transform } from './transform.styled';
import { width, WidthProps } from './width.styled';

export interface UtilsProps
  extends BgColorProps,
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
    CursorProps,
    TransformProps {}

export const utils = css<UtilsProps>`
  ${bgColor}
  ${border}
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
  ${cursor}
`;

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
export * from './border.styled';
export * from './Gradient';
export * from './dropdown';
export * from './cursor.styled';
