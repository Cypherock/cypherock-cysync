import { AuthCardStatus, ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useRef, useState } from 'react';

import { routes } from '~/constants';
import {
  DeviceTask,
  useDeviceTask,
  useNavigateTo,
  useQuery,
  useStateWithFinality,
} from '~/hooks';

import { CardTap } from './CardTap';

export const CardAuthenticationDialog: React.FC = () => {
  const query = useQuery();

  const totalCards = 4;

  const [tapsPerCard, setTapsPerCard] = useState(3);
  // total number of card taps needed for authentication for all cards
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, tapsPerCard * totalCards);
  const sessionIdRef = useRef<string | undefined>();

  const navigateTo = useNavigateTo();

  const cardAuth: DeviceTask<void> = async connection => {
    const app = await ManagerApp.create(connection);
    for (let cardNumber = 1; cardNumber <= totalCards; cardNumber += 1) {
      const { sessionId } = await app.authCard({
        cardNumber,
        isPairRequired: tapsPerCard === 3,
        onEvent: flowStatus => {
          const newState =
            Math.min(
              flowStatus - AuthCardStatus.AUTH_CARD_STATUS_SERIAL_SIGNED + 1,
              tapsPerCard,
            ) +
            (cardNumber - 1) * tapsPerCard;
          setCardTapState(newState);
        },
        onlyFailure: cardNumber !== totalCards,
        cysyncVersion: window.cysyncEnv.VERSION,
        sessionId: sessionIdRef.current,
      });
      sessionIdRef.current = sessionId;
    }
  };

  useDeviceTask(cardAuth);

  useEffect(() => {
    if (isFinalCardTapState) navigateTo(routes.onboarding.congratulations.path);
  }, [isFinalCardTapState]);

  useEffect(() => {
    const isPaired = query.get('isPaired') === 'true';
    setTapsPerCard(isPaired ? 2 : 3);
  }, []);

  return (
    <CardTap
      tapState={cardTapState}
      tapsPerCard={tapsPerCard}
      totalCards={totalCards}
    />
  );
};
