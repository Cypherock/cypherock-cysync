import { cardTapAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { useAppSelector, selectLanguage } from '~/store';

import { CardTrainingDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

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
      <WithConnectedDevice onInitial showAnimation={false}>
        <CardTrainingDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
