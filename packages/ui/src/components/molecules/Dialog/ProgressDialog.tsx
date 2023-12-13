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
  versionTextVariables?: object;
  onClose?: () => void;
  dontCloseOnEscape?: boolean;
}

export const ProgressDialog: FC<ProgressDialogProps> = ({
  title,
  subtext,
  icon,
  progress,
  versionText,
  versionTextVariables,
  onClose,
  dontCloseOnEscape,
}) => (
  <DialogBox
    width={500}
    onClose={onClose}
    dontCloseOnEscape={dontCloseOnEscape}
  >
    <DialogBoxBody pb={8}>
      {icon}
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center" $allowOverflow>
          <LangDisplay text={title} />
        </Typography>
        <Typography
          variant="h6"
          $textAlign="center"
          color="muted"
          $allowOverflow
        >
          <LangDisplay text={subtext} />
        </Typography>
        <ProgressBar
          progress={progress}
          text={versionText}
          textVariables={versionTextVariables}
        />
      </Container>
    </DialogBoxBody>
  </DialogBox>
);

ProgressDialog.defaultProps = {
  versionText: undefined,
  versionTextVariables: undefined,
  onClose: undefined,
  dontCloseOnEscape: undefined,
};
