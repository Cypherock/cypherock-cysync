import { UtilsProps, utils } from "@/component/util";
import styled, { css } from "styled-components";
import { HeadingSixStyle } from "@/component/atoms/Headings/Heading.styled";
import { ReactNode } from "react";

export interface TabProps extends UtilsProps, React.ComponentPropsWithoutRef<"button">  {
  children?: ReactNode;
}

export const TabStyle = styled.button<TabProps>`
  ${utils}
  cursor: pointer;
  border: none;
  background-color: transparent;
`;
