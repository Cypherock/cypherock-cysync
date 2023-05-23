import React, { ReactElement, useEffect } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundFooter,
  DialogBoxBackgroundHeader,
  Container,
  DialogBox,
  Image,
  Typography,
  asideIcon,
  disconnectedIcon,
  DialogBoxBody,
  OnboardingLayout,
} from '@cypherock/cysync-ui';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import { onboardingRoutes } from '../../../config';

export const DeviceDetection = (): ReactElement => {
  const { connection } = useDevice();
  const navigate = useNavigate();

  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      navigate(onboardingRoutes.deviceAuthentication.path);
    }
  }, [connection]);
  return (
    <OnboardingLayout
      img={asideIcon}
      text="Device Connection"
      currentState={3}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader help email={false} />
        <DialogBox width={500}>
          <DialogBoxBody pb={8}>
            <Image src={disconnectedIcon} alt="Device not connected" />
            <Container display="flex" direction="column" gap={4}>
              <Typography variant="h5" $textAlign="center">
                Connect your X1 Vault to your PC to proceed
              </Typography>
              <Typography variant="h6" $textAlign="center" color="muted">
                Use the USB cable provided in your product packaging to connect
              </Typography>
            </Container>
          </DialogBoxBody>
        </DialogBox>
        <DialogBoxBackgroundFooter />
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};
