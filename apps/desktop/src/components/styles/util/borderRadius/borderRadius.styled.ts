import { css } from "styled-components";
import { theme } from "../../../../Theme/theme.styled";

export type BorderRadiusProps = {
  roundedOne?: Boolean;
  roundedTwo?: Boolean;
  roundedFull?: Boolean;
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
