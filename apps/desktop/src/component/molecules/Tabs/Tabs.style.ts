import { UtilsProps, utils } from "../../util";
import styled from "styled-components";
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
