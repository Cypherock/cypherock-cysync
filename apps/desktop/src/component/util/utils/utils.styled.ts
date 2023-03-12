import { css } from "styled-components";
import {
  bgColor,
  BgColorProps,
  borderRadius,
  BorderRadiusProps,
  flex,
  FlexProps,
  fontWeight,
  FontWeightProps,
  position,
  PositionProps,
  margin,
  MarginProps,
  padding,
  PaddingProps,
  width,
  WidthProps,
  alignSelf,
  AlignSelfProps,
  display,
  DisplayProps
} from "../index";

export interface UtilsProps extends BgColorProps,
  BorderRadiusProps ,
  FlexProps,
  FontWeightProps,
  PositionProps,
  MarginProps,
  PaddingProps,
  WidthProps, AlignSelfProps, DisplayProps {}

export const utils = css<UtilsProps>`
  ${bgColor};
  ${borderRadius};
  ${flex};
  ${fontWeight};
  ${position};
  ${margin};
  ${padding};
  ${width};
  ${display};
  ${alignSelf};
`;
