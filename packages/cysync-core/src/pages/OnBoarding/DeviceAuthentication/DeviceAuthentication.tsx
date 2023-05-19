import React, { ReactElement, useEffect, useState } from 'react';
import {
  Container,
  Flex,
  Image,
  Typography,
  emailIcon,
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
      <Container
        $bgColor="contentGradient"
        height="full"
        width="full"
        align="center"
        position="relative"
        justify="center"
        display="flex"
        grow={1}
      >
        <Flex
          position="absolute"
          top={0}
          width="full"
          justify="space-between"
          p={{
            def: 1,
            lg: 5,
          }}
        >
          <Flex gap={16} $bgColor="highlight" rounded={10} pr={1}>
            <Image src={emailIcon} width={24} alt="Email Icon" />
            <Typography color="muted" fontSize={14}>
              user@email.com
            </Typography>
          </Flex>
          <Flex gap={8}>
            <Typography color="muted" fontSize={14}>
              Help
            </Typography>
            <Typography color="gold" fontSize={14}>
              ?
            </Typography>
          </Flex>
        </Flex>
        {result === undefined && <Authenticating />}
        {result === true && <Success />}
        {result === false && <Failure />}
      </Container>
    </Container>
  );
};
