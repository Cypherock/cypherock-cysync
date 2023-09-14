import {
  IconDialogBox,
  SuccessDialog,
  Image,
  loaderIcon,
  BlurOverlay,
} from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { FC } from 'react';

import { DeviceTask, useDeviceTask } from '~/hooks';
import { keyValueStore } from '~/utils';

import {
  ErrorHandlerDialog,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '..';

export const ConnectionErrorDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

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

  const onClose = () => {
    task.abort();
    dispatch(closeDialog('deviceAuthenticationDialog'));
  };

  return (
    <BlurOverlay>
      <ErrorHandlerDialog
        error={task.error}
        onRetry={onRetry}
        onClose={onClose}
        showCloseButton
      >
        {task.result === undefined && (
          <IconDialogBox
            icon={
              <Image
                src={loaderIcon}
                alt="loader"
                animate="spin"
                $animDuration={3}
              />
            }
            title={lang.strings.deviceAuthentication.loading.title}
            subtext={lang.strings.deviceAuthentication.loading.subtitle}
          />
        )}
        {task.result && (
          <SuccessDialog
            title={lang.strings.deviceAuthentication.success.title}
            buttonText={lang.strings.buttons.done}
            handleClick={onClose}
          />
        )}
      </ErrorHandlerDialog>
    </BlurOverlay>
  );
};
