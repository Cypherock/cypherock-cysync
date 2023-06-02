import React, { useEffect } from 'react';
import { SuccessDialog } from '@cypherock/cysync-ui';
import { ManagerApp, TrainJoystickStatus } from '@cypherock/sdk-app-manager';

import { routes } from '~/constants';
import {
  DeviceTask,
  useDeviceTask,
  useNavigateTo,
  useStateWithFinality,
} from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';
import { ErrorHandlerDialog } from '~/components';

import { JoystickTrainingInteraction } from './Joystick';

export const JoystickTrainingDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const [state, setState, isFinalState] = useStateWithFinality(
    TrainJoystickStatus.TRAIN_JOYSTICK_INIT,
    TrainJoystickStatus.TRAIN_JOYSTICK_CENTER,
  );
  const navigateTo = useNavigateTo();

  const trainJoystick: DeviceTask<void> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.trainJoystick(s => {
      if (s < TrainJoystickStatus.TRAIN_JOYSTICK_CENTER) setState(s);
    });
    setState(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER);
  };

  const task = useDeviceTask(trainJoystick);

  useEffect(() => {
    task.run();

    return () => {
      task.abort();
    };
  }, []);

  useEffect(() => {
    if (isFinalState) navigateTo(routes.onboarding.cardTraining.path, 3000);
  }, [isFinalState]);

  return (
    <ErrorHandlerDialog
      error={task.error}
      title={lang.strings.onboarding.joystickTraining.error}
      onRetry={() => task.run()}
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
