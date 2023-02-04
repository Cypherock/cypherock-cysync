import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { margin, MarginProps, fontWeight, FontWeightProps } from "../../util";

export type HeadingProps = {
  color?:
    | "textGold"
    | "textSilver"
    | "textError"
    | "textSuccess"
    | "textHeading"
    | "textMuted"
    | "textList";
  textAlign?: "center" | "left" | "right";
} & MarginProps &
  FontWeightProps;

export const baseStyle = css`
  ${(props: HeadingProps) => {
    return (
      props.color === "textGold" &&
      css`
        background: ${({ theme }) => theme.palette.primary.primary};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      `
    );
  }}

  ${(props) => {
    return (
      props.color === "textSilver" &&
      css`
        background: ${({ theme }) => theme.palette.secondary.secondary};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
      `
    );
  }}

${(props) => {
    return (
      props.color === "textError" &&
      css`
        color: ${({ theme }) => theme.palette.warning.main};
      `
    );
  }}

  
${(props) => {
    return (
      props.color === "textSuccess" &&
      css`
        color: ${({ theme }) => theme.palette.success.main};
      `
    );
  }}
  color: ${(props) =>
    props.color === "textHeading"
      ? props.theme.palette.text.textHeading
      : props.color === "textMuted"
      ? props.theme.palette.text.textMuted
      : props.color === "textList"
      ? props.theme.palette.text.textList
      : ""};

  text-align: ${(props) =>
    props.textAlign === "right"
      ? "right"
      : props.textAlign === "left"
      ? "left"
      : props.textAlign === "center"
      ? "center"
      : ""};
  max-width: 100%;
`;

export const HeadingOneStyle = styled.h1<HeadingProps>`
  font-size: 40px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingTwoStyle = styled.h2`
  font-size: 32px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingThreeStyle = styled.h3`
  font-size: 28px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
`;

export const HeadingFourStyle = styled.h4`
  font-size: 24px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingFiveStyle = styled.h5<HeadingProps>`
  font-size: 20px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingSixStyle = styled.h6<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingSmallestStyle = styled.div`
  font-size: 14px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const SpanStyle = styled.span`
  font-size: 16px;
  font-weight: 400;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;
