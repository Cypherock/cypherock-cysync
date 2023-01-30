import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export type BorderRadiusProps = {
  roundedOne?: Boolean;
  roundedTwo?: Boolean;
  roundedFull?: Boolean;
};
export type WidthProps = {
  wFull?: Boolean;
  w25?: Boolean;
  w35?: Boolean;
  w15?: Boolean;
};
export const borderRadius = css`
  border-radius: ${(props: BorderRadiusProps) =>
    props.roundedOne
      ? theme.spacing.one.spacing
      : props.roundedTwo
      ? theme.spacing.two.spacing
      : props.roundedFull
      ? "9999px"
      : ""};
`;

export const width = css`
  width: ${(props: WidthProps) =>
    props.wFull
      ? "100%"
      : props.w25
      ? "25%"
      : props.w35
      ? "35%"
      : props.w15
      ? "15%"
      : ""};
`;
