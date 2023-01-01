import styled from "styled-components";

export const DialogueSetPasswordContent = styled.div`
  .popup-set-Password__active-text {
    font-weight: 400;
    color: ${({ theme }) => theme.palette.text.mutedText};
  }
  .popup-set-password__info {
    font-weight: 400;
    max-width: 450px;
    margin-bottom: ${({ theme }) => theme.spacing.four.spacing};
    margin-top: 4px;
  }
  .popup-set-password__error-text {
    margin-top: ${({ theme }) => theme.spacing.three.spacing};
    margin-bottom: ${({ theme }) => theme.spacing.eight.spacing};
  }
`;
