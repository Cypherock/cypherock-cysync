import React from 'react';

import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';

import { successIcon } from '../../../assets/images';
import { Typography, LangDisplay, Image, Container, Button } from '../../atoms';
import { AlertBox } from '../AlertBox';

export interface SuccessDialogProps {
  title: string;
  subtext?: string;
  buttonText?: string;
  alertText?: string;
  handleClick?: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  title,
  subtext,
  buttonText,
  alertText,
  handleClick,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={successIcon} alt="Success Icon" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h4" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        {subtext && (
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={subtext} />
          </Typography>
        )}
        {alertText && <AlertBox mt="48" alert={alertText} variant="info" />}
      </Container>
    </DialogBoxBody>
    {buttonText && handleClick && (
      <DialogBoxFooter height={101}>
        <Button onClick={handleClick} variant="primary">
          <LangDisplay text={buttonText} />
        </Button>
      </DialogBoxFooter>
    )}
  </DialogBox>
);

SuccessDialog.defaultProps = {
  subtext: undefined,
  buttonText: undefined,
  handleClick: undefined,
  alertText: undefined,
};
