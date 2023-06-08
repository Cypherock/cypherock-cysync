import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useState } from 'react';

import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';

import { CardTap } from './CardTap';

export const CardTrainingDialog: React.FC = () => {
  const navigateTo = useNavigateTo();
  const [cardTapState, setCardTapState] = useState(0);

  const trainCard: DeviceTask<void> = async connection => {
    const app = await ManagerApp.create(connection);
    const res = (await app.trainCard({ onWallets: async () => false }))
      .cardPaired;
    setCardTapState(1);
    navigateTo(
      `${routes.onboarding.cardAuthentication.path}?isPaired=${res}`,
      6000,
    );
  };

  const task = useDeviceTask(trainCard);

  useEffect(() => {
    task.run();

    return () => {
      task.abort();
    };
  }, []);

  return <CardTap tapState={cardTapState} />;
};
