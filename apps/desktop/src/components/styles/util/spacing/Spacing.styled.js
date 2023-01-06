import { css } from "styled-components";
import styled from "styled-components";

export const margin = css`
  margin-bottom: ${(props) =>
    props.mbOne
      ? props.theme.spacing.one.spacing
      : props.mbTwo
      ? props.theme.spacing.two.spacing
      : props.mbThree
      ? props.theme.spacing.three.spacing
      : props.mbFour
      ? props.theme.spacing.four.spacing
      : props.mbFive
      ? props.theme.spacing.five.spacing
      : props.mbSix
      ? props.theme.spacing.six.spacing
      : props.mb0
      ? "0px"
      : props.mbSeven
      ? props.theme.spacing.seven.spacing
      : props.mbEight
      ? props.theme.spacing.eight.spacing
      : ""};
`;

export const padding = css`
  padding-bottom: ${(props) =>
    props.pbOne
      ? props.theme.spacing.one.spacing
      : props.pbTwo
      ? props.theme.spacing.two.spacing
      : props.pbThree
      ? props.theme.spacing.three.spacing
      : props.pbFour
      ? props.theme.spacing.four.spacing
      : props.pbFive
      ? props.theme.spacing.five.spacing
      : props.pbSix
      ? props.theme.spacing.six.spacing
      : props.pb0
      ? "0px"
      : ""};
`;
