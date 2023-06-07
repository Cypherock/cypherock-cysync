import React, { useState } from 'react';
import { cardTapAsideImage } from '@cypherock/cysync-ui';

import { ManagerApp } from '@cypherock/sdk-app-manager';
import { routes } from '~/constants';
import {
  useNavigateTo,
  useWhenDeviceConnected,
  OnConnectCallback,
} from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

import { CardTap } from './Dialogs/CardTap';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const navigateTo = useNavigateTo();
  const [cardTapState, setCardTapState] = useState(0);
  const cardTrain: OnConnectCallback = async ({
    connection,
    connectDevice,
  }) => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    const res = (await app.trainCard({ onWallets: async () => false }))
      .cardPaired;
    setCardTapState(1);
    navigateTo(
      `${routes.onboarding.cardAuthentication.path}?isPaired=${res}`,
      6000,
    );
    await app.destroy();
  };
  useWhenDeviceConnected(cardTrain);

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
