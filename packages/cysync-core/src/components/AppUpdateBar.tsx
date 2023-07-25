import {
  Check,
  CloudDownload,
  LangDisplay,
  UpdateBar,
  UpdateState,
} from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';
import { useTheme } from 'styled-components';

import { AppUpdateState, useAppUpdate } from '~/hooks';

import { selectLanguage, useAppSelector } from '..';

type UpdateBarType = {
  [key in AppUpdateState]?: {
    icon: ReactNode;
    text: string;
    updateState: UpdateState;
    buttonText?: string;
    onButtonClick?: () => void;
  };
};

export const AppUpdateBar: FC = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const {
    updateInfo,
    downloadProgress,
    appUpdateState,
    onRetry,
    downloadUpdate,
    installUpdate,
  } = useAppUpdate({ shouldInstallAfterUpdate: false });

  const updateBarMap: UpdateBarType = {
    [AppUpdateState.Confirmation]: {
      icon: <CloudDownload />,
      text: 'confirmation',
      buttonText: 'download',
      updateState: 'normal',
      onButtonClick: downloadUpdate,
    },
    [AppUpdateState.Downloading]: {
      icon: <CloudDownload />,
      text: 'downloading',
      updateState: 'progress',
    },
    [AppUpdateState.Successful]: {
      icon: <Check />,
      text: 'successful',
      buttonText: 'installUpdate',
      updateState: 'success',
      onButtonClick: installUpdate,
    },
    [AppUpdateState.Failed]: {
      icon: <CloudDownload fill={theme?.palette.warn.main} />,
      text: 'error',
      buttonText: 'tryAgain',
      updateState: 'error',
      onButtonClick: onRetry,
    },
    [AppUpdateState.FailedFallback]: {
      icon: <CloudDownload fill={theme?.palette.warn.main} />,
      text: 'error',
      buttonText: 'tryAgain',
      updateState: 'error',
      onButtonClick: onRetry,
    },
  };

  return updateInfo ? (
    <UpdateBar
      progress={downloadProgress}
      icon={updateBarMap[appUpdateState]?.icon}
      state={updateBarMap[appUpdateState]?.updateState}
      onButtonClick={updateBarMap[appUpdateState]?.onButtonClick}
      text={
        updateBarMap[appUpdateState]?.text && (
          <LangDisplay
            text={
              (lang.strings.appUpdateBar as any)[
                updateBarMap[appUpdateState]?.text ?? ''
              ]
            }
            variables={updateInfo}
          />
        )
      }
      buttonText={
        updateBarMap[appUpdateState]?.buttonText && (
          <LangDisplay
            text={
              (lang.strings.appUpdateBar.buttons as any)[
                updateBarMap[appUpdateState]?.buttonText ?? ''
              ]
            }
          />
        )
      }
    />
  ) : null;
};
