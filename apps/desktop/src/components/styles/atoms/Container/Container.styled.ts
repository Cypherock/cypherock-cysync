import { ReactNode } from "react";
import styled, { css } from "styled-components";
import {
  margin,
  MarginProps,
  borderRadius,
  BorderRadiusProps,
  bgColor,
  BgColorProps,
} from "../../util/";
import { theme } from "../../../../Theme/theme.styled.js";

export type ContainerProps = {
  children?: ReactNode;
  bg?: "SplashLoader" | Boolean;
  borderRadiusOne?: Boolean;
  border?: Boolean;
  pThree?: Boolean;
} & MarginProps &
  BorderRadiusProps &
  BgColorProps;

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
  ${margin}
  ${borderRadius}
  ${bgColor}



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
  }}
`;
