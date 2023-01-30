import {
  flex,
  FlexProps,
  fontWeight,
  margin,
  MarginProps,
  padding,
  PaddingProps,
  width,
  FontWeightProps,
} from "@/cysync-ui/util";
import styled, { css } from "styled-components";
import { HeadingSixStyle } from "@/cysync-ui/atoms/Headings/Heading.styled";
import { ReactNode } from "react";

export type TabProps = {
  children?: ReactNode;
} & MarginProps &
  FlexProps &
  PaddingProps &
  FontWeightProps &
  React.ComponentPropsWithoutRef<"button">;

export const TabStyle = styled.button<TabProps>`
  ${width};
  ${margin}
  cursor: pointer;
  border: none;
  background-color: transparent;
`;
