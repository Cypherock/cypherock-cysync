import { ReactNode } from "react";
import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export interface FlexProps {
  children?: ReactNode;
  wrapReverse?: Boolean;
  noWrap?: Boolean;
  justify?: "start" | "center" | "around" | "between" | "end" | "evenly";
  align?: "start" | "center" | "baseline" | "end" | "stretch";
  content?: "start" | "end" | "center" | "between" | "around";
  direction?: "row" | "column";
  gap?: "gapTwo" | "gapOne" | "gap0";
};

const justifyContent = css<FlexProps>`
  ${(props) => {
    return props.justify === "center"
      ? css`
          justify-content: center;
        `
      : props.justify === "around"
      ? css`
          justify-content: space-around;
        `
      : props.justify === "between"
      ? css`
          justify-content: space-between;
        `
      : props.justify === "end"
      ? css`
          justify-content: flex-end;
        `
      : props.justify === "start"
      ? css`
          justify-content: flex-start;
      ` 
      : props.justify === "evenly"
      ? css`
          justify-content: flex-end;
      `:"";
  }}
`;

const align = css<FlexProps>`
  ${(props) => {
    return props.align === "start"
      ? css`
          align-items: flex-start;
        `
      : props.align === "end"
      ? css`
          align-items: flex-end;
        `
      : props.align === "center"
      ? css`
          align-items: center;
        `
      : props.align === "baseline"
      ? css`
          align-items: baseline;
        `
      : props.align === "stretch" 
      ? css`
          align-items: stretch;
      ` : "";
  }}
`;

const direction = css<FlexProps>`
  ${(props) => {
    return props.direction === "column"
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `;
  }}
`;

const gap = css<FlexProps>`
  ${(props) => {
    return props.gap === "gap0"
      ? css`
          gap: 0px;
        `
      : props.gap === "gapOne"
      ? css`
          gap: 8px;
        `
      : props.gap === "gapTwo"
      ? css`
          gap: 16px;
        `
      : "";
  }}
`;

const content = css<FlexProps>`
  ${(props) => {
    return props.content === "center"
      ? css`
          align-content: center;
        `
      : props.content === "around"
      ? css`
          align-content: space-around;
        `
      : props.content === "between"
      ? css`
          align-content: space-between;
        `
      : props.content === "end"
      ? css`
          align-content: flex-end;
        `
      : props.content === "start"
      ? css`
          align-content: start;
        `
      : "";
  }}
`;

export const flex = css<FlexProps>`
  display: flex;

  ${justifyContent}
  ${align}
  ${content}
  ${direction}
  ${gap}
`;
