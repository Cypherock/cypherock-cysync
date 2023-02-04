import { UtilsProps, utils } from "@/component/util";
import styled, { css } from "styled-components";
import { ReactNode } from "react";

export type ClipProps = {
  children?: ReactNode;
  variant?: "banner" | "update" | "active";
} & UtilsProps;

export const ChipStyle = styled.div<ClipProps>`
  cursor: pointer;
  border-radius: 36px;
  background-color: #27221d;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  gap: 12.5px;
  ${utils}

  ${(props) => {
    return (
      props.variant === "active" &&
      css`
        background-color: #39322c;
      `
    );
  }}
`;
