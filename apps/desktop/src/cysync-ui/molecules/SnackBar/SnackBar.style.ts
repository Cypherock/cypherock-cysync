import {
  flex,
  FlexProps,
  fontWeight,
  margin,
  MarginProps,
  padding,
  PaddingProps,
  width,
  FontWeightProps,
} from "@/cysync-ui/util";
import styled, { css } from "styled-components";
import { HeadingSixStyle } from "@/cysync-ui/atoms/Headings/Heading.styled";
import { ReactNode } from "react";

export type SnackBarProps = {
  children?: ReactNode;
  banner?: Boolean;
  update?: Boolean;
} & MarginProps &
  FlexProps &
  PaddingProps &
  FontWeightProps;

export const SnackBarStyle = styled.div`
  width: 100%;
  border-radius: 12px;
  box-shadow: 4px 4px 32px 4px #0f0d0b;

  ${(props: SnackBarProps) => {
    return (
      props.update &&
      css`
        border: 1px solid #4d3906;
        background-color: #2e220d;
      `
    );
  }}

  ${(props: SnackBarProps) => {
    return (
      props.banner &&
      css`
        background-image: linear-gradient(
          102.78deg,
          #441b42 0%,
          #232e40 59.38%,
          #102032 100%
        );
        /* border-radius: 16px; */
      `
    );
  }}
  ${flex};
  ${margin};
  ${padding};
`;

export const SnackBarItemStyle = styled.div`
  ${flex};
  ${margin};
  ${padding};
  ${width}
`;

export const SnackBarBtnStyle = styled.button`
  ${(props: SnackBarProps) => {
    return (
      props.update &&
      css`
        background: ${({ theme }) => theme.palette.primary.primary};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        font-size: 16px;
        border: none;
        font-weight: 500;
        /* border-bottom: 1px; */
      `
    );
  }}
`;
