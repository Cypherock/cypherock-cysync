import React, { ReactNode } from 'react';

import { IconDialogBox } from './IconDialogBox';

import {
  DeviceUpdateFailedIcon,
  FailIcon,
  SettingsWrongIcon,
} from '../../../assets';
import { Button } from '../../atoms';

type IconType = 'device' | 'misconfigured' | 'default';

export interface ErrorDialogProps {
  title: string;
  subtext?: string;
  showRetry?: boolean;
  showReport?: boolean;
  onRetry?: () => void;
  iconType?: IconType;
  textVariables?: object;
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
          <Button variant="primary" disabled>
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
  iconType: 'default',
  textVariables: undefined,
};
