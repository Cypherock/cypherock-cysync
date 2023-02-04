import { ReactNode } from "react";
import styled, { css } from "styled-components";
import { margin, MarginProps, fontWeight, FontWeightProps } from "../../util";

export type HeadingProps = {
  children: ReactNode;
  textGold?: Boolean;
  textSilver?: Boolean;
  textError?: Boolean;
  textSuccess?: Boolean;
  textHeading?: Boolean;
  textMuted?: Boolean;
  textList?: Boolean;
  textRight?: Boolean;
  textLeft?: Boolean;
} & MarginProps &
  FontWeightProps;

export const baseStyle = css<HeadingProps>`
  ${(props: HeadingProps) => {
    return (
      props.textGold &&
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
      props.textSilver &&
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
      props.textError &&
      css`
        color: ${({ theme }) => theme.palette.warning.main};
      `
    );
  }}

  
${(props) => {
    return (
      props.textSuccess &&
      css`
        color: ${({ theme }) => theme.palette.success.main};
      `
    );
  }}
  color: ${(props) =>
    props.textHeading
      ? props.theme.palette.text.textHeading
      : props.textMuted
      ? props.theme.palette.text.textMuted
      : props.textList
      ? props.theme.palette.text.textList
      : ""};

  text-align: ${(props: HeadingProps) =>
    props.textRight ? "right" : props.textLeft ? "left" : ""};
  max-width: 100%;
`;

export const HeadingOneStyle = styled.h1<HeadingProps>`
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingTwo = styled.h2`
  font-size: 32px;
  font-weight: 400;

  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingThree = styled.h3`
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingFourStyle = styled.h4`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingFiveStyle = styled.h5<HeadingProps>`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingSixStyle = styled.h6<HeadingProps>`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const HeadingSmallestStyle = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;

export const SpanStyle = styled.span`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
  ${fontWeight};
`;
