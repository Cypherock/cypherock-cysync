import { css } from "styled-components";

export type PositionProps = {
  position?: "absolute" | "relative" | "fixed" | "sticky";
};

export const position = css`
  top: 0;
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
`;
