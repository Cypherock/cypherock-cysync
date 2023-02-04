import {
  DialogueBoxContainerStyle,
  DialogueBoxTopBarStyle,
  DialogueBoxBodyStyle,
  DialogueBoxFooterStyle,
  DialogueBoxProps,
} from "./DialogueBox.styled";

export const DialogueBoxContainer = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return (
    <DialogueBoxContainerStyle {...props}>{children}</DialogueBoxContainerStyle>
  );
};

export const DialogueBoxTopBar = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return (
    <DialogueBoxTopBarStyle {...props}> {children} </DialogueBoxTopBarStyle>
  );
};

export const DialogueBoxBody = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return <DialogueBoxBodyStyle {...props}>{children}</DialogueBoxBodyStyle>;
};

export const DialogueBoxFooter = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return <DialogueBoxFooterStyle {...props}>{children}</DialogueBoxFooterStyle>;
};
