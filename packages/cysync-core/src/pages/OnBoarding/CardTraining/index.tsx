import { cardTapAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { routes } from '~/constants';
import { useOnboardingCheckpoint } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

import { CardTrainingDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  useOnboardingCheckpoint(routes.onboarding.cardTraining.path);

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
