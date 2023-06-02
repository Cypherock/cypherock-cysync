import React, { useEffect } from 'react';

import {
  addKeyboardEvents,
  useNavigateTo,
  useStateWithFinality,
} from '~/hooks';
import { routes } from '~/constants';

import { CardTap } from './CardTap';

export const CardAuthenticationDialog: React.FC = () => {
  // number of card taps needed for authentication 3 taps per card for 4 cards
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, 12);
  const navigateTo = useNavigateTo();

  // replace this with cardAuth function
  addKeyboardEvents({
    ' ': () => {
      setCardTapState(s => s + 1);
    },
  });

  useEffect(() => {
    if (isFinalCardTapState) navigateTo(routes.onboarding.congratulations.path);
  }, [isFinalCardTapState]);

  return <CardTap tapState={cardTapState} />;
};
