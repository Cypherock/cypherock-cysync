import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useState } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';
import { getCloseAppMethod } from '~/utils';

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
      `${routes.onboarding.cardAuthentication.path}?isPaired=${res}&disableNavigation=true`,
      6000,
    );
  };

  const task = useDeviceTask(trainCard);

  const onRetry = () => {
    task.run();
  };

  return (
    <ErrorHandlerDialog
      error={task.error}
      onRetry={onRetry}
      isOnboarding
      onClose={getCloseAppMethod()}
    >
      <CardTap tapState={cardTapState} />;
    </ErrorHandlerDialog>
  );
};
