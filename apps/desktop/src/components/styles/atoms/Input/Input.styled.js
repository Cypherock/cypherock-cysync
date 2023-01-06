import styled from "styled-components";

export const Input = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;

  label {
    font-size: 14px;
    color: ${({ theme }) => theme.palette.text.mutedText};
    margin: ${({ theme }) => theme.spacing.one.spacing};
    letter-spacing: 0.12em;
  }

  input {
    position: relative;
    width: 100%;
    border: none;
    padding-top: ${({ theme }) => theme.spacing.two.spacing};
    padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
    padding-left: ${({ theme }) => theme.spacing.three.spacing};
    padding-right: ${({ theme }) => theme.spacing.three.spacing};
    background-color: ${({ theme }) =>
      theme.palette.background.inputBackground};
    border-radius: ${({ theme }) => theme.spacing.one.spacing};
    color: ${({ theme }) => theme.palette.text.mutedText};
    font-size: ${({ theme }) => theme.spacing.two.spacing};
    margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  }
  input::placeholder {
    letter-spacing: 4px;
    font-size: 24px;
    text-align: baseline;
    line-height: 0;
  }
  img {
    position: absolute;
    right: 24px;
    bottom: 16px;
  }
`;
