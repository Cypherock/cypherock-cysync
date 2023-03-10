import { css } from "styled-components";
import { alignSelf, AlignSelfProps } from "../alignSelf/alignSelf.styled";
import { display } from "../display/display.styed";
import {
  BgColorProps,
  BorderRadiusProps,
  FlexProps,
  FontWeightProps,
  PositionProps,
  MarginProps,
  PaddingProps,
  bgColor,
  borderRadius,
  flex,
  fontWeight,
  position,
  margin,
  padding,
  width,
  WidthProps,
} from "../index";

export interface UtilsProps extends BgColorProps,
  BorderRadiusProps ,
  FlexProps,
  FontWeightProps,
  PositionProps,
  MarginProps,
  PaddingProps,
  WidthProps, AlignSelfProps {}

export const utils = css<UtilsProps>`
  ${display}
  ${bgColor};
  ${borderRadius};
  ${flex};
  ${fontWeight};
  ${position};
  ${margin};
  ${padding};
  ${width}
  ${alignSelf}
`;
