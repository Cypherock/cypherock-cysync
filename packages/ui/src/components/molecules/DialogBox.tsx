import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import {
  WidthProps,
  width,
  flex,
  FlexProps,
  DisplayProps,
  SpacingProps,
  spacing,
} from '../utils';
import { HeightProps, height } from '../utils/height.styled';

export interface DialogBoxProps
  extends WidthProps,
    HeightProps,
    FlexProps,
    DisplayProps,
    SpacingProps {
  children?: ReactNode;
}

const DialogBoxStyle = styled.section<DialogBoxProps>`
  ${flex}
  ${width}
  ${height}
  ${spacing}
  border-width: 1px;
  border-style: solid;
  border-radius: 16px;
  background-image: ${({ theme }) => theme.palette.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.popup};
  border-color: ${({ theme }) => theme.palette.border.popup};
  text-align: center;
`;

const DialogBoxHeaderBarStyle = styled.div<DialogBoxProps>`
  ${flex}
  ${width}
${height}
${spacing}
  padding-left: 32px;
  padding-right: 32px;
  border-bottom: 1px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  border-color: ${({ theme }) => theme.palette.border.popup};
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: ${({ theme }) => theme.palette.text.mutedText};
`;

const DialogBoxBodyStyle = styled.div<DialogBoxProps>`
  ${flex}
  padding: 42px 40px 32px 40px;
`;

const DialogBoxFooterStyle = styled.div<DialogBoxProps>`
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
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

export const DialogBox: FC<DialogBoxProps> = ({ children, ...props }) => (
  <DialogBoxStyle {...props}>{children}</DialogBoxStyle>
);

export const DialogBoxHeader: FC<DialogBoxProps> = ({ children, ...props }) => (
  <DialogBoxHeaderBarStyle {...props}> {children} </DialogBoxHeaderBarStyle>
);

export const DialogBoxBody: FC<DialogBoxProps> = ({ children, ...props }) => (
  <DialogBoxBodyStyle {...props}>{children}</DialogBoxBodyStyle>
);

export const DialogBoxFooter: FC<DialogBoxProps> = ({ children, ...props }) => (
  <DialogBoxFooterStyle {...props}>{children}</DialogBoxFooterStyle>
);

DialogBox.defaultProps = {
  children: null,
};
DialogBoxBody.defaultProps = {
  children: null,
};
DialogBoxFooter.defaultProps = {
  children: null,
};
DialogBoxHeader.defaultProps = {
  children: null,
};
