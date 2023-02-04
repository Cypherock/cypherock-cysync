import styled, { css } from "styled-components";
import { utils, UtilsProps } from "../../util";

export type DividerProps = {
  variant?: "vertical" | "horizontal";
} & UtilsProps;

export const DividerHorizontalStyle = styled.div<DividerProps>`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border.main};
  ${utils}
`;
export const DividerVerticalStyle = styled.div<DividerProps>`
  width: 1px;
  height: 24px;
  background-color: ${({ theme }) => theme.palette.border.main};
  ${utils}
`;
