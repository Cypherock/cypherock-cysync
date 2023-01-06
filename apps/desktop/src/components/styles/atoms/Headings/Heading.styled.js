import styled, { css } from "styled-components";
import { margin } from "../../util/spacing/Spacing.styled";

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

${(props) => {
    return (
      props.textError &&
      css`
        color: ${({ theme }) => theme.palette.warning.main};
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

  text-align: ${({ right }) => {
    right ? "right" : "";
  }};
  max-width: 100%;
`;

export const HeadingOne = styled.h1`
  font-size: 40px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingTwo = styled.h2`
  font-size: 32px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingThree = styled.h3`
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingFour = styled.h4`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingFive = styled.h5`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingSix = styled.h6`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;

export const HeadingSmallest = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 4px;
  ${baseStyle};
  ${margin};
`;
