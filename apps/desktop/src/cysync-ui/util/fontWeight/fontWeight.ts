import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export type FontWeightProps = {
  fontThin?: Boolean;
  fontExtralight?: Boolean;
  fontLight?: Boolean;
  fontNormal?: Boolean;
  fontMedium?: Boolean;
  fontSemiBold?: Boolean;
  fontBold?: Boolean;
  fontExtraBold?: Boolean;
  mbEight?: Boolean;
};

export const fontWeight = css`
  font-weight: ${(props: FontWeightProps) =>
    props.fontThin
      ? "100"
      : props.fontExtralight
      ? "200"
      : props.fontLight
      ? "300"
      : props.fontNormal
      ? "400"
      : props.fontMedium
      ? "500"
      : props.fontSemiBold
      ? "600"
      : props.fontBold
      ? "700"
      : props.fontExtraBold
      ? "800"
      : ""};
`;
