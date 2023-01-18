import { ReactNode } from "react";
import styled, { css } from "styled-components";

export type ButtonProps = {
  variation?: "Primary" | "Secondary";
  children?: ReactNode;
  disabled?: any;
  onClick?: any;
};

const buttonBaseStyle = css<ButtonProps>`
  ${(props: ButtonProps) => {
    return props.variation === "Secondary"
      ? css`
          border: 0.6px solid #49433e;
          background-color: ${({ theme }) =>
            theme.palette.background.sepratorBackground};
          color: ${({ theme }) => theme.palette.text.textMuted};
        `
      : props.variation === "Primary"
      ? css`
          background-image: ${({ theme }) => theme.palette.primary.primary};
        `
      : "";
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
`;
