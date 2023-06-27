import React from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import { useAppSelector, selectLanguage } from '~/store';
import { WithConnectedDevice } from '~/components';

import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { CardTrainingDialog } from './Dialogs';

export const CardTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={cardTapAsideImage}
      text={lang.strings.onboarding.cardTraining.heading}
      currentState={6}
      totalState={8}
      withEmail
      withHelp
    >
      <WithConnectedDevice onInitial>
        <CardTrainingDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
