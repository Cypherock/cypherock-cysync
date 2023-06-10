import React from 'react';

import { successIcon } from '../../../assets/images';
import { Typography, LangDisplay, Image, Container } from '../../atoms';
import { DialogBox, DialogBoxBody } from './DialogBox';

export interface SuccessDialogProps {
  title: string;
  subtext?: string;
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
  title,
  subtext,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={successIcon} alt="Success Icon" />
      <Container display="flex" direction="column" gap={4} mb={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        {subtext && (
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={subtext} />
          </Typography>
        )}
      </Container>
    </DialogBoxBody>
  </DialogBox>
);

SuccessDialog.defaultProps = {
  subtext: undefined,
};
