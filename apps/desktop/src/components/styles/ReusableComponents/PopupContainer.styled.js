import styled from "styled-components";

export const PopupContainer = styled.div`
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  text-align: center;
  background-image: ${({ theme }) =>
    theme.palette.background.sideBarBackground};
  box-shadow: ${({ theme }) => theme.shadow.popupShadow};
  border-color: ${({ theme }) => theme.palette.border.main};

  .popup-body {
    padding: 42px 40px 32px 40px;
  }
  .popup-footer {
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
  }
  .popup-heading {
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.headingText};
    margin-bottom: ${({ theme }) => theme.spacing.one.spacing};
  }

  .popup-subheading {
    font-weight: 400;
    max-width: 420px;
    margin-bottom: ${({ theme }) => theme.spacing.four.spacing};
    color: ${({ theme }) => theme.palette.text.mutedText};
  }
`;
