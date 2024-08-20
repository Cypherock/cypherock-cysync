import React, { ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { DialogBoxProps } from './DialogBox';
import { IconDialogBox } from './IconDialogBox';

import {
  ServerErrorIcon,
  FailIcon,
  SettingsWrongIcon,
  CySyncDownloadRedIcon,
} from '../../../assets';
import {
  AdvanceTextDisplay,
  Button,
  LangDisplay,
  Typography,
  TypographyColor,
} from '../../atoms';
import { MessageBox, MessageBoxType } from '../MessageBox';

export type ErrorIconType = 'device' | 'default' | 'server' | 'cySyncDownload';

export interface ErrorDialogProps extends DialogBoxProps {
  title: string;
  subtext?: string;
  primaryActionText?: string;
  secondaryActionText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  iconType?: ErrorIconType;
  textVariables?: object;
  messageBoxText?: string;
  advanceText?: string;
  advanceTextColor?: TypographyColor;
  deviceNavigationText?: string;
  messageBoxVariant?: MessageBoxType;
}

const iconMap: Record<ErrorIconType, ReactNode> = {
  default: <FailIcon />,
  device: <SettingsWrongIcon />,
  server: <ServerErrorIcon />,
  cySyncDownload: <CySyncDownloadRedIcon />,
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
  deviceNavigationText,
  advanceText,
  advanceTextColor,
  ...props
}) => {
  const theme = useTheme();

  return (
    <IconDialogBox
      icon={iconMap[iconType ?? 'default']}
      title={title}
      textVariables={textVariables}
      subtext={subtext}
      afterTextComponent={
        messageBoxText || deviceNavigationText || advanceText ? (
          <>
            {advanceText && (
              <AdvanceTextDisplay>
                <Typography
                  color={advanceTextColor ?? 'muted'}
                  $wordBreak="keep-all"
                >
                  {advanceText}
                </Typography>
              </AdvanceTextDisplay>
            )}
            {messageBoxText && (
              <MessageBox
                text={messageBoxText}
                type={messageBoxVariant ?? 'danger'}
              />
            )}
            {deviceNavigationText && (
              <Typography $textAlign="center" mt={2}>
                <span style={{ color: theme?.palette.muted.main }}>Go to </span>
                <LangDisplay
                  text={deviceNavigationText}
                  variables={textVariables}
                />
              </Typography>
            )}
          </>
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
};

ErrorDialog.defaultProps = {
  subtext: undefined,
  primaryActionText: undefined,
  secondaryActionText: undefined,
  onPrimaryClick: undefined,
  onSecondaryClick: undefined,
  iconType: 'default',
  textVariables: undefined,
  messageBoxText: undefined,
  deviceNavigationText: undefined,
  advanceText: undefined,
  messageBoxVariant: 'danger',
  advanceTextColor: undefined,
};
