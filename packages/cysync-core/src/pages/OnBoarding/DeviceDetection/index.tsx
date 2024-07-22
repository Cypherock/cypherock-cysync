import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { routes } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const DeviceDetection: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      totalState={8}
      withHelp
      backTo={routes.onboarding.emailAuth.path}
    >
      <WithConnectedDevice onInitial showAnimation={false} />
    </OnboardingPageLayout>
  );
};
