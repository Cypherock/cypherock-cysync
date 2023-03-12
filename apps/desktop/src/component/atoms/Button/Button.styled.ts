import { alignSelf, width, WidthProps, AlignSelfProps } from "../../util";
import { ReactNode } from "react";
import styled, { css } from "styled-components";

export interface ButtonProps extends WidthProps, AlignSelfProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
  variation?: "primary" | "secondary" | "dashedBorder" | "warning";
  children?: ReactNode;
};

const buttonBaseStyle = css<ButtonProps>`
  ${(props) => {
    return props.variation === "secondary"
      ? css`
          border: 0.6px solid #49433e;
          background-color: ${({ theme }) =>
            theme.palette.background.sepratorBackground};
          color: ${({ theme }) => theme.palette.text.textMuted};
        `
      : props.variation === "primary"
      ? css`
          background-image: ${({ theme }) => theme.palette.primary.primary};
          border: none;
          font-size: 14px;
          font-weight: 500;
        `
      : props.variation === "dashedBorder"
      ? css`
          border: 1px dashed #49433e;
          background: transparent;
        `
      : props.variation === "warning"
      ? css`
        background: #FF624C;
        border: 0.6px solid #FF3518;
        border-radius: 6px;
        color: #FFFFFF;
        font-weight: 500;
      `: "";
  }}
`;

export const ButtonStyle = styled.button<ButtonProps>`
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 21px;
  border-radius: 6px;
  display: inline-block;
  padding-top: ${({ theme }) => theme.spacing.one.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  ${buttonBaseStyle}
  ${width}
  ${alignSelf}
`;
