import { deviceAuthAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { useAppSelector, selectLanguage } from '~/store';

import { DeviceAuthDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const DeviceAuthentication: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={deviceAuthAsideImage}
      text={lang.strings.onboarding.deviceAuth.heading}
      currentState={4}
      totalState={8}
      withEmail
      withHelp
    >
      <WithConnectedDevice onInitial showAnimation={false}>
        <DeviceAuthDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
