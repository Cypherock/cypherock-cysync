import React from 'react';

import {
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
} from './DialogBox';

import { successIcon } from '../../../assets/images';
import {
  Typography,
  LangDisplay,
  Image,
  Container,
  Button,
  TypographyProps,
} from '../../atoms';
import { AlertBox } from '../AlertBox';

export interface SuccessDialogProps {
  title: string;
  subtext?: string;
  headerText?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  alertText?: string;
  handleClick?: () => void;
  handleSecButtonClick?: () => void;
  onClose?: () => void;
  dontCloseOnEscape?: boolean;
  width?: number;
  headerType?: TypographyProps['variant'];
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  title,
  subtext,
  buttonText,
  headerText,
  secondaryButtonText,
  alertText,
  handleClick,
  handleSecButtonClick,
  onClose,
  dontCloseOnEscape,
  width,
  headerType,
}) => (
  <DialogBox
    width={width}
    onClose={onClose}
    dontCloseOnEscape={dontCloseOnEscape}
  >
    {headerText && (
      <DialogBoxHeader height={56} width={width}>
        <Typography variant="fineprint" color="muted">
          <LangDisplay text={headerText} />
        </Typography>
      </DialogBoxHeader>
    )}
    <DialogBoxBody>
      <Image src={successIcon} alt="Success Icon" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant={headerType} $textAlign="center">
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
        {secondaryButtonText && handleSecButtonClick && (
          <Button onClick={handleSecButtonClick} variant="secondary">
            <LangDisplay text={secondaryButtonText} />
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
  secondaryButtonText: undefined,
  buttonText: undefined,
  handleClick: undefined,
  handleSecButtonClick: undefined,
  alertText: undefined,
  headerText: undefined,
  onClose: undefined,
  dontCloseOnEscape: undefined,
  width: 500,
  headerType: 'h4',
};
