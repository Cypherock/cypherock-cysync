import React from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import { selectLanguage, useAppSelector } from '~/store';
import { WithConnectedDevice } from '~/components';

import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { CardAuthenticationDialog } from './Dialogs';

export const CardAuthentication: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={cardTapAsideImage}
      text={lang.strings.onboarding.cardAuth.heading}
      currentState={7}
      totalState={8}
      withEmail
      withHelp
    >
      <WithConnectedDevice>
        <CardAuthenticationDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
