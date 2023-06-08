import React, { useEffect } from 'react';
import {
  Container,
  DialogBox,
  Image,
  Typography,
  disconnectedIcon,
  DialogBoxBody,
  LogoOutlinedAsideImage,
  LangDisplay,
} from '@cypherock/cysync-ui';

import { useDevice, DeviceConnectionStatus } from '~/context';
import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

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

export const DeviceDetection: React.FC = () => {
  const { connection } = useDevice();
  const navigateTo = useNavigateTo();
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    if (connection && connection.status === DeviceConnectionStatus.CONNECTED) {
      navigateTo(routes.onboarding.deviceAuthentication.path);
    }
  }, [connection]);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      totalState={8}
      withHelp
      withBack
    >
      <DeviceNotConnectedDialogBox
        title={lang.strings.onboarding.deviceDetection.title}
        subtext={lang.strings.onboarding.deviceDetection.subtext}
      />
    </OnboardingPageLayout>
  );
};
