import { ReactNode } from "react";
import { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export type FlexProps = {
  children?: ReactNode;
  wrapReverse?: Boolean;
  noWrap?: Boolean;
  justifyContent?: Boolean;
  justifyCenter?: Boolean;
  justifyAround?: Boolean;
  justifyBetween?: Boolean;
  justifyEnd?: Boolean;
  alignItems?: Boolean;
  alignStretch?: Boolean;
  alignEnd?: Boolean;
  alignCenter?: Boolean;
  alignBaseline?: Boolean;
  alignContent?: Boolean;
  content?: Boolean;
  contentStart?: Boolean;
  contentEnd?: Boolean;
  contentCenter?: Boolean;
  contentBetween?: Boolean;
  contentAround?: Boolean;
  column?: Boolean;
  gapOne?: Boolean;
  gapTwo?: Boolean;
  gap0?: Boolean;
};

export const flex = css`
  display: flex;
  flex-wrap: ${(props: FlexProps) => {
    props.wrapReverse ? "wrap-reverse" : props.noWrap ? "nowrap" : "wrap";
  }};
  justify-content: ${(props: FlexProps) => {
    if (props.justifyContent) return props.justifyContent;
    if (props.justifyCenter) return "center";
    else if (props.justifyAround) return "space-around";
    else if (props.justifyBetween) return "space-between";
    else if (props.justifyEnd) return "flex-end";
    return "flex-start";
  }};
  align-items: ${(props: FlexProps) => {
    if (props.alignItems) return props.alignItems;
    else if (props.alignStretch) return "stretch";
    else if (props.alignEnd) return "flex-end";
    if (props.alignCenter) return "center";
    else if (props.alignBaseline) return "baseline";
    return "flex-start";
  }};
  align-content: ${(props: FlexProps) => {
    if (props.alignContent) return props.content;
    else if (props.contentStart) return "flex-start";
    else if (props.contentEnd) return "flex-end";
    else if (props.contentCenter) return "center";
    else if (props.contentBetween) return "space-between";
    else if (props.contentAround) return "contentAround";
    return "stretch";
  }};
  flex-direction: ${(props: FlexProps) => (props.column ? "column" : "row")};
  gap: 2px;
  gap: ${(props: FlexProps) =>
    props.gapOne
      ? theme.spacing.one.spacing
      : props.gapTwo
      ? theme.spacing.two.spacing
      : props.gap0
      ? "0px"
      : ""};
`;
