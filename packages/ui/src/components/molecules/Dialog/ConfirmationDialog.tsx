import React, { FC, ReactNode } from 'react';

import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';

import { Typography, LangDisplay, Container, Button } from '../../atoms';

interface ConfirmationDialogProps {
  title: string;
  subtext: string;
  buttonText?: string;
  icon: ReactNode;
  handleClick?: () => void;
  textVariables?: object;
  $isModal?: boolean;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  title,
  subtext,
  icon,
  buttonText,
  handleClick,
  textVariables,
  $isModal,
}) => (
  <DialogBox width={500} $isModal={$isModal}>
    <DialogBoxBody>
      {icon}
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} variables={textVariables} />
        </Typography>
        <Typography variant="p" $textAlign="center" color="muted">
          <LangDisplay text={subtext} variables={textVariables} />
        </Typography>
      </Container>
    </DialogBoxBody>
    {buttonText && handleClick && (
      <DialogBoxFooter>
        <Button onClick={handleClick} variant="primary">
          <LangDisplay text={buttonText} />
        </Button>
      </DialogBoxFooter>
    )}
  </DialogBox>
);

ConfirmationDialog.defaultProps = {
  buttonText: undefined,
  handleClick: undefined,
  textVariables: undefined,
  $isModal: false,
};
