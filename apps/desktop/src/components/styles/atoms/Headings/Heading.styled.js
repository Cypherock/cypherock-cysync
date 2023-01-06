import styled, { css } from "styled-components";

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
      ? props.theme.palette.text.textHeading
      : props.textMuted
      ? props.theme.palette.text.textMuted
      : props.textList
      ? props.theme.palette.text.textList
      : ""};
  margin-bottom: ${(props) =>
    props.mbOne
      ? props.theme.spacing.one.spacing
      : props.mbTwo
      ? props.theme.spacing.two.spacing
      : props.mbThree
      ? props.theme.spacing.three.spacing
      : props.mbFour
      ? props.theme.spacing.four.spacing
      : props.mbFive
      ? props.theme.spacing.five.spacing
      : props.mbSix
      ? props.theme.spacing.six.spacing
      : props.mb0
      ? "0px"
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
