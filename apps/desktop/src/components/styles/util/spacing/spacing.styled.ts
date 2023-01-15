import { css } from "styled-components";
import { theme } from "../../../../Theme/theme.styled";

export type MarginProps = {
  mbOne?: Boolean;
  mbTwo?: Boolean;
  mbThree?: Boolean;
  mbFour?: Boolean;
  mbFive?: Boolean;
  mbSix?: Boolean;
  mb0?: Boolean;
  mbSeven?: Boolean;
  mbEight?: Boolean;
};

export const margin = css`
  margin-bottom: ${(props: MarginProps) =>
    props.mbOne
      ? theme.spacing.one.spacing
      : props.mbTwo
      ? theme.spacing.two.spacing
      : props.mbThree
      ? theme.spacing.three.spacing
      : props.mbFour
      ? theme.spacing.four.spacing
      : props.mbFive
      ? theme.spacing.five.spacing
      : props.mbSix
      ? theme.spacing.six.spacing
      : props.mb0
      ? "0px"
      : props.mbSeven
      ? theme.spacing.seven.spacing
      : props.mbEight
      ? theme.spacing.eight.spacing
      : ""};
`;
