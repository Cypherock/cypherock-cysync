import styled from "styled-components";

export const DialogueContainer = styled.div`
  max-width: 600px;
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  text-align: center;
  background-image: ${({ theme }) =>
    theme.palette.background.sideBarBackground};
  box-shadow: ${({ theme }) => theme.shadow.popupShadow};
  border-color: ${({ theme }) => theme.palette.border.main};

  .dialogue-header {
    padding: ${({ theme }) => theme.spacing.two.spacing};
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.mutedText};
    border-top: 0;
    border-bottom: 1px;
    border-left: 0;
    border-right: 0;
    border-style: solid;
    border-color: ${({ theme }) => theme.palette.border.main};
  }
  .dialogue-body {
    padding: 42px 40px 32px 40px;
  }
  .dialogue-footer {
    padding: 32px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px;
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
    border-style: solid;
    border-color: ${({ theme }) => theme.palette.border.main};
    display: flex;
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.two.spacing};
  }
  .dialogue-heading {
    text-align: center;
    font-weight: 400;
    max-width: 500px;
    color: ${({ theme }) => theme.palette.text.headingText};
    margin-bottom: ${({ theme }) => theme.spacing.one.spacing};
  }

  .dialogue-subheading {
    font-weight: 400;
    max-width: 450px;
    margin-bottom: ${({ theme }) => theme.spacing.four.spacing};
    color: ${({ theme }) => theme.palette.text.mutedText};
  }

  .active-text {
    color: #ccc4be;
  }
  .small-text {
    font-size: 14px;
  }
  .muted-text {
    color: ${({ theme }) => theme.palette.text.mutedText};
  }

  .error-text {
    color: ${({ theme }) => theme.palette.warning.main};
    font-weight: 300;
    text-align: start;
  }

  .dialogue-list {
    padding-top: ${({ theme }) => theme.spacing.two.spacing};
    padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
    padding-left: ${({ theme }) => theme.spacing.three.spacing};
    padding-right: ${({ theme }) => theme.spacing.three.spacing};
    border-width: 1px;
    border-style: solid;
    border-color: ${({ theme }) => theme.palette.border.main};
    background-color: ${({ theme }) =>
      theme.palette.background.inputBackground};
  }

  .dialogue-list-items {
    list-style: none;
  }
`;
