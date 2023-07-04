import React, { FC, ReactNode } from 'react';

import { DialogBox, DialogBoxBody } from './DialogBox';

import { Container, LangDisplay, Typography } from '../../atoms';
import { ProgressBar } from '../ProgressBar';

interface ProgressDialogProps {
  title: string;
  subtext: string;
  icon: ReactNode;
  progress: number;
  versionText?: string;
  versionTextVaribles?: object;
}

export const ProgressDialog: FC<ProgressDialogProps> = ({
  title,
  subtext,
  icon,
  progress,
  versionText,
  versionTextVaribles,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody pb={8}>
      {icon}
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          <LangDisplay text={subtext} />
        </Typography>
        <ProgressBar
          progress={progress}
          text={versionText}
          textVariables={versionTextVaribles}
        />
      </Container>
    </DialogBoxBody>
  </DialogBox>
);

ProgressDialog.defaultProps = {
  versionText: undefined,
  versionTextVaribles: undefined,
};
