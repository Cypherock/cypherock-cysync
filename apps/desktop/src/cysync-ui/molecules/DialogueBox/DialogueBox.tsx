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
    <div>
      <DialogueBoxContainerStyle {...props}>
        {children}
      </DialogueBoxContainerStyle>
    </div>
  );
};

export const DialogueBoxTopBar = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return (
    <div>
      <DialogueBoxTopBarStyle {...props}> {children} </DialogueBoxTopBarStyle>
    </div>
  );
};

export const DialogueBoxBody = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return (
    <div>
      <DialogueBoxBodyStyle {...props}>{children}</DialogueBoxBodyStyle>
    </div>
  );
};

export const DialogueBoxFooter = ({
  children,
  ...props
}: DialogueBoxProps): JSX.Element => {
  return (
    <div>
      <DialogueBoxFooterStyle {...props}>{children}</DialogueBoxFooterStyle>
    </div>
  );
};
