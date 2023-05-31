import React, { ReactElement, useEffect } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  cardTapAsideImage,
} from '@cypherock/cysync-ui';
import { CardTap } from './Dialogs/CardTap';
import { routes } from '../../../config';
import {
  addKeyboardEvents,
  useNavigateTo,
  useWhenDeviceConnected,
} from '../../../hooks';
import { useStateWithFinality } from '../../../hooks/useStateWithFinality';

export const CardTraining = (): ReactElement => {
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
    <OnboardingLayout
      img={cardTapAsideImage}
      text="Card Tap Checkup"
      currentState={6}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader email help />
        <CardTap tapState={cardTapState} />
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};
