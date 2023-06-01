import React, { ReactElement, useEffect } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  cardTapAsideImage,
} from '@cypherock/cysync-ui';
import { CardTap } from './Dialogs/CardTap';
import {
  addKeyboardEvents,
  useNavigateTo,
  useStateWithFinality,
  useWhenDeviceConnected,
} from '../../../hooks';
import { routes } from '../../../config';

export const CardAuthentication = (): ReactElement => {
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
    <OnboardingLayout
      img={cardTapAsideImage}
      text="Card Authentication"
      currentState={7}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader email help />
        <CardTap tapState={cardTapState} />
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};
