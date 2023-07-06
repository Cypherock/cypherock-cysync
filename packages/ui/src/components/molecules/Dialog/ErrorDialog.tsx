import React, { ReactNode } from 'react';

import { IconDialogBox } from './IconDialogBox';

import { ServerErrorIcon, FailIcon, SettingsWrongIcon } from '../../../assets';
import { Button } from '../../atoms';

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
  <IconDialogBox
    icon={iconMap[iconType ?? 'default']}
    title={title}
    textVariables={textVariables}
    subtext={subtext}
    footerComponent={
      <>
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
      </>
    }
  />
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
