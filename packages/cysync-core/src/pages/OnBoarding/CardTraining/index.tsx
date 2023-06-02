import React, { useEffect } from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import { routes } from '~/constants';
import {
  addKeyboardEvents,
  useNavigateTo,
  useWhenDeviceConnected,
  useStateWithFinality,
} from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

import { CardTap } from './Dialogs/CardTap';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const navigateTo = useNavigateTo();
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, 1);
  useWhenDeviceConnected();

  // replace this with trainCard function
  addKeyboardEvents({
    ' ': () => {
      setCardTapState(s => s + 1);
    },
  });

  useEffect(() => {
    if (isFinalCardTapState)
      navigateTo(routes.onboarding.cardAuthentication.path, 3000);
  }, [isFinalCardTapState]);

  return (
    <OnboardingPageLayout
      img={cardTapAsideImage}
      text={lang.strings.onboarding.cardTraining.heading}
      currentState={6}
      totalState={8}
      withEmail
      withHelp
    >
      <CardTap tapState={cardTapState} />
    </OnboardingPageLayout>
  );
};
