import React from 'react';

import {
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
} from './DialogBox';

import { successIcon } from '../../../assets/images';
import { Typography, LangDisplay, Image, Container, Button } from '../../atoms';
import { AlertBox } from '../AlertBox';

export interface SuccessDialogProps {
  title: string;
  subtext?: string;
  headerText?: string;
  buttonText?: string;
  secText?: string;
  alertText?: string;
  handleClick?: () => void;
  handleSecButtonClick?: () => void;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  title,
  headerText,
  subtext,
  buttonText,
  secText,
  alertText,
  handleClick,
  handleSecButtonClick,
}) => (
  <DialogBox width={500}>
    {headerText && (
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={headerText} />
        </Typography>
      </DialogBoxHeader>
    )}

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
        {secText && handleSecButtonClick && (
          <Button onClick={handleSecButtonClick} variant="secondary">
            <LangDisplay text={secText} />
          </Button>
        )}

        <Button onClick={handleClick} variant="primary">
          <LangDisplay text={buttonText} />
        </Button>
      </DialogBoxFooter>
    )}
  </DialogBox>
);

SuccessDialog.defaultProps = {
  subtext: undefined,
  headerText: undefined,
  secText: undefined,
  buttonText: undefined,
  handleClick: undefined,
  handleSecButtonClick: undefined,
  alertText: undefined,
};
