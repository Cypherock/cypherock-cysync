import styled, { css } from "styled-components";
import {
  margin,
  MarginProps,
  borderRadius,
  BorderRadiusProps,
} from "../../util";

export type DividerProps = {
  vertical?: Boolean;
  verticalWhite?: Boolean;
} & MarginProps &
  BorderRadiusProps;

const vertical = css`
  ${(props: DividerProps) => {
    return (
      props.verticalWhite &&
      css`
        width: 1px;
        height: 24px;
        background-color: ${({ theme }) => theme.palette.text.textHeading};
      `
    );
  }}

  ${(props: DividerProps) => {
    return (
      props.vertical &&
      css`
        width: 1px;
        height: 24px;
        background-color: ${({ theme }) => theme.palette.border.main};
      `
    );
  }}
`;

export const DividerStyle = styled.div<DividerProps>`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.palette.border.main};

  ${margin}
  ${vertical}
  ${borderRadius}
`;
