import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import { OnboardingPageLayout } from '~/pages/OnBoarding/OnboardingPageLayout';
import React from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { DeviceUpdateDialogBox } from './Dialogs';

export const DeviceUpdate = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceUpdate.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <DeviceUpdateDialogBox />
    </OnboardingPageLayout>
  );
};
