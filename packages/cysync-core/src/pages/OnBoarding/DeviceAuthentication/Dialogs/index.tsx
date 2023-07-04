import { ErrorDialog, SuccessDialog } from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { DeviceAuthenticating } from './Authenticating';

export const DeviceAuthDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const [retries, setRetries] = React.useState(0);

  const deviceAuth: DeviceTask<boolean> = async connection => {
    const app = await ManagerApp.create(connection);
    const res = await app.authDevice();
    return res;
  };

  const task = useDeviceTask(deviceAuth);

  const onRetry = () => {
    setRetries(r => r + 1);
    task.run();
  };

  useEffect(() => {
    if (task.result) {
      navigateTo(routes.onboarding.joystickTraining.path, 3000);
    }
  }, [task.result]);

  return (
    <ErrorHandlerDialog
      error={task.error}
      title={lang.strings.onboarding.deviceAuth.error}
      onRetry={onRetry}
      retries={retries}
    >
      {task.result === undefined && <DeviceAuthenticating />}
      {task.result === false && (
        <ErrorDialog
          title={lang.strings.onboarding.deviceAuth.error}
          subtext={lang.strings.onboarding.deviceAuth.errorSubtext}
          showRetry
          showReport
          iconType="misconfigured"
        />
      )}
      {task.result && (
        <SuccessDialog title={lang.strings.onboarding.deviceAuth.success} />
      )}
    </ErrorHandlerDialog>
  );
};
