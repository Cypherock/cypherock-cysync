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
  LangDisplay,
} from '@cypherock/cysync-ui';

import { useDevice, DeviceConnectionStatus } from '~/context';
import { routes } from '~/constants';
import { defaultConnector, DefaultConnectorProps } from '~/store';
import { useNavigateTo } from '~/hooks';

const DeviceNotConnectedDialogBox: React.FC<{
  title: string;
  subtext: string;
}> = ({ title, subtext }) => (
  <DialogBox width={500}>
    <DialogBoxBody pb={8}>
      <Image src={disconnectedIcon} alt="Device not connected" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          <LangDisplay text={subtext} />
        </Typography>
      </Container>
    </DialogBoxBody>
  </DialogBox>
);

const BaseDeviceDetection: React.FC<DefaultConnectorProps> = ({
  lang,
}): ReactElement => {
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
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader help email={false} />
        <DeviceNotConnectedDialogBox
          title={lang.strings.onboarding.deviceDetection.title}
          subtext={lang.strings.onboarding.deviceDetection.subtext}
        />
        <DialogBoxBackgroundFooter />
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};

export const DeviceDetection = defaultConnector(BaseDeviceDetection);
