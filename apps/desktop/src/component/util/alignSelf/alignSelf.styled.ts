import { css } from "styled-components";

export interface AlignSelfProps {
  alignSelf?: "auto" | "stretch" | "center" | "start" | "end" | "baseline" | "initial" | "inherit";
};

export const alignSelf = css<AlignSelfProps>`
  align-self: ${(props) =>
    props.alignSelf === "start"
      ? "flex-start"
      : props.alignSelf === "end"
      ? "flex-end"
      : props.alignSelf};
`;
