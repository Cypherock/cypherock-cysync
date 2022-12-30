import styled from "styled-components";

export const PopupWelcomeContent = styled.div`
  text-align: center;

  .popup-welcome-content__info {
    margin-bottom: ${({ theme }) => theme.spacing.four.spacing};
    background-color: ${({ theme }) =>
      theme.palette.background.inputBackground};
    border-style: solid;
    border-color: ${({ theme }) => theme.palette.border.main};
    border-width: 1px;
    border-radius: 8px;
    padding-top: ${({ theme }) => theme.spacing.one.spacing};
    padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
    padding-left: ${({ theme }) => theme.spacing.three.spacing};
    padding-right: ${({ theme }) => theme.spacing.three.spacing};

    .popup-welcome-content__info-section {
      display: flex;
      flex-direction: row;
      width: 100%;
      margin: ${({ theme }) => theme.spacing.one.spacing};

      .popup-welcome-content__info-list-item-active {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        width: 50%;

        .popup-welcome-content__info-list-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
          background-image: ${({ theme }) => theme.palette.primary.primary};
        }
        .popup-welcome-content__info-list-heading {
          cursor: pointer;
          background: ${({ theme }) => theme.palette.primary.primary};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          font-size: 18px;
          font-weight: 400;
        }
      }

      .popup-welcome-content__info-list-item-inactive {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        width: 50%;

        .popup-welcome-content__info-list-bullet {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
          background-color: ${({ theme }) => theme.palette.text.headingText};
        }
        .popup-welcome-content__info-list-heading {
          cursor: pointer;
          background-color: ${({ theme }) => theme.palette.text.listText};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          font-size: 18px;
          font-weight: 400;
        }
      }
    }
  }
  .popup-welcome-content__footer-text {
    padding-left: ${({ theme }) => theme.spacing.three.spacing};
    padding-right: ${({ theme }) => theme.spacing.three.spacing};
    margin-bottom: ${({ theme }) => theme.spacing.four.spacing};
    color: ${({ theme }) => theme.palette.text.mutedText};
    font-weight: 400;

    span {
      color: ${({ theme }) => theme.palette.text.listText};
    }
  }
  .popup-welcome-content__btn {
  }
`;
