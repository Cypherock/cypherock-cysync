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
import { theme } from "@/theme/theme.styled";

export type DropDownSelectProps = {
  children?: ReactNode;
} & MarginProps &
  FlexProps &
  PaddingProps &
  FontWeightProps;

export const DropDownSelectStyle = styled.div<DropDownSelectProps>`
  cursor: pointer;
  border-radius: 8px;
  background-color: #27221d;
  border: 1px solid #39322c;
  padding: 12px 26px;
  min-width: 300px;
  max-width: 300px;

  ${flex}
`;
