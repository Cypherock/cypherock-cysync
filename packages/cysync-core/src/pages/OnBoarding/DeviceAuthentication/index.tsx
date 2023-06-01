import React, { useEffect, useState } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  deviceAuthAsideImage,
} from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';

import {
  OnConnectCallback,
  useNavigateTo,
  useWhenDeviceConnected,
} from '~/hooks';
import { routes } from '~/constants';

import { Authenticating } from './Dialogs/Authenticating';
import { Success } from './Dialogs/Success';
import { Failure } from './Dialogs/Failure';
import { selectLanguage, useAppSelector } from '../../../store';

export const DeviceAuthentication: React.FC = () => {
  const [result, setResult] = useState<boolean | undefined>(undefined);
  const navigateTo = useNavigateTo();
  const lang = useAppSelector(selectLanguage);

  const deviceAuth: OnConnectCallback = async ({
    connection,
    connectDevice,
  }) => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    const res = await app.authDevice();
    await app.destroy();
    setResult(res);
  };

  useWhenDeviceConnected(deviceAuth);

  useEffect(() => {
    if (result === true) {
      navigateTo(routes.onboarding.joystickTraining.path, 3000);
    }
  }, [result]);

  return (
    <OnboardingLayout
      img={deviceAuthAsideImage}
      text={lang.strings.onboarding.deviceAuth.heading}
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
