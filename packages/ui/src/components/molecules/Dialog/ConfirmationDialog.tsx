import React, { FC, ReactNode } from 'react';

import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';

import { Typography, LangDisplay, Container, Button } from '../../atoms';

interface ConfirmationDialogProps {
  title: string;
  subtext: string;
  buttonText?: string;
  icon: ReactNode;
  handleClick?: () => void;
}

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  title,
  subtext,
  icon,
  buttonText,
  handleClick,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      {icon}
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="p" $textAlign="center" color="muted">
          <LangDisplay text={subtext} />
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
};
