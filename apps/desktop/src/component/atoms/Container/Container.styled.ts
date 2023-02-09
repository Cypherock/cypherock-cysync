import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { utils, UtilsProps } from "../../util";
import { theme } from "@/theme/theme.styled";

export type ContainerProps = {
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
} & UtilsProps;

export const ContainerStyle = styled.div`
  ${utils}

  height: 100vh;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DefaultContainerStyle = styled.div`
  ${(props: ContainerProps) => {
    return (
      props.shadow &&
      css`
        box-shadow: 4px 4px 32px 4px #0f0d0b;
      `
    );
  }}
  ${(props: ContainerProps) => {
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

  border-top-left-radius: ${(props: ContainerProps) =>
    props.roundedListTop ? "24px" : ""};
  border-top-right-radius: ${(props: ContainerProps) =>
    props.roundedListTop ? "24px" : ""};

  border-bottom-left-radius: ${(props: ContainerProps) =>
    props.roundedListBottom ? "24px" : ""};
  border-bottom-right-radius: ${(props: ContainerProps) =>
    props.roundedListBottom ? "24px" : ""};

  ${utils}
`;

export const AsideContainerStyle = styled.div`
  width: 300px;
  min-height: 100vh;

  ${(props: ContainerProps) => {
    return (
      props.border &&
      css`
        border-width: 1px;
        border-style: solid;
        border-color: ${theme.palette.background.sepratorBackground};
      `
    );
  }}
  ${(props: ContainerProps) => {
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
