import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { UtilsProps, utils } from "../../util";

export interface FlexProps extends UtilsProps {
  justify?: "center" | "around" | "between" | "end";
  align?: "center" | "around" | "baseline" | "end" | "stretch";
  content?:
    | "contentStart"
    | "contentEnd"
    | "contentCenter"
    | "contentBetween"
    | "contentAround";
  direction?: "row" | "column";
  gap?: "gapTwo" | "gapOne" | "gap0";
  children?: ReactNode;
  wrapReverse?: Boolean;
  noWrap?: Boolean;
};

const justifyContent = css`
  ${(props: FlexProps) => {
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
      : "";
  }}
`;

const align = css`
  ${(props: FlexProps) => {
    return props.content === "contentStart"
      ? css`
          align-items: flex-start;
        `
      : props.content === "contentEnd"
      ? css`
          align-items: flex-end;
        `
      : props.content === "contentCenter"
      ? css`
          align-items: center;
        `
      : props.content === "contentBetween"
      ? css`
          align-items: space-between;
        `
      : css`
          align-items: stretch;
        `;
  }}
`;

const direction = css`
  ${(props: FlexProps) => {
    return props.direction === "column"
      ? css`
          flex-direction: column;
        `
      : css`
          flex-direction: row;
        `;
  }}
`;
const gap = css`
  ${(props: FlexProps) => {
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
const content = css`
  ${(props: FlexProps) => {
    return props.justify === "center"
      ? css`
          align-content: center;
        `
      : props.justify === "around"
      ? css`
          align-content: space-around;
        `
      : props.justify === "between"
      ? css`
          align-content: space-between;
        `
      : props.justify === "end"
      ? css`
          align-content: flex-end;
        `
      : "";
  }}
`;
export const FlexStyle = styled.div<FlexProps>`
  display: flex;

  ${justifyContent}
  ${align}
  ${content}
  ${direction}
  ${gap}
  ${utils}
`;
