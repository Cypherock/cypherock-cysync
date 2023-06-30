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
import { OnboardingStep } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import { routes } from '~/constants';
import { useDevice, DeviceConnectionStatus } from '~/context';
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

const OnboardingMap: Record<OnboardingStep, string> = {
  [OnboardingStep.ONBOARDING_STEP_VIRGIN_DEVICE]:
    routes.onboarding.deviceAuthentication.path,
  [OnboardingStep.ONBOARDING_STEP_DEVICE_AUTH]:
    routes.onboarding.joystickTraining.path,
  [OnboardingStep.ONBOARDING_STEP_JOYSTICK_TRAINING]:
    routes.onboarding.cardTraining.path,
  [OnboardingStep.ONBOARDING_STEP_CARD_CHECKUP]:
    routes.onboarding.cardTraining.path,
  [OnboardingStep.ONBOARDING_STEP_CARD_AUTHENTICATION]:
    routes.onboarding.congratulations.path,
  [OnboardingStep.ONBOARDING_STEP_COMPLETE]:
    routes.onboarding.congratulations.path,
  [OnboardingStep.UNRECOGNIZED]: routes.onboarding.deviceAuthentication.path,
};

export const DeviceDetection: React.FC = () => {
  const { connection } = useDevice();
  const navigateTo = useNavigateTo();
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    if (connection?.status === DeviceConnectionStatus.INCOMPATIBLE) {
      navigateTo(routes.onboarding.appUpdate.path);
    } else if (
      connection?.status === DeviceConnectionStatus.CONNECTED &&
      connection.isBootloader
    ) {
      navigateTo(routes.onboarding.deviceUpdate.path);
    } else if (connection?.status === DeviceConnectionStatus.CONNECTED) {
      const step = connection.onboardingStep;
      navigateTo(OnboardingMap[step]);
    }
  }, [connection]);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      totalState={8}
      withHelp
      backTo={routes.onboarding.emailAuth.path}
    >
      <DeviceNotConnectedDialogBox
        title={lang.strings.onboarding.deviceDetection.title}
        subtext={lang.strings.onboarding.deviceDetection.subtext}
      />
    </OnboardingPageLayout>
  );
};
