import { UtilsProps, utils } from "@/component/util";
import styled, { css } from "styled-components";
import { HeadingSixStyle } from "@/component/atoms/Headings/Heading.styled";
import { ReactNode } from "react";
import { theme } from "@/theme/theme.styled";

export type DropDownSelectProps = {
  children?: ReactNode;
} & UtilsProps;

export const DropDownSelectStyle = styled.div<DropDownSelectProps>`
  cursor: pointer;
  border-radius: 8px;
  background-color: #27221d;
  border: 1px solid #39322c;
  padding: 12px 26px;
  min-width: 300px;
  max-width: 300px;

  ${utils}
`;
