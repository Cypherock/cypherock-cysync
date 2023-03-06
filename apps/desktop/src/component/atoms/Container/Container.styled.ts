import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { utils, UtilsProps } from "../../util";
import { theme } from "@/theme/theme.styled";

export interface ContainerProps extends UtilsProps {
  variant?:
    | "defaultContainer"
    | "container"
    | "asideContainer"
    | "mainContainer";
  children?: ReactNode;
  borderRadiusOne?: Boolean;
  border?: Boolean;
  scroll?: Boolean;
  roundedListTop?: Boolean;
  roundedListBottom?: Boolean;
  shadow?: Boolean;
  size?: "lg";
}

export const ContainerStyle = styled.div`
  ${utils}

  height: 100vh;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DefaultContainerStyle = styled.div<ContainerProps>`
  ${(props) => {
    return (
      props.shadow &&
      css`
        box-shadow: 4px 4px 32px 4px #0f0d0b;
      `
    );
  }}
  ${(props) => {
    return (
      props.border &&
      css`
        border-width: 1px;
        border-style: solid;
        border-color: ${theme.palette.background.sepratorBackground};
      `
    );
  }}
  padding: 16px 24px;

  border-top-left-radius: ${(props) =>
    props.roundedListTop ? "24px" : ""};
  border-top-right-radius: ${(props) =>
    props.roundedListTop ? "24px" : ""};

  border-bottom-left-radius: ${(props) =>
    props.roundedListBottom ? "24px" : ""};
  border-bottom-right-radius: ${(props) =>
    props.roundedListBottom ? "24px" : ""};

  ${utils}
`;

export const AsideContainerStyle = styled.div<ContainerProps>`
  width: 300px;
  min-height: 100vh;

  ${(props) => {
    return (
      props.border &&
      css`
        border-width: 1px;
        border-style: solid;
        border-color: ${theme.palette.background.sepratorBackground};
      `
    );
  }}
  ${(props) => {
    return props.size === "lg"
      ? css`
          width: 500px;
        `
      : "";
  }}
  padding:48px 42px;

  ${utils}
`;

export const MainContainerStyle = styled(DefaultContainerStyle)`
  height: 89vh;
  overflow-y: scroll;
`;
