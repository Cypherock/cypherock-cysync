import React, { ReactNode } from 'react';

import { DialogBoxProps } from './DialogBox';
import { IconDialogBox } from './IconDialogBox';

import { ServerErrorIcon, FailIcon, SettingsWrongIcon } from '../../../assets';
import { Button } from '../../atoms';
import { MessageBox, MessageBoxType } from '../MessageBox';

export type ErrorIconType = 'device' | 'default' | 'server';

export interface ErrorDialogProps extends DialogBoxProps {
  title: string;
  subtext?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClose?: () => void;
  iconType?: ErrorIconType;
  textVariables?: object;
  messageBoxText?: string;
  messageBoxVariant?: MessageBoxType;
}

const iconMap: Record<ErrorIconType, ReactNode> = {
  default: <FailIcon />,
  device: <SettingsWrongIcon />,
  server: <ServerErrorIcon />,
};
export const ErrorDialog: React.FC<ErrorDialogProps> = ({
  title,
  subtext,
  primaryActionText,
  secondaryActionText,
  onPrimaryClick,
  onSecondaryClick,
  iconType,
  textVariables,
  messageBoxVariant,
  messageBoxText,
  ...props
}) => (
  <IconDialogBox
    icon={iconMap[iconType ?? 'default']}
    title={title}
    textVariables={textVariables}
    subtext={subtext}
    afterTextComponent={
      messageBoxText ? (
        <MessageBox
          text={messageBoxText}
          type={messageBoxVariant ?? 'warning'}
        />
      ) : undefined
    }
    footerComponent={
      <>
        {secondaryActionText && (
          <Button variant="secondary" onClick={onSecondaryClick}>
            {secondaryActionText}
          </Button>
        )}
        {primaryActionText && (
          <Button variant="primary" onClick={onPrimaryClick}>
            {primaryActionText}
          </Button>
        )}
      </>
    }
    {...props}
  />
);

ErrorDialog.defaultProps = {
  subtext: undefined,
  primaryActionText: undefined,
  secondaryActionText: undefined,
  onPrimaryClick: undefined,
  onSecondaryClick: undefined,
  iconType: 'default',
  textVariables: undefined,
  onClose: undefined,
  messageBoxText: undefined,
  messageBoxVariant: 'warning',
};
