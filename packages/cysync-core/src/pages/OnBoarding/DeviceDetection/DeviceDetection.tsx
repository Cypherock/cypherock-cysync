import React, { ReactElement, useEffect } from 'react';
import {
  Container,
  Flex,
  Image,
  Typography,
  asideIcon,
  backIcon,
  disconnected,
} from '@cypherock/cysync-ui';
import { Aside } from '@cypherock/cysync-ui/src/components/molecules/Aside';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';

export const DeviceDetection = (): ReactElement => {
  const { connection } = useDevice();
  const navigate = useNavigate();

  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      navigate('/auth');
    }
  }, [connection]);
  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      <Aside
        img={asideIcon}
        text="Device Connection"
        currentState={3}
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
          justify="flex-end"
          p={{
            def: 1,
            lg: 5,
          }}
        >
          <Flex gap={8}>
            <Typography color="muted" fontSize={14}>
              Help
            </Typography>
            <Typography color="gold" fontSize={14}>
              ?
            </Typography>
          </Flex>
        </Flex>
        <Container
          $bgColor="primary"
          align="center"
          justify="center"
          width={500}
          height={267}
          shadow="popup"
          rounded={16}
          direction="column"
          display="flex"
          gap={32}
          px={5}
          pb={8}
          pt={4}
        >
          <Image src={disconnected} alt="Device not connected" />
          <Container display="flex" direction="column" gap={4}>
            <Typography variant="h5" $textAlign="center">
              Connect your X1 Vault to your PC to proceed
            </Typography>
            <Typography variant="h6" $textAlign="center" color="muted">
              Use the USB cable provided in your product packaging to connect
            </Typography>
          </Container>
        </Container>
        <Flex
          position="absolute"
          bottom={0}
          width="full"
          justify="flex-start"
          p={{
            def: 1,
            lg: 5,
          }}
        >
          <Flex gap={8}>
            <Image src={backIcon} alt="Back" />
            <Typography color="muted" fontSize={14}>
              Back
            </Typography>
          </Flex>
        </Flex>
      </Container>
    </Container>
  );
};
