import React, { ReactElement } from 'react';
import {
  DialogueBoxContainerStyle,
  DialogueBoxTopBarStyle,
  DialogueBoxBodyStyle,
  DialogueBoxFooterStyle,
  DialogueBoxProps,
} from './DialogueBox.styled';

export const DialogueBoxContainer = ({
  children,
  ...props
}: DialogueBoxProps): ReactElement => (
  <DialogueBoxContainerStyle {...props}>{children}</DialogueBoxContainerStyle>
);

export const DialogueBoxTopBar = ({
  children,
  ...props
}: DialogueBoxProps): ReactElement => (
  <DialogueBoxTopBarStyle {...props}> {children} </DialogueBoxTopBarStyle>
);

export const DialogueBoxBody = ({
  children,
  ...props
}: DialogueBoxProps): ReactElement => (
  <DialogueBoxBodyStyle {...props}>{children}</DialogueBoxBodyStyle>
);

export const DialogueBoxFooter = ({
  children,
  ...props
}: DialogueBoxProps): ReactElement => (
  <DialogueBoxFooterStyle {...props}>{children}</DialogueBoxFooterStyle>
);
