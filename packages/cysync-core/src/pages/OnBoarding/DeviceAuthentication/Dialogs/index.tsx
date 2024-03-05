import { SuccessDialog, parseLangTemplate } from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useMemo } from 'react';

import { ErrorHandlerDialog, DeviceAuthenticating } from '~/components';
import { routes } from '~/constants';
import {
  DeviceTask,
  useDeviceTask,
  useDeviceUpdate,
  useNavigateTo,
} from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { getCloseAppMethod, keyValueStore } from '~/utils';

export const DeviceAuthDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const { version } = useDeviceUpdate();

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

  const successTitle = useMemo(
    () =>
      parseLangTemplate(
        lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful
          .headingWithVersion,
        { version },
      ),
    [version],
  );

  return (
    <ErrorHandlerDialog
      error={task.error}
      onRetry={onRetry}
      onClose={getCloseAppMethod()}
      isOnboarding
    >
      {task.result === undefined && (
        <DeviceAuthenticating
          title={lang.strings.deviceAuthentication.loading.title}
          subtitle={lang.strings.deviceAuthentication.loading.subtitle}
        />
      )}
      {task.result && (
        <SuccessDialog
          title={successTitle}
          subtext={lang.strings.onboarding.deviceAuth.success.subtext}
        />
      )}
    </ErrorHandlerDialog>
  );
};
