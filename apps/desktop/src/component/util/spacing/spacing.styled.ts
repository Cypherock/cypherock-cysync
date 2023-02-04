import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export type MarginProps = {
  mb?:
    | "mb0"
    | "mbOne"
    | "mbTwo"
    | "mbThree"
    | "mbFour"
    | "mbFive"
    | "mbSix"
    | "mbSeven"
    | "mbEight";
};

export type PaddingProps = {
  pb?:
    | "pb0"
    | "pbOne"
    | "pbTwo"
    | "pbThree"
    | "pbFour"
    | "pbFive"
    | "pbSix"
    | "pbSeven"
    | "pbEight";

  pt?:
    | "pt0"
    | "ptOne"
    | "ptTwo"
    | "ptThree"
    | "ptFour"
    | "ptFive"
    | "ptSix"
    | "ptSeven"
    | "ptEight";

  pl?:
    | "pl0"
    | "plOne"
    | "plTwo"
    | "plThree"
    | "plFour"
    | "plFive"
    | "plSix"
    | "plSeven"
    | "plEight";

  pr?:
    | "pr0"
    | "prOne"
    | "prTwo"
    | "prThree"
    | "prFour"
    | "prFive"
    | "prSix"
    | "prSeven"
    | "prEight";
};

export const margin = css`
  margin-bottom: ${(props: MarginProps) =>
    props.mb === "mbOne"
      ? theme.spacing.one.spacing
      : props.mb === "mbTwo"
      ? theme.spacing.two.spacing
      : props.mb === "mbThree"
      ? theme.spacing.three.spacing
      : props.mb === "mbFour"
      ? theme.spacing.four.spacing
      : props.mb === "mbFive"
      ? theme.spacing.five.spacing
      : props.mb === "mbSix"
      ? theme.spacing.six.spacing
      : props.mb === "mb0"
      ? "0px"
      : props.mb === "mbSeven"
      ? theme.spacing.seven.spacing
      : props.mb === "mbEight"
      ? theme.spacing.eight.spacing
      : ""};
`;

export const padding = css`
  padding-bottom: ${(props: PaddingProps) =>
    props.pb === "pbOne"
      ? theme.spacing.one.spacing
      : props.pb === "pbTwo"
      ? theme.spacing.two.spacing
      : props.pb === "pbThree"
      ? theme.spacing.three.spacing
      : props.pb === "pbFour"
      ? theme.spacing.four.spacing
      : props.pb === "pbFive"
      ? theme.spacing.five.spacing
      : props.pb === "pbSix"
      ? theme.spacing.six.spacing
      : props.pb === "pb0"
      ? "0px"
      : props.pb === "pbSeven"
      ? theme.spacing.seven.spacing
      : props.pb === "pbEight"
      ? theme.spacing.eight.spacing
      : ""};

  padding-top: ${(props: PaddingProps) =>
    props.pt === "ptOne"
      ? theme.spacing.one.spacing
      : props.pt === "ptTwo"
      ? theme.spacing.two.spacing
      : props.pt === "ptThree"
      ? theme.spacing.three.spacing
      : props.pt === "ptFour"
      ? theme.spacing.four.spacing
      : props.pt === "ptFive"
      ? theme.spacing.five.spacing
      : props.pt === "ptSix"
      ? theme.spacing.six.spacing
      : props.pt === "pt0"
      ? "0px"
      : props.pt === "ptSeven"
      ? theme.spacing.seven.spacing
      : props.pt === "ptEight"
      ? theme.spacing.eight.spacing
      : ""};

  padding-left: ${(props: PaddingProps) =>
    props.pl === "plOne"
      ? theme.spacing.one.spacing
      : props.pl === "plTwo"
      ? theme.spacing.two.spacing
      : props.pl === "plThree"
      ? theme.spacing.three.spacing
      : props.pl === "plFour"
      ? theme.spacing.four.spacing
      : props.pl === "plFive"
      ? theme.spacing.five.spacing
      : props.pl === "plSix"
      ? theme.spacing.six.spacing
      : props.pl === "pl0"
      ? "0px"
      : props.pl === "plSeven"
      ? theme.spacing.seven.spacing
      : props.pl === "plEight"
      ? theme.spacing.eight.spacing
      : ""};

  padding-right: ${(props: PaddingProps) =>
    props.pr === "prOne"
      ? theme.spacing.one.spacing
      : props.pr === "prTwo"
      ? theme.spacing.two.spacing
      : props.pr === "prThree"
      ? theme.spacing.three.spacing
      : props.pr === "prFour"
      ? theme.spacing.four.spacing
      : props.pr === "prFive"
      ? theme.spacing.five.spacing
      : props.pr === "prSix"
      ? theme.spacing.six.spacing
      : props.pr === "pr0"
      ? "0px"
      : props.pr === "prSeven"
      ? theme.spacing.seven.spacing
      : props.pr === "prEight"
      ? theme.spacing.eight.spacing
      : ""};
`;
