import { SuccessDialog } from '@cypherock/cysync-ui';
import { ManagerApp, TrainJoystickStatus } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import {
  DeviceTask,
  useDeviceTask,
  useNavigateTo,
  useStateWithFinality,
} from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

import { JoystickTrainingInteraction } from './Joystick';

export const JoystickTrainingDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const [state, setState, isFinalState] = useStateWithFinality(
    TrainJoystickStatus.TRAIN_JOYSTICK_INIT,
    TrainJoystickStatus.TRAIN_JOYSTICK_CENTER,
  );

  const trainJoystick: DeviceTask<void> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.trainJoystick(s => {
      if (s < TrainJoystickStatus.TRAIN_JOYSTICK_CENTER) setState(s);
    });
    setState(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER);
  };

  const task = useDeviceTask(trainJoystick);

  const onRetry = () => {
    task.run();
  };

  useEffect(() => {
    if (isFinalState) navigateTo(routes.onboarding.cardTraining.path, 6000);
  }, [isFinalState]);

  return (
    <ErrorHandlerDialog
      error={task.error}
      title={lang.strings.onboarding.joystickTraining.error}
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
