import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: ${({ bg, theme }) =>
    bg == "SplashLoader"
      ? theme.palette.background.sideBarBackground
      : theme.palette.background.contentBackground};
`;
