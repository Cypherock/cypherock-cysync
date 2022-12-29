import styled from "styled-components";

export const InformationPopupContent = styled.div`
  .information-popup-content__heading {
    color: ${({ theme }) => theme.palette.text.headingText};
    font-weight: 500;
  }

  .information-popup-content__list {
    list-style: none;
    margin-top: ${({ theme }) => theme.spacing.five.spacing};

    .information-popup-content__list-items {
      margin-top: ${({ theme }) => theme.spacing.two.spacing};

      h5 {
        font-weight: 400;
        color: ${({ theme }) => theme.palette.text.mutedText};
      }
    }
  }
`;
