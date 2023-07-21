import { SuccessDialog } from '@cypherock/cysync-ui';
import { ManagerApp, TrainJoystickStatus } from '@cypherock/sdk-app-manager';
import { sleep } from '@cypherock/sdk-utils';
import React from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import {
  DeviceTask,
  useDeviceTask,
  useNavigateTo,
  useStateWithFinality,
} from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { getCloseAppMethod } from '~/utils';

import { JoystickTrainingInteraction } from './Joystick';

export const JoystickTrainingDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const [state, setState, isFinalState] = useStateWithFinality(
    TrainJoystickStatus.TRAIN_JOYSTICK_INIT,
    TrainJoystickStatus.TRAIN_JOYSTICK_CENTER + 2,
  );

  const trainJoystick: DeviceTask<void> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.trainJoystick(async s => {
      if (s < TrainJoystickStatus.TRAIN_JOYSTICK_LEFT) setState(s);
      if (s === TrainJoystickStatus.TRAIN_JOYSTICK_LEFT) {
        setState(s);
        await sleep(600);
        setState(TrainJoystickStatus.TRAIN_JOYSTICK_LEFT + 1);
      }
    });
    setState(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER + 1);
    await sleep(600);
    setState(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER + 2);
    navigateTo(
      `${routes.onboarding.cardTraining.path}?disableNavigation=true`,
      3000,
    );
  };

  const task = useDeviceTask(trainJoystick);

  const onRetry = () => {
    task.run();
  };

  return (
    <ErrorHandlerDialog
      error={task.error}
      isOnboarding
      onClose={getCloseAppMethod()}
      onRetry={onRetry}
    >
      {isFinalState || <JoystickTrainingInteraction state={state} />}
      {isFinalState && (
        <SuccessDialog
          title={lang.strings.onboarding.joystickTraining.success}
        />
      )}
    </ErrorHandlerDialog>
  );
};
