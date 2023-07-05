import React, { ReactNode } from 'react';

import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';

import { ServerErrorIcon, FailIcon, SettingsWrongIcon } from '../../../assets';
import { Button, Container, LangDisplay, Typography } from '../../atoms';

export type ErrorIconType = 'device' | 'default' | 'server';

export interface ErrorDialogProps {
  title: string;
  subtext?: string;
  showRetry?: boolean;
  showReport?: boolean;
  onRetry?: () => void;
  onReport?: () => void;
  iconType?: ErrorIconType;
  textVariables?: object;
}

const iconMap: Record<ErrorIconType, ReactNode> = {
  default: <FailIcon />,
  device: <SettingsWrongIcon />,
  server: <ServerErrorIcon />,
};
export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  title,
  subtext,
  showRetry,
  showReport,
  onRetry,
  onReport,
  iconType,
  textVariables,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      {iconMap[iconType ?? 'default']}
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} variables={textVariables} />
        </Typography>
        {subtext && (
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={subtext} variables={textVariables} />
          </Typography>
        )}
      </Container>
    </DialogBoxBody>
    <DialogBoxFooter>
      {showReport && (
        <Button variant="primary" onClick={onReport}>
          Report
        </Button>
      )}
      {showRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </DialogBoxFooter>
  </DialogBox>
);

ErrorDialog.defaultProps = {
  subtext: undefined,
  showRetry: false,
  showReport: false,
  onRetry: undefined,
  onReport: undefined,
  iconType: 'default',
  textVariables: undefined,
};
