import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

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

export type PaddingProps = {
  pbOne?: Boolean;
  pbTwo?: Boolean;
  pbThree?: Boolean;
  pbFour?: Boolean;
  pbFive?: Boolean;
  pbSix?: Boolean;
  pb0?: Boolean;
  pbSeven?: Boolean;
  pbEight?: Boolean;

  ptOne?: Boolean;
  ptTwo?: Boolean;
  ptThree?: Boolean;
  ptFour?: Boolean;
  ptFive?: Boolean;
  ptSix?: Boolean;
  pt0?: Boolean;
  ptSeven?: Boolean;
  ptEight?: Boolean;

  plOne?: Boolean;
  plTwo?: Boolean;
  plThree?: Boolean;
  plFour?: Boolean;
  plFive?: Boolean;
  plSix?: Boolean;
  pl0?: Boolean;
  plSeven?: Boolean;
  plEight?: Boolean;

  prOne?: Boolean;
  prTwo?: Boolean;
  prThree?: Boolean;
  prFour?: Boolean;
  prFive?: Boolean;
  prSix?: Boolean;
  pr0?: Boolean;
  prSeven?: Boolean;
  prEight?: Boolean;
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

export const padding = css`
  padding-bottom: ${(props: PaddingProps) =>
    props.pbOne
      ? theme.spacing.one.spacing
      : props.pbTwo
      ? theme.spacing.two.spacing
      : props.pbThree
      ? theme.spacing.three.spacing
      : props.pbFour
      ? theme.spacing.four.spacing
      : props.pbFive
      ? theme.spacing.five.spacing
      : props.pbSix
      ? theme.spacing.six.spacing
      : props.pb0
      ? "0px"
      : props.pbSeven
      ? theme.spacing.seven.spacing
      : props.pbEight
      ? theme.spacing.eight.spacing
      : ""};

  padding-top: ${(props: PaddingProps) =>
    props.ptOne
      ? theme.spacing.one.spacing
      : props.ptTwo
      ? theme.spacing.two.spacing
      : props.ptThree
      ? theme.spacing.three.spacing
      : props.ptFour
      ? theme.spacing.four.spacing
      : props.ptFive
      ? theme.spacing.five.spacing
      : props.ptSix
      ? theme.spacing.six.spacing
      : props.pt0
      ? "0px"
      : props.ptSeven
      ? theme.spacing.seven.spacing
      : props.ptEight
      ? theme.spacing.eight.spacing
      : ""};

  padding-left: ${(props: PaddingProps) =>
    props.plOne
      ? theme.spacing.one.spacing
      : props.plTwo
      ? theme.spacing.two.spacing
      : props.plThree
      ? theme.spacing.three.spacing
      : props.plFour
      ? theme.spacing.four.spacing
      : props.plFive
      ? theme.spacing.five.spacing
      : props.plSix
      ? theme.spacing.six.spacing
      : props.pl0
      ? "0px"
      : props.plSeven
      ? theme.spacing.seven.spacing
      : props.plEight
      ? theme.spacing.eight.spacing
      : ""};

  padding-right: ${(props: PaddingProps) =>
    props.prOne
      ? theme.spacing.one.spacing
      : props.prTwo
      ? theme.spacing.two.spacing
      : props.prThree
      ? theme.spacing.three.spacing
      : props.prFour
      ? theme.spacing.four.spacing
      : props.prFive
      ? theme.spacing.five.spacing
      : props.prSix
      ? theme.spacing.six.spacing
      : props.pr0
      ? "0px"
      : props.prSeven
      ? theme.spacing.seven.spacing
      : props.prEight
      ? theme.spacing.eight.spacing
      : ""};
`;
