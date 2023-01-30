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
import { theme } from "@/theme/theme.styled";

export type ClipProps = {
  children?: ReactNode;
  banner?: Boolean;
  update?: Boolean;
  variation?: "active";
} & MarginProps &
  FlexProps &
  PaddingProps &
  FontWeightProps;

export const ChipStyle = styled.div<ClipProps>`
  cursor: pointer;
  border-radius: 36px;
  background-color: #27221d;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  gap: 12.5px;

  ${(props) => {
    return (
      props.variation === "active" &&
      css`
        background-color: #39322c;
      `
    );
  }}
`;
