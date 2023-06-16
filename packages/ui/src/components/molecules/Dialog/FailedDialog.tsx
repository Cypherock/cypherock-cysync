import React, { FC } from 'react';
import { LangDisplay, Button, Typography, Container } from '../../atoms';
import { DialogBox, DialogBoxFooter, DialogBoxBody } from './DialogBox';
import { IconProps } from '../../../assets/images/common/DeviceUpdateIcon';

interface FailedDialogProps {
  title: string;
  subtext: string;
  Icon: FC<IconProps>;
  buttonText: string;
  handleClick: () => void;
}

export const FailedDialog: FC<FailedDialogProps> = ({
  title,
  subtext,
  buttonText,
  Icon,
  handleClick,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Icon color="#FF624C" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="p" $textAlign="center" color="muted">
          <LangDisplay text={subtext} />
        </Typography>
      </Container>
    </DialogBoxBody>
    <DialogBoxFooter>
      <Button onClick={handleClick} variant="primary">
        <LangDisplay text={buttonText} />
      </Button>
    </DialogBoxFooter>
  </DialogBox>
);
