import { cardTapAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { CardAuthenticationDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

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
      <WithConnectedDevice onInitial showAnimation={false}>
        <CardAuthenticationDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
