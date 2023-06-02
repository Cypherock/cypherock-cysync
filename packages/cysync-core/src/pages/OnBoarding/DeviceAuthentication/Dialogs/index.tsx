import { ErrorDialog, SuccessDialog } from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';
import { ErrorHandlerDialog } from '~/components';

import { DeviceAuthenticating } from './Authenticating';

export const DeviceAuthDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const deviceAuth: DeviceTask<boolean> = async connection => {
    const app = await ManagerApp.create(connection);
    const res = await app.authDevice();
    return res;
  };

  const task = useDeviceTask(deviceAuth);

  useEffect(() => {
    task.run();

    return () => {
      task.abort();
    };
  }, []);

  useEffect(() => {
    if (task.result === true) {
      navigateTo(routes.onboarding.joystickTraining.path, 3000);
    }
  }, [task.result]);

  return (
    <ErrorHandlerDialog
      error={task.error}
      title={lang.strings.onboarding.deviceAuth.error}
      onRetry={() => task.run()}
    >
      {task.result === undefined && <DeviceAuthenticating />}
      {task.result === false && (
        <ErrorDialog
          title={lang.strings.onboarding.deviceAuth.error}
          subtext={lang.strings.onboarding.deviceAuth.errorSubtext}
        />
      )}
      {task.result === true && (
        <SuccessDialog title={lang.strings.onboarding.deviceAuth.success} />
      )}
    </ErrorHandlerDialog>
  );
};
