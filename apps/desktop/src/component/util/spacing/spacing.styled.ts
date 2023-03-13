import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export interface MarginProps {
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
  mr?:
    | "mr0"
    | "mrOne"
    | "mrTwo"
    | "mrThree"
    | "mrFour"
    | "mrFive"
    | "mrSix"
    | "mrSeven"
    | "mrEight"
    | "mrAuto";
  ml?:
    | "ml0"
    | "mlOne"
    | "mlTwo"
    | "mlThree"
    | "mlFour"
    | "mlFive"
    | "mlSix"
    | "mlSeven"
    | "mlEight"
    | "mlAuto";
  mt?:
    | "mt0"
    | "mtOne"
    | "mtTwo"
    | "mtThree"
    | "mtFour"
    | "mtFive"
    | "mtSix"
    | "mtSeven"
    | "mtEight";
};

export interface PaddingProps {
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

export const margin = css<MarginProps>`
  margin-bottom: ${(props) =>
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
  margin-top: ${(props) =>
    props.mt === "mtOne"
      ? theme.spacing.one.spacing
      : props.mt === "mtTwo"
      ? theme.spacing.two.spacing
      : props.mt === "mtThree"
      ? theme.spacing.three.spacing
      : props.mt === "mtFour"
      ? theme.spacing.four.spacing
      : props.mt === "mtFive"
      ? theme.spacing.five.spacing
      : props.mt === "mtSix"
      ? theme.spacing.six.spacing
      : props.mt === "mt0"
      ? "0px"
      : props.mt === "mtSeven"
      ? theme.spacing.seven.spacing
      : props.mt === "mtEight"
      ? theme.spacing.eight.spacing
      : ""};
  margin-left: ${(props) =>
    props.ml === "mlOne"
      ? theme.spacing.one.spacing
      : props.ml === "mlTwo"
      ? theme.spacing.two.spacing
      : props.ml === "mlThree"
      ? theme.spacing.three.spacing
      : props.ml === "mlFour"
      ? theme.spacing.four.spacing
      : props.ml === "mlFive"
      ? theme.spacing.five.spacing
      : props.ml === "mlSix"
      ? theme.spacing.six.spacing
      : props.ml === "ml0"
      ? "0px"
      : props.ml === "mlSeven"
      ? theme.spacing.seven.spacing
      : props.ml === "mlEight"
      ? theme.spacing.eight.spacing
      : props.ml === "mlAuto"
      ? "auto"
      : ""};
  margin-right: ${(props) =>
    props.mr === "mrOne"
      ? theme.spacing.one.spacing
      : props.mr === "mrTwo"
      ? theme.spacing.two.spacing
      : props.mr === "mrThree"
      ? theme.spacing.three.spacing
      : props.mr === "mrFour"
      ? theme.spacing.four.spacing
      : props.mr === "mrFive"
      ? theme.spacing.five.spacing
      : props.mr === "mrSix"
      ? theme.spacing.six.spacing
      : props.mr === "mr0"
      ? "0px"
      : props.mr === "mrSeven"
      ? theme.spacing.seven.spacing
      : props.mr === "mrEight"
      ? theme.spacing.eight.spacing
      : props.mr === "mrAuto"
      ? "auto"
      : ""};
`;

export const padding = css<PaddingProps>`
  padding-bottom: ${(props) =>
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

  padding-top: ${(props) =>
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

  padding-left: ${(props) =>
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

  padding-right: ${(props) =>
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
