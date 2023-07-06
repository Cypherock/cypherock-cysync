import React, { ReactNode } from 'react';

import { DialogBoxProps } from './DialogBox';
import { IconDialogBox } from './IconDialogBox';

import {
  DeviceUpdateFailedIcon,
  FailIcon,
  SettingsWrongIcon,
} from '../../../assets';
import { Button } from '../../atoms';

type IconType = 'device' | 'misconfigured' | 'default';

export interface ErrorDialogProps extends DialogBoxProps {
  title: string;
  subtext?: string;
  showRetry?: boolean;
  showReport?: boolean;
  onRetry?: () => void;
  onReport?: () => void;
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
  onReport,
  iconType,
  textVariables,
  ...props
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
    {...props}
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
