import React, { ReactElement, useEffect } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundFooter,
  DialogBoxBackgroundHeader,
  Container,
  DialogBox,
  Image,
  Typography,
  disconnectedIcon,
  DialogBoxBody,
  OnboardingLayout,
  LogoOutlinedAsideImage,
} from '@cypherock/cysync-ui';
import { useDevice } from '../../../context';
import { DeviceConnectionStatus } from '../../../context/device/helpers';
import { routes } from '../../../config';
import { useNavigateTo } from '../../../hooks';

const DeviceNotConnectedDialogBox = () => (
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
);

export const DeviceDetection = (): ReactElement => {
  const { connection } = useDevice();
  const navigateTo = useNavigateTo();

  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      navigateTo(routes.onboarding.deviceAuthentication.path);
    }
  }, [connection]);

  return (
    <OnboardingLayout
      img={LogoOutlinedAsideImage}
      text="Device Connection"
      currentState={3}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader help email={false} />
        <DeviceNotConnectedDialogBox />
        <DialogBoxBackgroundFooter />
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};

export default DeviceDetection;
