import { ReactNode } from "react";
import styled, { css } from "styled-components";
import {
  margin,
  MarginProps,
  borderRadius,
  BorderRadiusProps,
  bgColor,
  BgColorProps,
  flex,
  FlexProps,
  padding,
  PaddingProps,
  width,
  WidthProps,
  position,
  PositionProps,
} from "../../util/";
import { theme } from "@/theme/theme.styled";

export type ContainerProps = {
  children?: ReactNode;
  bg?: "SplashLoader" | Boolean;
  borderRadiusOne?: Boolean;
  border?: Boolean;
  pThree?: Boolean;
  p0?: Boolean;
  scroll?: Boolean;
  roundedListTop?: Boolean;
  roundedListBottom?: Boolean;
  shadow?: Boolean;
} & MarginProps &
  BorderRadiusProps &
  BgColorProps &
  FlexProps &
  PaddingProps &
  WidthProps &
  PositionProps;

export const ContainerStyle = styled.div`
  ${margin}
  ${borderRadius}
  ${bgColor}
  
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

  ${(props: ContainerProps) => {
    return (
      props.pThree &&
      css`
        padding: 24px;
      `
    );
  }};
  border-top-left-radius: ${(props: ContainerProps) =>
    props.roundedListTop ? "24px" : ""};
  border-top-right-radius: ${(props: ContainerProps) =>
    props.roundedListTop ? "24px" : ""};

  border-bottom-left-radius: ${(props: ContainerProps) =>
    props.roundedListBottom ? "24px" : ""};
  border-bottom-right-radius: ${(props: ContainerProps) =>
    props.roundedListBottom ? "24px" : ""};

  ${(props: ContainerProps) => {
    return (
      props.p0 &&
      css`
        padding: 0;
      `
    );
  }};

  ${margin}
  ${borderRadius}
  ${bgColor}
  ${flex}
  ${padding}
  ${width}
  ${position}
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
  padding:48px 42px;

  ${(props: ContainerProps) => {
    return (
      props.pThree &&
      css`
        padding: 24px;
      `
    );
  }}

  ${margin}
  ${borderRadius}
  ${bgColor}
  ${flex}
  ${padding}
  ${position}
`;

export const MainContainerStyle = styled(DefaultContainerStyle)`
  height: 89vh;
  overflow-y: scroll;
`;
