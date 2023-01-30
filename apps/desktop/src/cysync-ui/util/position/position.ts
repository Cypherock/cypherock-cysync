import { css } from "styled-components";

export type PositionProps = {
  absolute?: Boolean;
  relative?: Boolean;
  fixed?: Boolean;
  sticky?: Boolean;
};

export const position = css`
  top: 0;
  position: ${(props: PositionProps) =>
    props.absolute
      ? "absolute"
      : props.relative
      ? "relative"
      : props.fixed
      ? "fixed"
      : props.sticky
      ? "sticky"
      : ""};
`;
