import React, { useEffect } from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import {
  OnConnectCallback,
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

  const tapsPerCard = 3;
  const totalCards = 4;

  // number of card taps needed for authentication for 4 cards
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, tapsPerCard * totalCards);
  const navigateTo = useNavigateTo();

  const cardAuth: OnConnectCallback = async ({ connection, connectDevice }) => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    for (let cardNumber = 1; cardNumber <= totalCards; cardNumber += 1) {
      await app.authCard({
        cardIndex: cardNumber,
        isPairRequired: tapsPerCard === 3,
        onEvent: flowStatus => {
          const newState =
            Math.min(flowStatus - 1, tapsPerCard) +
            (cardNumber - 1) * tapsPerCard;
          setCardTapState(newState);
        },
      });
    }
    await app.destroy();
  };
  useWhenDeviceConnected(cardAuth);

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
      <CardTap
        tapState={cardTapState}
        tapsPerCard={tapsPerCard}
        totalCards={totalCards}
      />
    </OnboardingPageLayout>
  );
};
