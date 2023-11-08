import { cardTapAll } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { CardAuthenticationDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardAuthentication: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={cardTapAll}
      text={lang.strings.onboarding.cardAuth.heading}
      currentState={7}
      totalState={8}
      withEmail
      withHelp
    >
      <WithConnectedDevice onInitial>
        <CardAuthenticationDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
