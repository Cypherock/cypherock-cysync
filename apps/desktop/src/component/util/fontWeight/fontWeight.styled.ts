import { css } from "styled-components";

export interface FontWeightProps {
  font?:
    | "fontThin"
    | "fontExtralight"
    | "fontLight"
    | "fontNormal"
    | "fontMedium"
    | "fontSemiBold"
    | "fontBold"
    | "fontExtraBold";
};

export const fontWeight = css<FontWeightProps>`
  font-weight: ${(props) =>
    props.font === "fontThin"
      ? "100"
      : props.font === "fontExtralight"
      ? "200"
      : props.font === "fontLight"
      ? "300"
      : props.font === "fontNormal"
      ? "400"
      : props.font === "fontMedium"
      ? "500"
      : props.font === "fontSemiBold"
      ? "600"
      : props.font === "fontBold"
      ? "700"
      : props.font === "fontExtraBold"
      ? "800"
      : ""};
`;
