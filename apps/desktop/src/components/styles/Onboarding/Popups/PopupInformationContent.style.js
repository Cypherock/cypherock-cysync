import styled from "styled-components";

export const PopupInformationContent = styled.div`
  .information-popup-content__heading {
    color: ${({ theme }) => theme.palette.text.headingText};
    font-weight: 500;
    text-align: center;
  }

  .information-popup-content__list {
    list-style: none;
    margin-top: ${({ theme }) => theme.spacing.five.spacing};

    .information-popup-content__list-items {
      display: flex;
      align-items: center;
      gap: 16px;

      margin-top: ${({ theme }) => theme.spacing.two.spacing};

      div {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: ${({ theme }) => theme.palette.text.headingText};
      }

      h5 {
        font-weight: 400;
        color: ${({ theme }) => theme.palette.text.mutedText};
      }
    }
  }
`;
