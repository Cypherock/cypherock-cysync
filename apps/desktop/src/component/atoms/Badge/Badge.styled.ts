import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { theme } from "@/theme/theme.styled";

export interface BadgeProps {
  textTransform?: "capitalize";
  children?: ReactNode;
};

export const BadgeStyle = styled.div`
  padding: 2px 8px;
  border: 1px solid #8b8682;
  border-radius: 4px;
`;

export const BadgeTypographyStyle = styled.div<BadgeProps>`
  color: ${theme.palette.text.textMuted};
  font-weight: 500;
  font-size: 10px;
  line-height: 15px;
  text-transform: uppercase;

  ${(props) => {
    return (
      props.textTransform === "capitalize" &&
      css`
        text-transform: capitalize;
      `
    );
  }}
`;
