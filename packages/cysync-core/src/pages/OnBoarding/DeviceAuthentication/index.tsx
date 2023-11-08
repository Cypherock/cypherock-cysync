import {
  deviceAuthenticated,
  deviceAuthenticating,
} from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { useAppSelector, selectLanguage } from '~/store';

import {
  DeviceAuthOnboardingProvider,
  useDeviceAuthOnboarding,
} from './context';
import { DeviceAuthDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

const DeviceAuthenticationPage: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { task } = useDeviceAuthOnboarding();

  return (
    <OnboardingPageLayout
      img={task.result ? deviceAuthenticated : deviceAuthenticating}
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

export const DeviceAuthentication: React.FC = () => (
  <DeviceAuthOnboardingProvider>
    <DeviceAuthenticationPage />
  </DeviceAuthOnboardingProvider>
);
