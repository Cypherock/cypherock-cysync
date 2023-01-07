import styled, { css } from "styled-components";
import { margin } from "../../util/spacing/Spacing.styled";

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
  ${margin}

  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.background.inputBackground};
  background-color: ${({ theme }) => theme.palette.border.main};
  padding: 16px 24px;
  // borderRadiusOne = 8px
  border-radius: ${({ theme, borderRadiusOne }) =>
    borderRadiusOne ? theme.spacing.one.spacing : ""};
`;
