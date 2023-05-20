import React, { ReactElement, useEffect, useState } from 'react';
import {
  BackgroundContainer,
  BackgroundHeaderBar,
  Container,
} from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import { Aside } from '@cypherock/cysync-ui/src/components/molecules/Aside';
import { useNavigate } from 'react-router-dom';
import { deviceImage } from '../../../assets/images/onboarding';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import { Authenticating } from './Dialogs/Authenticating';
import { Success } from './Dialogs/Success';
import { Failure } from './Dialogs/Failure';

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
      navigate('/');
    }
  }, [connection]);

  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      <Aside
        img={deviceImage}
        text="Device Authentication"
        currentState={4}
        totalState={8}
      />
      <BackgroundContainer>
        <BackgroundHeaderBar email help />
        {result === undefined && <Authenticating />}
        {result === false && <Failure />}
        {result === true && <Success />}
      </BackgroundContainer>
    </Container>
  );
};
