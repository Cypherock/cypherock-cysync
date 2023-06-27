import React from 'react';
import { deviceAuthAsideImage } from '@cypherock/cysync-ui';

import { useAppSelector, selectLanguage } from '~/store';
import { WithConnectedDevice } from '~/components';

import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { DeviceAuthDialog } from './Dialogs';

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
      <WithConnectedDevice onInitial>
        <DeviceAuthDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
