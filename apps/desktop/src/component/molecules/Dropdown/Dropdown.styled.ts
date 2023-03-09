import { UtilsProps, utils } from "@/component/util";
import styled from "styled-components";
import { ReactNode } from "react";

export interface DropDownSelectProps extends  UtilsProps{
  children?: ReactNode;
};

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
