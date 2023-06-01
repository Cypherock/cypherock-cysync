import React, { useEffect } from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import {
  addKeyboardEvents,
  useNavigateTo,
  useStateWithFinality,
  useWhenDeviceConnected,
} from '~/hooks';
import { routes } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { CardTap } from './Dialogs/CardTap';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardAuthentication: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  // number of card taps needed for authentication 3 taps per card for 4 cards
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, 12);
  const navigateTo = useNavigateTo();

  useWhenDeviceConnected();

  // replace this with cardAuth function
  addKeyboardEvents({
    ' ': () => {
      setCardTapState(s => s + 1);
    },
  });

  useEffect(() => {
    if (isFinalCardTapState) navigateTo(routes.onboarding.congratulations.path);
  }, [isFinalCardTapState]);

  return (
    <OnboardingPageLayout
      img={cardTapAsideImage}
      text={lang.strings.onboarding.cardAuth.heading}
      currentState={7}
      totalState={8}
      withEmail
      withHelp
    >
      <CardTap tapState={cardTapState} />
    </OnboardingPageLayout>
  );
};
