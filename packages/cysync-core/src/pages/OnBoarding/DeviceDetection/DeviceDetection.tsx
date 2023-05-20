import React, { ReactElement, useEffect } from 'react';
import {
  BackgroundContainer,
  BackgroundFooterBar,
  BackgroundHeaderBar,
  Container,
  DialogueBoxContainer,
  Image,
  Typography,
  asideIcon,
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
      <BackgroundContainer>
        <BackgroundHeaderBar help email={false} />
        <DialogueBoxContainer
          align="center"
          justify="center"
          width={500}
          direction="column"
        >
          <Container
            display="flex"
            direction="column"
            gap={32}
            px={5}
            pb={8}
            pt={4}
            width={500}
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
        </DialogueBoxContainer>
        <BackgroundFooterBar />
      </BackgroundContainer>
    </Container>
  );
};
