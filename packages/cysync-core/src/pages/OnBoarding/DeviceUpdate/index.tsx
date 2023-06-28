import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { OnboardingPageLayout } from '~/pages/OnBoarding/OnboardingPageLayout';
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
      <WithConnectedDevice>
        <DeviceUpdateDialogBox />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
