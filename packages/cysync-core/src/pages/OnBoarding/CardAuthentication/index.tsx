import React, { useEffect, useState } from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import {
  OnConnectCallback,
  useNavigateTo,
  useQuery,
  useStateWithFinality,
  useWhenDeviceConnected,
} from '~/hooks';
import { routes } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

import { CardTap } from './Dialogs/CardTap';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardAuthentication: React.FC = () => {
  const query = useQuery();
  const lang = useAppSelector(selectLanguage);

  const totalCards = 4;

  const [tapsPerCard, setTapsPerCard] = useState(3);
  // total number of card taps needed for authentication for all cards
  const [cardTapState, setCardTapState, isFinalCardTapState] =
    useStateWithFinality(0, tapsPerCard * totalCards);
  const navigateTo = useNavigateTo();

  const cardAuth: OnConnectCallback = async ({ connection, connectDevice }) => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    for (let cardNumber = 1; cardNumber <= totalCards; cardNumber += 1) {
      await app.authCard({
        cardNumber,
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

  useEffect(() => {
    const isPaired = query.get('isPaired') === 'true';
    setTapsPerCard(isPaired ? 2 : 3);
  }, []);

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
