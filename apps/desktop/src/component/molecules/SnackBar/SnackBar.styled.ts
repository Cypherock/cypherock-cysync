import { utils, UtilsProps } from "@/component/util";
import styled, { css } from "styled-components";
import { ReactNode } from "react";

export interface SnackBarProps extends UtilsProps {
  children?: ReactNode;
  variant?: "banner" | "update";
};

export const SnackBarStyle = styled.div<SnackBarProps>`
  width: 100%;
  border-radius: 12px;
  box-shadow: 4px 4px 32px 4px #0f0d0b;

  ${(props) => {
    return (
      props.variant === "update" &&
      css`
        border: 1px solid #4d3906;
        background-color: #2e220d;
      `
    );
  }}

  ${(props) => {
    return (
      props.variant === "banner" &&
      css`
        background-image: linear-gradient(
          102.78deg,
          #441b42 0%,
          #232e40 59.38%,
          #102032 100%
        );
      `
    );
  }}
  ${utils};
`;

export const SnackBarItemStyle = styled.div`
  ${utils};
`;

export const SnackBarBtnStyle = styled.button<SnackBarProps>`
  ${utils};

  ${(props) => {
    return (
      props.variant === "update" &&
      css`
        background: ${({ theme }) => theme.palette.primary.primary};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        font-size: 16px;
        border: none;
        font-weight: 500;
      `
    );
  }}
`;
