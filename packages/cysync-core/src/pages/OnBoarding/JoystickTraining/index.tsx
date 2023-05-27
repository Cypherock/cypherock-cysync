import React, { ReactElement, useEffect, useMemo } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  joystickIcon,
} from '@cypherock/cysync-ui';
import { ManagerApp, TrainJoystickStatus } from '@cypherock/sdk-app-manager';
import { JoystickDialog } from './Dialogs/Joystick';
import { Success } from './Dialogs/Success';
import { useDevice } from '../../../context';
import { routes } from '../../../config';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import { useNavigateTo } from '../../../hooks';

export const JoystickTraining = (): ReactElement => {
  const [state, setState] = React.useState<TrainJoystickStatus>(
    TrainJoystickStatus.TRAIN_JOYSTICK_INIT,
  );
  const isFinalState = useMemo(
    () => state === TrainJoystickStatus.TRAIN_JOYSTICK_CENTER,
    [state],
  );
  const { connection, connectDevice } = useDevice();
  const navigateTo = useNavigateTo();

  const trainJoystick = async () => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    await app.trainJoystick(s => {
      if (s < TrainJoystickStatus.TRAIN_JOYSTICK_CENTER) setState(s);
    });
    setState(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER);
    await app.destroy();
  };
  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      trainJoystick();
    } else {
      navigateTo(routes.onboarding.deviceDetection.path);
    }
  }, [connection]);
  return (
    <OnboardingLayout
      img={joystickIcon}
      text="Joystick Checkup"
      currentState={5}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader email help />
        {isFinalState || <JoystickDialog state={state} />}
        {isFinalState && <Success />}
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};
