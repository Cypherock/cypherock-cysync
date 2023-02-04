import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export type BorderRadiusProps = {
  rounded?: "roundedOne" | "roundedTwo" | "roundedFull";
};
export type WidthProps = {
  width?: "wFull" | "w25" | "w35" | "w15";
};
export const borderRadius = css`
  border-radius: ${(props: BorderRadiusProps) =>
    props.rounded === "roundedOne"
      ? theme.spacing.one.spacing
      : props.rounded === "roundedTwo"
      ? theme.spacing.two.spacing
      : props.rounded === "roundedFull"
      ? "9999px"
      : ""};
`;

export const width = css`
  width: ${(props: WidthProps) =>
    props.width === "wFull"
      ? "100%"
      : props.width === "w25"
      ? "25%"
      : props.width === "w35"
      ? "35%"
      : props.width === "w15"
      ? "15%"
      : ""};
`;
