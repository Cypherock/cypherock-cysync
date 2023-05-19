import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { WidthProps, width, flex, FlexProps } from '../utils';
import { HeightProps, height } from '../utils/height.styled';

export interface DialogueBoxProps extends WidthProps, HeightProps, FlexProps {
  children?: ReactNode;
}

const DialogueBoxContainerStyle = styled.section<DialogueBoxProps>`
  ${width}
  ${height}
  ${flex}
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  background-image: ${({ theme }) => theme.palette.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.popup};
  border-color: ${({ theme }) => theme.palette.border.main};
  text-align: center;
`;

const DialogueBoxTopBarStyle = styled.div<DialogueBoxProps>`
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

const DialogueBoxBodyStyle = styled.div<DialogueBoxProps>`
  ${flex}
  padding: 42px 40px 32px 40px;
`;

const DialogueBoxFooterStyle = styled.div<DialogueBoxProps>`
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
  border-color: ${({ theme }) => theme.palette.border.popup};
  gap: ${({ theme }) => theme.spacing.two.spacing};
`;

export const DialogueBoxContainer: FC<DialogueBoxProps> = ({
  children,
  ...props
}) => (
  <DialogueBoxContainerStyle {...props}>{children}</DialogueBoxContainerStyle>
);

export const DialogueBoxTopBar: FC<DialogueBoxProps> = ({
  children,
  ...props
}) => <DialogueBoxTopBarStyle {...props}> {children} </DialogueBoxTopBarStyle>;

export const DialogueBoxBody: FC<DialogueBoxProps> = ({
  children,
  ...props
}) => <DialogueBoxBodyStyle {...props}>{children}</DialogueBoxBodyStyle>;

export const DialogueBoxFooter: FC<DialogueBoxProps> = ({
  children,
  ...props
}) => <DialogueBoxFooterStyle {...props}>{children}</DialogueBoxFooterStyle>;

DialogueBoxContainer.defaultProps = {
  children: null,
};
DialogueBoxBody.defaultProps = {
  children: null,
};
DialogueBoxFooter.defaultProps = {
  children: null,
};
DialogueBoxTopBar.defaultProps = {
  children: null,
};
