import { css } from "styled-components";

export type PositionProps = {
  position?: "absolute" | "relative" | "fixed" | "sticky";
  top?: "top0" | "topOne" | "topTwo" | "topThree";
  right?: "right0" | "rightOne" | "rightTwo" | "rightThree";
  left?: "left0" | "leftOne" | "leftTwo" | "leftThree" | "backBottom";
  bottom?: "bottom0" | "bottomOne" | "bottomTwo" | "bottomThree";
};

export const position = css`
  position: ${(props: PositionProps) =>
    props.position === "absolute"
      ? "absolute"
      : props.position === "relative"
      ? "relative"
      : props.position === "fixed"
      ? "fixed"
      : props.position === "sticky"
      ? "sticky"
      : ""};

  top: ${(props: PositionProps) =>
    props.top === "top0"
      ? "0px"
      : props.top === "topOne"
      ? "8px"
      : props.top === "topTwo"
      ? "16px"
      : props.top === "topThree"
      ? "24px"
      : ""};
  right: ${(props: PositionProps) =>
    props.right === "right0"
      ? "0px"
      : props.right === "rightOne"
      ? "8px"
      : props.right === "rightTwo"
      ? "16px"
      : props.right === "rightThree"
      ? "24px"
      : ""};

  left: ${(props: PositionProps) =>
    props.left === "left0"
      ? "0px"
      : props.left === "leftOne"
      ? "8px"
      : props.left === "leftTwo"
      ? "16px"
      : props.left === "leftThree"
      ? "24px"
      : props.left === "backBottom"
      ? "415px"
      : ""};

  bottom: ${(props: PositionProps) =>
    props.bottom === "bottom0"
      ? "0px"
      : props.bottom === "bottomOne"
      ? "8px"
      : props.bottom === "bottomTwo"
      ? "16px"
      : props.bottom === "bottomThree"
      ? "24px"
      : ""};
`;
