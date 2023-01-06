import styled from "styled-components";

export const DialogueBoxContainer = styled.section`
  max-width: 600px;
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  background-image: ${({ theme }) =>
    theme.palette.background.sideBarBackground};
  box-shadow: ${({ theme }) => theme.shadow.popupShadow};
  border-color: ${({ theme }) => theme.palette.border.main};
  text-align: center;
  .default-dialogue__list {
    border-width: 1px;
    border-style: solid;
    padding-top: ${({ theme }) => theme.spacing.two.spacing};
    padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
    padding-left: ${({ theme }) => theme.spacing.three.spacing};
    padding-right: ${({ theme }) => theme.spacing.three.spacing};
    border-color: ${({ theme }) => theme.palette.border.main};
    background-color: ${({ theme }) =>
      theme.palette.background.inputBackground};
  }

  .default-dialogue__list-items {
    list-style: none;
  }
`;

export const DialogueBoxHeader = styled.div`
  border-bottom: 1px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.border.main};
  padding: ${({ theme }) => theme.spacing.two.spacing};
  color: ${({ theme }) => theme.palette.text.mutedText};
`;

export const DialogueBoxBody = styled.div`
  padding: 42px 40px 32px 40px;
`;

export const DialogueBoxFooter = styled.div`
  padding: 32px 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top: 1px;
  border-bottom: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.border.main};
  gap: ${({ theme }) => theme.spacing.two.spacing};
`;
