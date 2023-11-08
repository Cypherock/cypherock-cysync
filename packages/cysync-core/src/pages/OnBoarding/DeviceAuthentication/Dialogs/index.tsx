import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { ErrorHandlerDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';
import { getCloseAppMethod } from '~/utils';

import { DeviceAuthenticating } from './Authenticating';

import { useDeviceAuthOnboarding } from '../context';

export const DeviceAuthDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { task, onRetry } = useDeviceAuthOnboarding();

  return (
    <ErrorHandlerDialog
      error={task.error}
      onRetry={onRetry}
      onClose={getCloseAppMethod()}
      isOnboarding
    >
      {task.result === undefined && <DeviceAuthenticating />}
      {task.result && (
        <SuccessDialog
          title={lang.strings.onboarding.deviceAuth.success.title}
          subtext={lang.strings.onboarding.deviceAuth.success.subtext}
        />
      )}
    </ErrorHandlerDialog>
  );
};
