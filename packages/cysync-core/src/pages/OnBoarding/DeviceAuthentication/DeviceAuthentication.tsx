import React, { ReactElement, useEffect, useState } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
} from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { deviceImage } from '@cypherock/cysync-ui/src/assets/images/onboarding';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import { Authenticating } from './Dialogs/Authenticating';
import { Success } from './Dialogs/Success';
import { Failure } from './Dialogs/Failure';
import { routes } from '../../../config';
import { useNavigateTo } from '../../../hooks';

export const DeviceAuthentication = (): ReactElement => {
  const [result, setResult] = useState<boolean | undefined>(undefined);
  const { connection, connectDevice } = useDevice();
  const navigateTo = useNavigateTo();

  const deviceAuth = async () => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    const res = await app.authDevice();
    await app.destroy();
    setResult(res);
  };

  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      deviceAuth();
    } else {
      navigateTo(routes.onboarding.deviceDetection.path);
    }
  }, [connection]);

  useEffect(() => {
    if (result === true) {
      navigateTo(routes.onboarding.joystickTraining.path, 3000);
    }
  }, [result]);

  return (
    <OnboardingLayout
      img={deviceImage}
      text="Device Authentication"
      currentState={4}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader email help />
        {result === undefined && <Authenticating />}
        {result === false && <Failure />}
        {result === true && <Success />}
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};
