import styled from "styled-components";

export const SplashLoaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .splash-loader__img-container {
    background-color: ${({ theme }) =>
      theme.palette.background.sepratorBackground};
    width: 176px;
    height: 176px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .splash-loader__heading {
    font-weight: 300;
    margin-top: ${({ theme }) => theme.spacing.four.spacing};
    background: ${({ theme }) => theme.palette.primary.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    text-align: center;
  }

  .splash-loader__silver-text {
    background: ${({ theme }) => theme.palette.secondary.secondary};
    margin-top: ${({ theme }) => theme.spacing.seven.spacing};
    font-weight: 500;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    text-align: center;
  }

  .splash-loader__muted-text {
    margin-top: ${({ theme }) => theme.spacing.two.spacing};
    color: ${({ theme }) => theme.palette.text.mutedText};
    font-weight: 400;
    text-align: center;
  }

  .splash-loader__muted-small-text {
    margin-top: ${({ theme }) => theme.spacing.two.spacing};
    color: ${({ theme }) => theme.palette.text.listText};
    font-weight: 400;
    text-align: center;
  }
`;
