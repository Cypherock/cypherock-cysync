import React, { FC } from 'react';
import { Typography, LangDisplay, Container, Button } from '../../atoms';
import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';
import { IconProps } from '../../../assets/images/common/DeviceUpdateIcon';

interface UpdateConfirmationDialogProps {
  title: string;
  subtext: string;
  buttonText?: string;
  Icon: FC<IconProps>;
  handleClick?: () => void;
}

export const UpdateConfirmationDialog: FC<UpdateConfirmationDialogProps> = ({
  title,
  subtext,
  Icon,
  buttonText,
  handleClick,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Icon />
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

UpdateConfirmationDialog.defaultProps = {
  buttonText: undefined,
  handleClick: undefined,
};
