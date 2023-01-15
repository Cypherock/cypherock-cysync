import { ReactNode } from "react";
import styled from "styled-components";

export type DialogueBoxProps = {
  children?: ReactNode;
  lg?: Boolean;
  md?: Boolean;
};

export const DialogueBoxContainerStyle = styled.section`
  max-width: ${(props: DialogueBoxProps) =>
    props.lg ? "700px" : props.md ? "500px" : ""};
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  background-image: ${({ theme }) =>
    theme.palette.background.sideBarBackground};
  box-shadow: ${({ theme }) => theme.shadow.popupShadow};
  border-color: ${({ theme }) => theme.palette.border.main};
  text-align: center;
`;

export const DialogueBoxTopBarStyle = styled.div`
  padding-left: 32px;
  padding-right: 32px;
  border-bottom: 1px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.border.main};
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: ${({ theme }) => theme.palette.text.mutedText};
`;

export const DialogueBoxBodyStyle = styled.div`
  padding: 42px 40px 32px 40px;
`;

export const DialogueBoxFooterStyle = styled.div`
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
