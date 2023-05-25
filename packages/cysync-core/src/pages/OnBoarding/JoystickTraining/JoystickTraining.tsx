import React, { ReactElement, useEffect } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  joystickIcon,
} from '@cypherock/cysync-ui';
import { useNavigate } from 'react-router-dom';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { JoystickDialog } from './Dialogs/Joystick';
import { Success } from './Dialogs/Success';
import { useDevice } from '../../../context';
import { routes } from '../../../config';
import { DeviceConnectionStatus } from '../../../context/device/helpers';

export const JoystickTraining = (): ReactElement => {
  const [state, setState] = React.useState(0);
  const { connection, connectDevice } = useDevice();
  const navigate = useNavigate();

  const deviceAuth = async () => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    await app.trainJoystick(s => {
      setState(s);
    });
    await app.destroy();
  };
  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      deviceAuth();
    } else {
      navigate(routes.onboarding.deviceDetection.path);
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
        {state < 5 && <JoystickDialog state={state} />}
        {state === 5 && <Success />}
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};
