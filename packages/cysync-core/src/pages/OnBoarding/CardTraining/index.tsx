import { cardTapAsideImage } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { WithConnectedDevice } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { CardTrainingDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

import { routes } from '~/constants';
import { useDevice } from '~/context';
import { useNavigateTo } from '~/hooks';
import { keyValueStore } from '~/utils';

export const CardTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();
  const { connection } = useDevice();

  useEffect(() => {
    keyValueStore.isCardAuthCompleted.get().then(isCardAuthCompleted => {
      if (!isCardAuthCompleted) return;
      if (connection) return;
      navigateTo(routes.onboarding.congratulations.path);
    });
  }, []);

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
