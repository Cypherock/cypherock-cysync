import React from 'react';

import {
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
} from './DialogBox';

import { goldTick, successIcon } from '../../../assets/images';
import {
  Typography,
  LangDisplay,
  Image,
  Container,
  Button,
  TypographyProps,
  CloseButton,
} from '../../atoms';
import { SpacingProps } from '../../utils';
import { AlertBox } from '../AlertBox';

export interface SuccessDialogProps {
  title: string;
  subtext?: string;
  headerText?: string;
  buttonText?: string;
  goldenIcon?: boolean;
  secondaryButtonText?: string;
  alertText?: string;
  handleClick?: () => void;
  handleSecButtonClick?: () => void;
  onClose?: () => void;
  dontCloseOnEscape?: boolean;
  width?: number;
  headerType?: TypographyProps['variant'];
  bodyBottomPadding?: SpacingProps['pb'];
  showCloseBtn?: boolean;
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
  bodyBottomPadding,
  showCloseBtn,
  goldenIcon,
}) => (
  <DialogBox
    width={width}
    onClose={onClose}
    dontCloseOnEscape={dontCloseOnEscape}
  >
    {(headerText || showCloseBtn) && (
      <DialogBoxHeader
        height={56}
        width={width}
        justify={showCloseBtn ? 'flex-end' : undefined}
      >
        {headerText && (
          <Typography variant="fineprint" color="muted">
            <LangDisplay text={headerText} />
          </Typography>
        )}

        {onClose && showCloseBtn && (
          <CloseButton width={24} onClick={onClose} />
        )}
      </DialogBoxHeader>
    )}
    <DialogBoxBody pb={bodyBottomPadding}>
      <Image src={goldenIcon ? goldTick : successIcon} alt="Success Icon" />
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
  bodyBottomPadding: undefined,
  showCloseBtn: false,
  goldenIcon: false,
};
