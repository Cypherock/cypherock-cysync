import { AuthCardStatus, ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useRef, useState } from 'react';

import { routes } from '~/constants';
import {
  DeviceTask,
  useDeviceTask,
  useErrorHandler,
  useNavigateTo,
  useQuery,
  useStateWithFinality,
} from '~/hooks';
import { keyValueStore } from '~/utils';

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
    const cardNumberToStart = Math.floor(cardTapState / tapsPerCard) + 1;

    const app = await ManagerApp.create(connection);
    for (
      let cardNumber = cardNumberToStart;
      cardNumber <= totalCards;
      cardNumber += 1
    ) {
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
        email: (await keyValueStore.email.get()) ?? undefined,
        onlyFailure: cardNumber !== totalCards,
        cysyncVersion: window.cysyncEnv.VERSION,
        sessionId: sessionIdRef.current,
      });
      sessionIdRef.current = sessionId;
    }
  };

  const task = useDeviceTask(cardAuth);

  const onRetry = () => {
    task.run();
  };

  const { errorToShow, handleRetry } = useErrorHandler({
    error: task.error,
    onRetry,
  });

  useEffect(() => {
    if (isFinalCardTapState)
      navigateTo(routes.onboarding.congratulations.path, 1000);
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
      error={errorToShow}
      onRetry={handleRetry}
    />
  );
};
