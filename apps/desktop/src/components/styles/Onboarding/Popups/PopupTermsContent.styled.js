import styled from "styled-components";

export const PopupTermsContent = styled.div`
  .popup-terms_input {
    border-radius: 6px;
    display: inline-block;
    background-color: ${({ theme }) =>
      theme.palette.background.inputBackground};
    border: 1px solid #49433e;
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: ${({ theme }) => theme.spacing.one.spacing};
    padding-bottom: ${({ theme }) => theme.spacing.one.spacing};
    padding-left: ${({ theme }) => theme.spacing.three.spacing};
    padding-right: ${({ theme }) => theme.spacing.three.spacing};
    margin-top: ${({ theme }) => theme.spacing.two.spacing};

    div {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.palette.text.headingText};
    }
    .popup-input-heading {
      color: ${({ theme }) => theme.palette.text.headingText};
      font-weight: 400;
    }
  }
  .popup-terms_footer {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.three.spacing};

    .popup-terms_footer-subheading {
      margin-bottom: 0px;
      text-align: left;
    }
  }
`;
