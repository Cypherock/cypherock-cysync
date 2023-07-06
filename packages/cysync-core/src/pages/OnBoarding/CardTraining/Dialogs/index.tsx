import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useState } from 'react';

import { ErrorHandlerDialog } from '~/components';
import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

import { CardTap } from './CardTap';

export const CardTrainingDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  const [cardTapState, setCardTapState] = useState(0);

  const trainCard: DeviceTask<void> = async connection => {
    const app = await ManagerApp.create(connection);
    const res = (await app.trainCard({ onWallets: async () => false }))
      .cardPaired;
    setCardTapState(1);
    navigateTo(
      `${
        routes.onboarding.cardAuthentication.path
      }?isPaired=${res}&cardTrained=${true}`,
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
      title={lang.strings.onboarding.cardTraining.error}
      onRetry={onRetry}
    >
      <CardTap tapState={cardTapState} />;
    </ErrorHandlerDialog>
  );
};
