import styled, { css } from "styled-components";
import { theme } from "../../../../Theme/theme.styled";

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: ${({ bg, theme }) =>
    bg == "SplashLoader"
      ? theme.palette.background.sideBarBackground
      : theme.palette.background.contentBackground};
`;

export const DefaultContainer = styled.div`
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

  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.background.sepratorBackground};
  background-color: #272320;
  padding: 10px 30px;
  padding-left: ${({ theme, plOne }) =>
    plOne ? theme.spacing.one.spacing : ""};
  padding-right: ${({ theme, prOne }) =>
    prOne ? theme.spacing.one.spacing : ""};
  padding-left: ${({ theme, plOne }) =>
    plOne ? theme.spacing.one.spacing : ""};
  padding-left: ${({ theme, plOne }) =>
    plOne ? theme.spacing.one.spacing : ""};
  // borderRadiusOne = 8px
  border-radius: ${({ theme, borderRadiusOne }) =>
    borderRadiusOne ? theme.spacing.one.spacing : ""};

  /* ${(props) => {
    return (
      props.bgSeparator &&
      css`
        background-color: ${({ theme }) =>
          theme.palette.background.sepratorBackground};
      `
    );
  }} */
`;
