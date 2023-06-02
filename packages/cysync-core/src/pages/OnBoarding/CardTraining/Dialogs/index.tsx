import React, { useEffect } from 'react';

import { routes } from '~/constants';
import {
  addKeyboardEvents,
  useNavigateTo,
  useStateWithFinality,
} from '~/hooks';

import { CardTap } from './CardTap';

export const CardTrainingDialog: React.FC = () => {
  const navigateTo = useNavigateTo();
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, 1);

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

  return <CardTap tapState={cardTapState} />;
};
