import React, { ReactElement, useEffect, useState } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
} from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { useNavigate } from 'react-router-dom';
import { sleep } from '@cypherock/cysync-utils';
import { deviceImage } from '../../../assets/images/onboarding';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import { Authenticating } from './Dialogs/Authenticating';
import { Success } from './Dialogs/Success';
import { Failure } from './Dialogs/Failure';
import { routes } from '../../../config';

export const DeviceAuthentication = (): ReactElement => {
  const [result, setResult] = useState<boolean | undefined>(undefined);
  const { connection, connectDevice } = useDevice();
  const navigate = useNavigate();

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
      navigate(routes.onboarding.deviceDetection.path);
    }
  }, [connection]);

  const gotoNextScreen = async () => {
    await sleep(3000);
    navigate(routes.onboarding.joystickTraining.path);
  };

  useEffect(() => {
    if (result === true) {
      gotoNextScreen();
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
