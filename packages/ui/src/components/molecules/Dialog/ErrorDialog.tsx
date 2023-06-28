import React, { ReactNode } from 'react';

import { DialogBox, DialogBoxBody, DialogBoxFooter } from './DialogBox';

import {
  DeviceUpdateFailedIcon,
  FailIcon,
  SettingsWrongIcon,
} from '../../../assets';
import { Button, Container, LangDisplay, Typography } from '../../atoms';

type IconType = 'device' | 'misconfigured' | 'default';

export interface ErrorDialogProps {
  title: string;
  subtext?: string;
  showRetry?: boolean;
  showReport?: boolean;
  onRetry?: () => void;
  iconType?: IconType;
}

const iconMap: Record<IconType, ReactNode> = {
  default: <FailIcon />,
  device: <DeviceUpdateFailedIcon />,
  misconfigured: <SettingsWrongIcon />,
};
export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  title,
  subtext,
  showRetry,
  showReport,
  onRetry,
  iconType,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      {iconMap[iconType ?? 'default']}
      <Container display="flex" direction="column" gap={4}>
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
    <DialogBoxFooter>
      {showReport && (
        <Button variant="primary" disabled>
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
  iconType: 'default',
};
