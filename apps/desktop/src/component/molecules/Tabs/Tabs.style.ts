import { UtilsProps, utils } from "@/component/util";
import styled, { css } from "styled-components";
import { HeadingSixStyle } from "@/component/atoms/Headings/Heading.styled";
import { ReactNode } from "react";

export type TabProps = {
  children?: ReactNode;
} & UtilsProps &
  React.ComponentPropsWithoutRef<"button">;

export const TabStyle = styled.button<TabProps>`
  ${utils}
  cursor: pointer;
  border: none;
  background-color: transparent;
`;
