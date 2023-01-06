import styled, { css } from "styled-components";
import { theme } from "../../../Theme/theme.styled";

export const baseStyle = css`
  ${(props) => {
    return (
      props.textGold &&
      css`
        background: ${({ theme }) => theme.palette.primary.primary};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        text-align: center;
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
        text-align: center;
      `
    );
  }}
  color: ${(props) =>
    props.textHeading
      ? theme.palette.text.textHeading
      : props.textMuted
      ? theme.palette.text.textMuted
      : props.textList
      ? theme.palette.text.textList
      : ""};
  margin-bottom: ${(props) =>
    props.mbOne
      ? theme.spacing.one.spacing
      : props.mbTwo
      ? theme.spacing.two.spacing
      : props.mbThree
      ? theme.spacing.three.spacing
      : props.mbFour
      ? theme.spacing.four.spacing
      : props.mbFive
      ? theme.spacing.five.spacing
      : ""};
  text-align: ${(props) => {
    props.center ? "center" : props.right ? "right" : props.left ? "left" : "";
  }};
  max-width: 100%;
`;

export const HeadingOne = styled.h1`
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;

export const HeadingTwo = styled.h2`
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;

export const HeadingThree = styled.h3`
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;

export const HeadingFour = styled.h4`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;

export const HeadingFive = styled.h5`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;

export const HeadingSix = styled.h6`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;

export const HeadingSmallest = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
`;
