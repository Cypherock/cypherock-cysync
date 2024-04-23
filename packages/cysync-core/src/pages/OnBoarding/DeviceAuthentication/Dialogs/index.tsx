import { SuccessDialog } from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import { ErrorHandlerDialog, DeviceAuthenticating } from '~/components';
import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { getCloseAppMethod, keyValueStore } from '~/utils';

export const DeviceAuthDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const deviceAuth: DeviceTask<boolean> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.authDevice({
      email: (await keyValueStore.email.get()) ?? undefined,
      cysyncVersion: window.cysyncEnv.VERSION,
    });
    return true;
  };

  const task = useDeviceTask(deviceAuth);

  const onRetry = () => {
    task.run();
  };

  useEffect(() => {
    if (task.result) {
      navigateTo(
        `${routes.onboarding.joystickTraining.path}?disableNavigation=true`,
        3000,
      );
    }
  }, [task.result]);

  return (
    <ErrorHandlerDialog
      error={task.error}
      onRetry={onRetry}
      onClose={getCloseAppMethod()}
      isOnboarding
    >
      {task.result === undefined && (
        <DeviceAuthenticating
          title={lang.strings.onboarding.deviceAuth.title}
          subtitle={lang.strings.onboarding.deviceAuth.subtext}
        />
      )}
      {task.result && (
        <SuccessDialog
          title={lang.strings.onboarding.deviceAuth.success.title}
          subtext={lang.strings.onboarding.deviceAuth.success.subtext}
        />
      )}
    </ErrorHandlerDialog>
  );
};
