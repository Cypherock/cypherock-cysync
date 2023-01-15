import styled from "styled-components";
import { margin, MarginProps } from "../../util";

export type DividerProps = {} & MarginProps;

export const DividerStyle = styled.div<DividerProps>`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border.main};
  ${margin}
`;
